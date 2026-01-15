import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'

// Load environment variables
dotenv.config()

// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

async function validateEnvironmentVariables() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, CONVEX_URL } = process.env

  if (!CONVEX_URL) {
    throw new Error('CONVEX_URL environment variable is required')
  }

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

  return { ADMIN_EMAIL, ADMIN_PASSWORD, CONVEX_URL }
}

async function createFirstAdmin() {
  try {
    // Validate environment variables
    const { ADMIN_EMAIL, ADMIN_PASSWORD, CONVEX_URL } = await validateEnvironmentVariables()

    const convex = new ConvexHttpClient(CONVEX_URL)

    // Check if any admin exists
    const existingAdmins = await convex.query(api.users.getAdmins, {})

    if (existingAdmins.length > 0) {
      console.log('⚠️  Admin user already exists!')
      return
    }

    // Check if email is already in use
    const existingUser = await convex.query(api.users.getByEmail, { email: ADMIN_EMAIL })

    if (existingUser) {
      throw new Error('Email is already in use')
    }

    // Create admin user
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    
    console.log('👤 Creating admin user...')
    await convex.mutation(api.users.create, {
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
    process.exit(0)
  }
}

createFirstAdmin()
