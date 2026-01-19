import type { H3Event } from "h3"

type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function getClientIdentifier(event: H3Event) {
  const forwarded = event.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || event.node.req.socket.remoteAddress || "unknown"
  return ip
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count += 1
  store.set(key, entry)
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

