import * as dotenv from 'dotenv'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../utils/convex'

// Load environment variables
dotenv.config()

async function fixAdminOrg() {
  try {
    const { ADMIN_EMAIL, CONVEX_URL } = process.env

    if (!CONVEX_URL) {
      throw new Error('CONVEX_URL environment variable is required')
    }

    if (!ADMIN_EMAIL) {
      throw new Error('ADMIN_EMAIL environment variable is required')
    }

    const convex = new ConvexHttpClient(CONVEX_URL)

    console.log(`🔍 Looking for admin user: ${ADMIN_EMAIL}`)
    const user = await convex.query(api.users.getByEmail, { email: ADMIN_EMAIL })

    if (!user) {
      throw new Error('Admin user not found')
    }

    console.log(`✅ Found user: ${user.email} (${user._id})`)

    // Check if user already has an org
    if (user.currentOrgId) {
      console.log(`✅ User already has an org: ${user.currentOrgId}`)
      return
    }

    console.log('🏢 Creating admin workspace...')
    const orgId = await convex.mutation(api.orgs.create, {
      name: 'Admin Workspace',
      slug: 'admin',
      createdBy: user._id,
    })

    await convex.mutation(api.memberships.create, {
      orgId,
      userId: user._id,
      role: 'OWNER',
      status: 'ACTIVE',
    })

    await convex.mutation(api.users.updateCurrentOrg, {
      id: user._id,
      currentOrgId: orgId,
    })

    console.log('✅ Admin workspace created and assigned!')
    console.log(`🏢 Workspace: Admin Workspace (slug: admin)`)
    console.log(`🎉 Admin user ${ADMIN_EMAIL} can now access org-scoped features!`)
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

fixAdminOrg()
