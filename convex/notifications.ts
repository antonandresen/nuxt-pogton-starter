import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireUser } from "./helpers"

export const listByUser = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit)
  },
})

export const getById = query({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const create = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      body: args.body,
      type: args.type,
      createdAt: Date.now(),
    })
  },
})

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      readAt: Date.now(),
    })
  },
})

export const markAllRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("readAt"), undefined))
      .collect()

    await Promise.all(
      unread.map((notification) =>
        ctx.db.patch(notification._id, {
          readAt: Date.now(),
        })
      )
    )
  },
})

export const listForCurrentUser = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const limit = args.limit ?? 50
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit)
  },
})

export const markReadForCurrentUser = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const notification = await ctx.db.get(args.id)
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found")
    }
    await ctx.db.patch(args.id, {
      readAt: Date.now(),
    })
  },
})

export const markAllReadForCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx)
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("readAt"), undefined))
      .collect()

    await Promise.all(
      unread.map((notification) =>
        ctx.db.patch(notification._id, {
          readAt: Date.now(),
        })
      )
    )
  },
})

