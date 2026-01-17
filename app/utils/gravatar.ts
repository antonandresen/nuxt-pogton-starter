import md5 from 'md5'

/**
 * Generate a Gravatar URL from an email address
 * @param email - User's email address
 * @param size - Avatar size in pixels (default: 80)
 * @param defaultImage - Default image style if no Gravatar exists
 * @returns Gravatar URL
 */
export function getGravatarUrl(
  email: string,
  size: number = 80,
  defaultImage: 'mp' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' = 'identicon'
): string {
  // Normalize email
  const normalizedEmail = email.trim().toLowerCase()
  
  // Generate MD5 hash
  const hash = md5(normalizedEmail)
  
  // Build Gravatar URL
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`
}

/**
 * Get the appropriate avatar URL - custom avatar or Gravatar fallback
 */
export function getAvatarUrl(email: string, customAvatar?: string, size: number = 80): string {
  if (customAvatar) {
    return customAvatar
  }
  return getGravatarUrl(email, size)
}

