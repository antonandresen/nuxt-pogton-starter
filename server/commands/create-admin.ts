import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import db from '../utils/db'

// Load environment variables
dotenv.config()

// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

async function validateEnvironmentVariables() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

  if (!ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL environment variable is required')
  }

  if (!ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD environment variable is required')
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(ADMIN_EMAIL)) {
    throw new Error('ADMIN_EMAIL must be a valid email address')
  }

  // Validate password requirements
  if (ADMIN_PASSWORD.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
  }

  if (!PASSWORD_REGEX.test(ADMIN_PASSWORD)) {
    throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  }

  return { ADMIN_EMAIL, ADMIN_PASSWORD }
}

async function createFirstAdmin() {
  try {
    // Validate environment variables
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = await validateEnvironmentVariables()

    // Check if any admin exists
    const existingAdminResult = await db.select()
      .from(db.schemas.users)
      .where(eq(db.schemas.users.role, 'ADMIN'))
      .limit(1)

    if (existingAdminResult.length > 0) {
      console.log('⚠️  Admin user already exists!')
      return
    }

    // Check if email is already in use
    const existingUserResult = await db.select()
      .from(db.schemas.users)
      .where(eq(db.schemas.users.email, ADMIN_EMAIL))
      .limit(1)

    if (existingUserResult.length > 0) {
      throw new Error('Email is already in use')
    }

    // Create admin user
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    
    console.log('👤 Creating admin user...')
    await db.insert(db.schemas.users).values({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'ADMIN'
    })

    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${ADMIN_EMAIL}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message)
    } else {
      console.error('❌ An unexpected error occurred')
    }
    process.exit(1)
  } finally {
    // Drizzle connections are automatically managed, no need to disconnect
    process.exit(0)
  }
}

createFirstAdmin()
