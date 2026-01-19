import crypto from "node:crypto"

export function generateApiKey() {
  const raw = `pk_${crypto.randomBytes(24).toString("hex")}`
  const keyPrefix = raw.slice(0, 10)
  const hashedKey = crypto.createHash("sha256").update(raw).digest("hex")

  return { raw, keyPrefix, hashedKey }
}

