import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin, requireUser } from "./helpers"
import bcrypt from "bcryptjs"

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

export const listStripeCustomersForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const users = await ctx.db.query("users").order("desc").collect()
    return users
      .filter((user) => !!user.stripeCustomerId)
      .map((user) => ({
        _id: user._id,
        email: user.email,
        name: user.name,
        stripeCustomerId: user.stripeCustomerId,
        createdAt: user.createdAt,
      }))
  },
})

export const create = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("USER"), v.literal("ADMIN"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("users", {
      email: args.email,
      password: args.password,
      name: args.name,
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
    const { user: actor } = await requireUser(ctx)
    if (actor.role !== "ADMIN") {
      throw new Error("Forbidden")
    }
    const user = await ctx.db.get(args.id)
    if (!user) throw new Error("User not found")
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

export const updateAvatarForCurrentUser = mutation({
  args: {
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    await ctx.db.patch(userId, {
      avatar: args.avatar,
      updatedAt: Date.now(),
    })
    return await ctx.db.get(userId)
  },
})

export const updatePassword = mutation({
  args: {
    id: v.id("users"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)
    if (!user) {
      throw new Error("User not found")
    }
    await ctx.db.patch(args.id, {
      password: args.password,
      updatedAt: Date.now(),
    })
    return await ctx.db.get(args.id)
  },
})

export const updateCurrentOrg = mutation({
  args: {
    id: v.id("users"),
    currentOrgId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)
    if (!user) {
      throw new Error("User not found")
    }
    await ctx.db.patch(args.id, {
      currentOrgId: args.currentOrgId,
      updatedAt: Date.now(),
    })
    return await ctx.db.get(args.id)
  },
})

export const updateName = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)
    if (!user) {
      throw new Error("User not found")
    }
    await ctx.db.patch(args.id, {
      name: args.name,
      updatedAt: Date.now(),
    })
    return await ctx.db.get(args.id)
  },
})

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity?.subject) {
      return null
    }
    const userId = identity.subject as any
    return await ctx.db.get(userId)
  },
})

export const updateNameForCurrentUser = mutation({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    await ctx.db.patch(userId, {
      name: args.name,
      updatedAt: Date.now(),
    })
    return await ctx.db.get(userId)
  },
})

export const updatePasswordForCurrentUser = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, user } = await requireUser(ctx)
    const matches = await bcrypt.compare(args.currentPassword, user.password)
    if (!matches) {
      throw new Error("Invalid credentials")
    }
    const hashedPassword = await bcrypt.hash(args.newPassword, 10)
    await ctx.db.patch(userId, {
      password: hashedPassword,
      updatedAt: Date.now(),
    })
  },
})

