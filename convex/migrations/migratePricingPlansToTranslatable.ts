/**
 * Migration script to convert existing pricing plans to translatable format
 * 
 * Run this once after updating the schema to ensure existing plans work
 * with the new translatable structure.
 * 
 * Usage:
 * 1. Deploy the new schema with translatable fields
 * 2. Run this migration via Convex dashboard or CLI
 * 3. Old string values will be converted to { en: "value" } format
 */

import { mutation } from "../_generated/server"

export const migratePricingPlans = mutation({
  args: {},
  handler: async (ctx) => {
    const plans = await ctx.db.query("pricingPlans").collect()
    let migratedCount = 0

    for (const plan of plans) {
      // Check if already migrated (has name.en instead of just name)
      if (typeof plan.name === 'object' && 'en' in plan.name) {
        console.log(`Plan ${plan._id} already migrated, skipping`)
        continue
      }

      // Convert old format to new translatable format
      const updates: any = {}

      // Migrate name
      if (typeof plan.name === 'string') {
        updates.name = { en: plan.name }
      }

      // Migrate description
      if (typeof plan.description === 'string') {
        updates.description = { en: plan.description }
      }

      // Migrate features
      if (Array.isArray(plan.features) && plan.features.length > 0) {
        if (typeof plan.features[0] === 'string') {
          updates.features = plan.features.map((f: string) => ({ en: f }))
        }
      }

      // Only patch if there are updates
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(plan._id, updates)
        migratedCount++
        console.log(`Migrated plan ${plan._id}`)
      }
    }

    return {
      success: true,
      totalPlans: plans.length,
      migratedCount,
      message: `Successfully migrated ${migratedCount} of ${plans.length} plans`,
    }
  },
})
