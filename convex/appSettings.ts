import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./helpers"

const SETTINGS_KEY = "default"

const defaultSettings = {
  workspacesEnabled: true,
  invitationsEnabled: true,
}

export const getPublic = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("appSettings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first()

    if (!settings) {
      return defaultSettings
    }

    return {
      workspacesEnabled: settings.workspacesEnabled,
      invitationsEnabled: settings.invitationsEnabled,
    }
  },
})

export const getAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const settings = await ctx.db
      .query("appSettings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first()

    return (
      settings ?? {
        key: SETTINGS_KEY,
        ...defaultSettings,
        updatedAt: 0,
      }
    )
  },
})

export const upsertAdmin = mutation({
  args: {
    workspacesEnabled: v.boolean(),
    invitationsEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAdmin(ctx)
    const now = Date.now()
    const settings = await ctx.db
      .query("appSettings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first()

    if (settings) {
      await ctx.db.patch(settings._id, {
        workspacesEnabled: args.workspacesEnabled,
        invitationsEnabled: args.invitationsEnabled,
        updatedBy: user._id,
        updatedAt: now,
      })
      return settings._id
    }

    return await ctx.db.insert("appSettings", {
      key: SETTINGS_KEY,
      workspacesEnabled: args.workspacesEnabled,
      invitationsEnabled: args.invitationsEnabled,
      updatedBy: user._id,
      updatedAt: now,
    })
  },
})
