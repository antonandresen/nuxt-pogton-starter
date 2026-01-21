import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireUser } from "./helpers"

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("onboarding")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()
  },
})

export const upsert = mutation({
  args: {
    userId: v.id("users"),
    completedSteps: v.array(v.string()),
    completed: v.boolean(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("onboarding")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, {
        completedSteps: args.completedSteps,
        completed: args.completed,
        data: args.data,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("onboarding", {
      userId: args.userId,
      completedSteps: args.completedSteps,
      completed: args.completed,
      data: args.data,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx)
    return await ctx.db
      .query("onboarding")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()
  },
})

export const upsertForCurrentUser = mutation({
  args: {
    completedSteps: v.array(v.string()),
    completed: v.boolean(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const existing = await ctx.db
      .query("onboarding")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()

    const now = Date.now()
    if (existing) {
      await ctx.db.patch(existing._id, {
        completedSteps: args.completedSteps,
        completed: args.completed,
        data: args.data,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("onboarding", {
      userId,
      completedSteps: args.completedSteps,
      completed: args.completed,
      data: args.data,
      createdAt: now,
      updatedAt: now,
    })
  },
})

