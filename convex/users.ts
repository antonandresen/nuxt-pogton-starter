import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
  },
})

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getByStripeCustomerId = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) => q.eq("stripeCustomerId", args.stripeCustomerId))
      .first()
  },
})

export const getAdmins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "ADMIN"))
      .collect()
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .order("desc")
      .collect()
  },
})

export const create = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.optional(v.union(v.literal("USER"), v.literal("ADMIN"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("users", {
      email: args.email,
      password: args.password,
      role: args.role ?? "USER",
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateStripeCustomerId = mutation({
  args: {
    id: v.id("users"),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      stripeCustomerId: args.stripeCustomerId,
      updatedAt: Date.now(),
    })
  },
})

export const updateRole = mutation({
  args: {
    id: v.id("users"),
    role: v.union(v.literal("USER"), v.literal("ADMIN")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)
    if (!user) {
      throw new Error("User not found")
    }
    await ctx.db.patch(args.id, {
      role: args.role,
      updatedAt: Date.now(),
    })
    return await ctx.db.get(args.id)
  },
})

export const updateAvatar = mutation({
  args: {
    id: v.id("users"),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)
    if (!user) {
      throw new Error("User not found")
    }
    await ctx.db.patch(args.id, {
      avatar: args.avatar,
      updatedAt: Date.now(),
    })
    return await ctx.db.get(args.id)
  },
})

