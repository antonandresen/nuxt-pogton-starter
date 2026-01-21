import { v } from "convex/values"
import { action, mutation, query } from "./_generated/server"
import { api } from "./_generated/api"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { requireAdmin } from "./helpers"

const CONFIG_KEY = "default"

export const getPublicConfig = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db
      .query("aiChatConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first()

    if (!config) {
      return {
        enabled: false,
        greeting: "Hi! Ask me anything about the product.",
        ctaLabel: undefined,
        ctaUrl: undefined,
      }
    }

    return {
      enabled: config.enabled,
      greeting: config.greeting,
      ctaLabel: config.ctaLabel,
      ctaUrl: config.ctaUrl,
    }
  },
})

export const getRuntimeConfig = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db
      .query("aiChatConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first()

    if (!config) {
      return {
        enabled: false,
        model: "gpt-4o-mini",
        systemPrompt: "",
        greeting: "Hi! Ask me anything about the product.",
        ctaLabel: undefined,
        ctaUrl: undefined,
        maxTokens: 512,
        temperature: 0.4,
      }
    }

    return config
  },
})

export const ask = action({
  args: {
    messages: v.array(v.object({ role: v.string(), content: v.string() })),
    page: v.optional(
      v.object({
        path: v.optional(v.string()),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    if (!args.messages.length) {
      throw new Error("Messages are required")
    }

    const config = await ctx.runQuery(api.aiChat.getRuntimeConfig, {})
    if (!config?.enabled) {
      throw new Error("AI chat disabled")
    }

    const pageContext = [
      args.page?.title ? `Page title: ${args.page.title}` : null,
      args.page?.description ? `Page description: ${args.page.description}` : null,
      args.page?.path ? `Page path: ${args.page.path}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    const summaries = await ctx.runQuery(api.cms.listPublishedSummaries, {})
    const contentContext = summaries
      .map((page: any) => `- ${page.title} (${page.slug}): ${page.excerpt || page.content}`)
      .join("\n")

    const systemPrompt = [
      config.systemPrompt || "You are a helpful product assistant.",
      pageContext ? `\nCurrent page context:\n${pageContext}` : "",
      contentContext ? `\nPublished CMS content:\n${contentContext}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    const { text } = await generateText({
      model: openai(config.model || "gpt-4o-mini"),
      system: systemPrompt,
      messages: args.messages.map((message) => ({
        role: message.role as "user" | "assistant",
        content: message.content,
      })),
      temperature: config.temperature ?? 0.4,
      maxTokens: config.maxTokens ?? 512,
    })

    return { message: text }
  },
})

export const getAdminConfig = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return await ctx.db
      .query("aiChatConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first()
  },
})

export const upsertAdminConfig = mutation({
  args: {
    enabled: v.boolean(),
    model: v.string(),
    systemPrompt: v.optional(v.string()),
    greeting: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),
    ctaUrl: v.optional(v.string()),
    maxTokens: v.optional(v.number()),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAdmin(ctx)
    const now = Date.now()
    const existing = await ctx.db
      .query("aiChatConfig")
      .withIndex("by_key", (q) => q.eq("key", CONFIG_KEY))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        enabled: args.enabled,
        model: args.model,
        systemPrompt: args.systemPrompt,
        greeting: args.greeting,
        ctaLabel: args.ctaLabel,
        ctaUrl: args.ctaUrl,
        maxTokens: args.maxTokens,
        temperature: args.temperature,
        updatedBy: user._id,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("aiChatConfig", {
      key: CONFIG_KEY,
      enabled: args.enabled,
      model: args.model,
      systemPrompt: args.systemPrompt,
      greeting: args.greeting,
      ctaLabel: args.ctaLabel,
      ctaUrl: args.ctaUrl,
      maxTokens: args.maxTokens,
      temperature: args.temperature,
      updatedBy: user._id,
      updatedAt: now,
    })
  },
})

