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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const planData = plan as any
      
      // Check if already migrated (has name.en instead of just name)
      if (typeof planData.name === 'object' && planData.name !== null && 'en' in planData.name) {
        console.log(`Plan ${plan._id} already migrated, skipping`)
        continue
      }

      // Convert old format to new translatable format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updates: any = {}

      // Migrate name
      if (typeof planData.name === 'string') {
        updates.name = { en: planData.name }
      }

      // Migrate description
      if (typeof planData.description === 'string') {
        updates.description = { en: planData.description }
      }

      // Migrate features
      if (Array.isArray(planData.features) && planData.features.length > 0) {
        const firstFeature = planData.features[0]
        // Check if features are old string format (not translatable objects)
        if (typeof firstFeature === 'string') {
          updates.features = planData.features.map((f: string) => ({ en: f }))
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
