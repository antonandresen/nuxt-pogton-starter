/**
 * rate-limit.ts - Nitro server middleware
 *
 * Multi-layer protection for API routes:
 *  1. Bot UA blocking    - reject known scraper user agents immediately
 *  2. Origin validation  - reject requests not from our own domain
 *  3. Rate limiting      - token-bucket per client IP
 *
 * Rate limit tiers:
 *  - Auth routes          (/api/auth, /api/convex/token): 10 req/min
 *  - Write routes         (non-GET /api/* mutations):     20 req/min
 *  - Public read routes:                                  60 req/min
 *  - Default:                                             60 req/min
 */

// ── 1. Known scraper / bot user agents ────────────────────────────────────────
const BLOCKED_UA_PATTERNS = [
  /python-requests/i,
  /python-urllib/i,
  /aiohttp/i,
  /httpx/i,
  /go-http-client/i,
  /java\/\d/i,
  /okhttp/i,
  /libcurl/i,
  /\bcurl\b/i,
  /wget/i,
  /scrapy/i,
  /beautifulsoup/i,
  /mechanize/i,
  /node-fetch/i,
  /axios\/\d/i,
  /got\/\d+\.\d+/i,
  /undici/i,
  /\bbot\b/i,
  /\bcrawler\b/i,
  /\bspider\b/i,
  /\bscraper\b/i,
  /\bheadless\b/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /cypress/i,
]

// Allowed bots (SEO crawlers we want to keep)
const ALLOWED_BOTS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /discordbot/i,
  /linkedinbot/i,
]

function isBotUA(ua: string): boolean {
  if (!ua) return true
  if (ALLOWED_BOTS.some(p => p.test(ua))) return false
  return BLOCKED_UA_PATTERNS.some(p => p.test(ua))
}

// ── 2. Allowed origins ────────────────────────────────────────────────────────
// Update these to match your deployment domain(s)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  // Add your production domain here, e.g.:
  // 'https://your-app.netlify.app',
  // 'https://yourdomain.com',
]

function isAllowedOrigin(event: any): boolean {
  const origin = getHeader(event, 'origin')
  const referer = getHeader(event, 'referer')

  // No Origin/Referer = same-origin browser nav, SSR fetches, etc.
  if (!origin && !referer) return true

  if (origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o))) return true
  if (referer && ALLOWED_ORIGINS.some(o => referer.startsWith(o))) return true

  return false
}

// ── 3. Rate limiting (token bucket) ──────────────────────────────────────────

interface Bucket {
  tokens: number
  lastRefill: number
}

const buckets = new Map<string, Bucket>()

let lastEvict = Date.now()
function evictStale() {
  const now = Date.now()
  if (now - lastEvict < 5 * 60 * 1000) return
  lastEvict = now
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > 10 * 60 * 1000) buckets.delete(key)
  }
}

interface RateLimitTier {
  capacity: number
  refillRate: number
}

const TIERS: Record<string, RateLimitTier> = {
  auth:    { capacity: 10, refillRate: 10 / 60 },
  write:   { capacity: 20, refillRate: 20 / 60 },
  public:  { capacity: 60, refillRate: 60 / 60 },
  default: { capacity: 60, refillRate: 60 / 60 },
}

function getTier(path: string, method: string): string {
  if (path.startsWith('/api/auth') || path.startsWith('/api/convex/token')) return 'auth'
  if (method !== 'GET' && path.startsWith('/api/')) return 'write'
  return 'default'
}

function getClientIp(event: any): string {
  const cfIp = getHeader(event, 'cf-connecting-ip')
  if (cfIp) return cfIp
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}

function isRateLimited(ip: string, tier: RateLimitTier): boolean {
  const key = `${ip}:${tier.capacity}`
  const now = Date.now()
  let bucket = buckets.get(key)

  if (!bucket) {
    bucket = { tokens: tier.capacity, lastRefill: now }
    buckets.set(key, bucket)
  }

  const elapsed = (now - bucket.lastRefill) / 1000
  bucket.tokens = Math.min(tier.capacity, bucket.tokens + elapsed * tier.refillRate)
  bucket.lastRefill = now

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    return false
  }
  return true
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default defineEventHandler((event) => {
  const path = event.path ?? getRequestURL(event).pathname

  // Only protect API routes
  if (!path.startsWith('/api/')) return

  // Skip internal SSR requests (Nitro's $fetch during SSR)
  const remoteAddr = getHeader(event, 'x-forwarded-for') || getHeader(event, 'cf-connecting-ip')
  const ua = getHeader(event, 'user-agent') ?? ''
  if (!remoteAddr && !ua) return

  // Skip webhook routes (have their own signature verification)
  if (path.startsWith('/api/webhooks/')) return

  const method = getMethod(event)

  // ── Layer 1: Block bot UAs ──────────────────────────────────────────────
  if (isBotUA(ua)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // ── Layer 2: Origin check on sensitive routes ───────────────────────────
  const isSensitive = method !== 'GET' ||
    path.startsWith('/api/auth') ||
    path.startsWith('/api/convex/token')

  if (isSensitive && !isAllowedOrigin(event)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  // ── Layer 3: Rate limiting ──────────────────────────────────────────────
  evictStale()

  const tierName = getTier(path, method)
  const tier = TIERS[tierName]
  const ip = getClientIp(event)

  if (isRateLimited(ip, tier)) {
    throw createError({
      statusCode: 429,
      message: 'Too Many Requests',
      data: { retryAfter: Math.ceil(1 / tier.refillRate) },
    })
  }
})
