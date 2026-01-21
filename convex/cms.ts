import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireOrgPermission, requireUser, toSlug } from "./helpers"

const STATUS_VALUES = ["draft", "published"] as const

export const listForCurrentOrg = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await requireOrgPermission(ctx, "cms:read")
    return await ctx.db
      .query("cmsPages")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .collect()
  },
})

export const getByIdForCurrentOrg = query({
  args: { id: v.id("cmsPages") },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "cms:read")
    const page = await ctx.db.get(args.id)
    if (!page || page.orgId !== orgId || page.deletedAt) {
      return null
    }
    return page
  },
})

export const getBySlugForCurrentOrg = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "cms:read")
    return await ctx.db
      .query("cmsPages")
      .withIndex("by_orgId_slug", (q) => q.eq("orgId", orgId).eq("slug", args.slug))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .first()
  },
})

export const getPublishedByOrgSlugAndSlug = query({
  args: {
    orgSlug: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.orgSlug))
      .first()

    if (!org) return null

    return await ctx.db
      .query("cmsPages")
      .withIndex("by_orgId_slug", (q) => q.eq("orgId", org._id).eq("slug", args.slug))
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("status"), "published")
        )
      )
      .first()
  },
})

export const listPublishedSummaries = query({
  args: {
    orgSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let orgId: string | null = null
    if (args.orgSlug) {
      const org = await ctx.db
        .query("organizations")
        .withIndex("by_slug", (q) => q.eq("slug", args.orgSlug!))
        .first()
      orgId = org?._id ?? null
    }

    const base = ctx.db.query("cmsPages")
    const query = orgId
      ? base.withIndex("by_orgId", (q) => q.eq("orgId", orgId as any))
      : base

    const pages = await query
      .filter((q) =>
        q.and(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("status"), "published")
        )
      )
      .order("desc")
      .collect()

    return pages.map((page) => ({
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt ?? "",
      content: page.content.slice(0, 1200),
      orgId: page.orgId,
    }))
  },
})

export const upsertForCurrentOrg = mutation({
  args: {
    id: v.optional(v.id("cmsPages")),
    title: v.string(),
    slug: v.optional(v.string()),
    status: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orgId, userId } = await requireOrgPermission(ctx, "cms:write")
    if (!STATUS_VALUES.includes(args.status as any)) {
      throw new Error("Invalid status")
    }

    const baseSlug = toSlug(args.slug || args.title)
    const existing = await ctx.db
      .query("cmsPages")
      .withIndex("by_orgId_slug", (q) => q.eq("orgId", orgId).eq("slug", baseSlug))
      .first()

    const slug =
      existing && existing._id !== args.id
        ? `${baseSlug}-${Math.random().toString(16).slice(2, 8)}`
        : baseSlug

    const now = Date.now()
    const publishedAt = args.status === "published" ? now : undefined

    if (args.id) {
      const page = await ctx.db.get(args.id)
      if (!page || page.orgId !== orgId || page.deletedAt) {
        throw new Error("Not found")
      }

      await ctx.db.patch(args.id, {
        title: args.title,
        slug,
        status: args.status,
        content: args.content,
        excerpt: args.excerpt,
        seoTitle: args.seoTitle,
        seoDescription: args.seoDescription,
        publishedAt: args.status === "published" ? page.publishedAt ?? publishedAt : undefined,
        updatedBy: userId,
        updatedAt: now,
      })

      return args.id
    }

    return await ctx.db.insert("cmsPages", {
      orgId,
      title: args.title,
      slug,
      status: args.status,
      content: args.content,
      excerpt: args.excerpt,
      seoTitle: args.seoTitle,
      seoDescription: args.seoDescription,
      publishedAt,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const deleteForCurrentOrg = mutation({
  args: { id: v.id("cmsPages") },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "cms:write")
    const page = await ctx.db.get(args.id)
    if (!page || page.orgId !== orgId || page.deletedAt) {
      throw new Error("Not found")
    }
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

