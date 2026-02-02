import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import type { Doc, Id } from "./_generated/dataModel"
import { requireOrgPermission, requireAdmin } from "./helpers"

const STATUS_VALUES = ["open", "in_progress", "waiting_customer", "resolved", "closed"] as const
const PRIORITY_VALUES = ["low", "normal", "high", "urgent"] as const
const CHANNEL_VALUES = ["email", "chat", "form", "api"] as const

// Create a new support ticket
export const create = mutation({
  args: {
    subject: v.string(),
    body: v.string(),
    priority: v.optional(v.string()),
    channel: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first()
    if (!user) throw new Error("User not found")

    // User creating ticket for themselves (customer perspective)
    const orgId = user.currentOrgId
    if (!orgId) throw new Error("No current org")

    const now = Date.now()
    const priority = args.priority && PRIORITY_VALUES.includes(args.priority as any) 
      ? args.priority 
      : "normal"
    const channel = args.channel && CHANNEL_VALUES.includes(args.channel as any)
      ? args.channel
      : "form"

    const ticketId = await ctx.db.insert("supportTickets", {
      orgId,
      customerId: user._id,
      subject: args.subject,
      status: "open",
      priority,
      channel,
      tags: args.tags,
      unreadByCustomer: false,
      unreadByTeam: true,
      lastMessageAt: now,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    })

    // Insert initial message
    await ctx.db.insert("supportMessages", {
      orgId,
      ticketId,
      authorId: user._id,
      body: args.body,
      isInternal: false,
      createdAt: now,
    })

    // Notify team members with support:write permission
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    for (const membership of memberships) {
      if (membership.userId !== user._id && ["OWNER", "ADMIN", "STAFF"].includes(membership.role)) {
        await ctx.db.insert("notifications", {
          userId: membership.userId,
          title: "New support ticket",
          body: `${user.name || user.email}: ${args.subject}`,
          type: "support_ticket_created",
          metadata: { ticketId },
          createdAt: now,
        })
      }
    }

    return ticketId
  },
})

// List ALL tickets (site admin view)
export const listAll = query({
  args: {
    status: v.optional(v.string()),
    assignedToId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAdmin(ctx)

    let ticketsQuery = ctx.db
      .query("supportTickets")
      .filter((q) => q.eq(q.field("deletedAt"), undefined))

    const tickets = await ticketsQuery.collect()

    // Filter in memory for optional filters
    let filteredTickets = tickets
    if (args.status) {
      filteredTickets = filteredTickets.filter(t => t.status === args.status)
    }
    if (args.assignedToId) {
      filteredTickets = filteredTickets.filter(t => t.assignedToId === args.assignedToId)
    }

    // Sort by lastMessageAt desc
    filteredTickets.sort((a, b) => b.lastMessageAt - a.lastMessageAt)

    // Fetch related data
    const customerIds = Array.from(new Set(filteredTickets.map(t => t.customerId)))
    const assignedIds = Array.from(new Set(filteredTickets.map(t => t.assignedToId).filter(Boolean))) as Id<"users">[]
    
    const customers = await Promise.all(customerIds.map(id => ctx.db.get(id)))
    const assignees = await Promise.all(assignedIds.map(id => ctx.db.get(id)))

    const customerById = new Map(customers.filter(Boolean).map(c => [c!._id, c!]))
    const assigneeById = new Map(assignees.filter(Boolean).map(a => [a!._id, a!]))

    return filteredTickets.map(ticket => {
      const customer = customerById.get(ticket.customerId)
      const assignee = ticket.assignedToId ? assigneeById.get(ticket.assignedToId) : null

      return {
        _id: ticket._id,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        tags: ticket.tags ?? [],
        channel: ticket.channel,
        unreadByTeam: ticket.unreadByTeam,
        lastMessageAt: ticket.lastMessageAt,
        createdAt: ticket.createdAt,
        customer: customer ? {
          _id: customer._id,
          email: customer.email,
          name: customer.name,
        } : null,
        assignedTo: assignee ? {
          _id: assignee._id,
          email: assignee.email,
          name: assignee.name,
        } : null,
      }
    })
  },
})

// List tickets for current org (team view)
export const listForOrg = query({
  args: {
    status: v.optional(v.string()),
    assignedToId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { orgId } = await requireOrgPermission(ctx, "support:read")

    let ticketsQuery = ctx.db
      .query("supportTickets")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))

    const tickets = await ticketsQuery.collect()

    // Filter in memory for optional filters
    let filteredTickets = tickets
    if (args.status) {
      filteredTickets = filteredTickets.filter(t => t.status === args.status)
    }
    if (args.assignedToId) {
      filteredTickets = filteredTickets.filter(t => t.assignedToId === args.assignedToId)
    }

    // Sort by lastMessageAt desc
    filteredTickets.sort((a, b) => b.lastMessageAt - a.lastMessageAt)

    // Fetch related data
    const customerIds = Array.from(new Set(filteredTickets.map(t => t.customerId)))
    const assignedIds = Array.from(new Set(filteredTickets.map(t => t.assignedToId).filter(Boolean))) as Id<"users">[]
    
    const customers = await Promise.all(customerIds.map(id => ctx.db.get(id)))
    const assignees = await Promise.all(assignedIds.map(id => ctx.db.get(id)))

    const customerById = new Map(customers.filter(Boolean).map(c => [c!._id, c!]))
    const assigneeById = new Map(assignees.filter(Boolean).map(a => [a!._id, a!]))

    return filteredTickets.map(ticket => {
      const customer = customerById.get(ticket.customerId)
      const assignee = ticket.assignedToId ? assigneeById.get(ticket.assignedToId) : null

      return {
        _id: ticket._id,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        tags: ticket.tags ?? [],
        channel: ticket.channel,
        unreadByTeam: ticket.unreadByTeam,
        lastMessageAt: ticket.lastMessageAt,
        createdAt: ticket.createdAt,
        customer: customer ? {
          _id: customer._id,
          email: customer.email,
          name: customer.name,
        } : null,
        assignedTo: assignee ? {
          _id: assignee._id,
          email: assignee.email,
          name: assignee.name,
        } : null,
      }
    })
  },
})

// List tickets for current user (customer view)
export const listForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first()
    if (!user) throw new Error("User not found")

    const tickets = await ctx.db
      .query("supportTickets")
      .withIndex("by_customerId", (q) => q.eq("customerId", user._id))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    tickets.sort((a, b) => b.lastMessageAt - a.lastMessageAt)

    return tickets.map(ticket => ({
      _id: ticket._id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      unreadByCustomer: ticket.unreadByCustomer,
      lastMessageAt: ticket.lastMessageAt,
      createdAt: ticket.createdAt,
    }))
  },
})

// Get single ticket with messages
export const get = query({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first()
    if (!user) throw new Error("User not found")

    const ticket = await ctx.db.get(args.ticketId)
    if (!ticket || ticket.deletedAt) throw new Error("Ticket not found")

    // Check access: customer can see their own, team can see org tickets
    const isCustomer = ticket.customerId === user._id
    let isTeamMember = false

    if (!isCustomer) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_orgId_userId", (q) => q.eq("orgId", ticket.orgId).eq("userId", user._id))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .first()
      
      if (membership && ["OWNER", "ADMIN", "STAFF"].includes(membership.role)) {
        isTeamMember = true
      }
    }

    if (!isCustomer && !isTeamMember) {
      throw new Error("Access denied")
    }

    // Fetch messages
    const messages = await ctx.db
      .query("supportMessages")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", args.ticketId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect()

    // Filter out internal messages for customers
    const visibleMessages = isCustomer 
      ? messages.filter(m => !m.isInternal)
      : messages

    visibleMessages.sort((a, b) => a.createdAt - b.createdAt)

    // Fetch authors
    const authorIds = Array.from(new Set(visibleMessages.map(m => m.authorId)))
    const authors = await Promise.all(authorIds.map(id => ctx.db.get(id)))
    const authorById = new Map(authors.filter(Boolean).map(a => [a!._id, a!]))

    // Fetch customer and assignee
    const customer = await ctx.db.get(ticket.customerId)
    const assignee = ticket.assignedToId ? await ctx.db.get(ticket.assignedToId) : null

    return {
      ticket: {
        _id: ticket._id,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        tags: ticket.tags ?? [],
        channel: ticket.channel,
        firstResponseAt: ticket.firstResponseAt,
        resolvedAt: ticket.resolvedAt,
        closedAt: ticket.closedAt,
        createdAt: ticket.createdAt,
        customer: customer ? {
          _id: customer._id,
          email: customer.email,
          name: customer.name,
        } : null,
        assignedTo: assignee ? {
          _id: assignee._id,
          email: assignee.email,
          name: assignee.name,
        } : null,
      },
      messages: visibleMessages.map(msg => ({
        _id: msg._id,
        body: msg.body,
        isInternal: msg.isInternal,
        attachments: msg.attachments ?? [],
        createdAt: msg.createdAt,
        editedAt: msg.editedAt,
        author: authorById.get(msg.authorId) ? {
          _id: authorById.get(msg.authorId)!._id,
          email: authorById.get(msg.authorId)!.email,
          name: authorById.get(msg.authorId)!.name,
        } : null,
      })),
      isCustomer,
      isTeamMember,
    }
  },
})

// Mark ticket as read
export const markAsRead = mutation({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first()
    if (!user) throw new Error("User not found")

    const ticket = await ctx.db.get(args.ticketId)
    if (!ticket || ticket.deletedAt) throw new Error("Ticket not found")

    const isCustomer = ticket.customerId === user._id
    let isTeamMember = false

    if (!isCustomer) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_orgId_userId", (q) => q.eq("orgId", ticket.orgId).eq("userId", user._id))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .first()
      
      if (membership && ["OWNER", "ADMIN", "STAFF"].includes(membership.role)) {
        isTeamMember = true
      }
    }

    if (!isCustomer && !isTeamMember) {
      throw new Error("Access denied")
    }

    // Mark as read
    if (isCustomer && ticket.unreadByCustomer) {
      await ctx.db.patch(ticket._id, { unreadByCustomer: false })
    } else if (isTeamMember && ticket.unreadByTeam) {
      await ctx.db.patch(ticket._id, { unreadByTeam: false })
    }
  },
})

// Send message on ticket
export const sendMessage = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    body: v.string(),
    isInternal: v.optional(v.boolean()),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
      size: v.number(),
      type: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first()
    if (!user) throw new Error("User not found")

    const ticket = await ctx.db.get(args.ticketId)
    if (!ticket || ticket.deletedAt) throw new Error("Ticket not found")

    const isCustomer = ticket.customerId === user._id
    let isTeamMember = false

    if (!isCustomer) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_orgId_userId", (q) => q.eq("orgId", ticket.orgId).eq("userId", user._id))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .first()
      
      if (membership && ["OWNER", "ADMIN", "STAFF"].includes(membership.role)) {
        isTeamMember = true
      }
    }

    if (!isCustomer && !isTeamMember) {
      throw new Error("Access denied")
    }

    // Customers can't send internal messages
    const isInternal = isTeamMember && (args.isInternal ?? false)

    const now = Date.now()

    await ctx.db.insert("supportMessages", {
      orgId: ticket.orgId,
      ticketId: args.ticketId,
      authorId: user._id,
      body: args.body,
      isInternal,
      attachments: args.attachments,
      createdAt: now,
    })

    // Update ticket
    const updates: Partial<Doc<"supportTickets">> = {
      lastMessageAt: now,
      updatedAt: now,
    }

    if (isCustomer) {
      updates.unreadByTeam = true
      updates.unreadByCustomer = false
    } else if (!isInternal) {
      updates.unreadByCustomer = true
      updates.unreadByTeam = false
      if (!ticket.firstResponseAt) {
        updates.firstResponseAt = now
      }
    }

    // Auto-reopen if customer replies
    if (isCustomer && (ticket.status === "resolved" || ticket.status === "closed")) {
      updates.status = "open"
    }

    await ctx.db.patch(args.ticketId, updates)

    // Send notifications
    if (isCustomer && !isInternal) {
      // Notify assigned team member or all team
      const memberships = await ctx.db
        .query("memberships")
        .withIndex("by_orgId", (q) => q.eq("orgId", ticket.orgId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect()

      const notifyUsers = ticket.assignedToId
        ? [ticket.assignedToId]
        : memberships
            .filter(m => ["OWNER", "ADMIN", "STAFF"].includes(m.role))
            .map(m => m.userId)

      for (const userId of notifyUsers) {
        if (userId !== user._id) {
          await ctx.db.insert("notifications", {
            userId,
            title: `New message on ticket #${ticket._id}`,
            body: args.body.substring(0, 100),
            type: "support_message",
            metadata: { ticketId: ticket._id },
            createdAt: now,
          })
        }
      }
    } else if (isTeamMember && !isInternal) {
      // Notify customer
      await ctx.db.insert("notifications", {
        userId: ticket.customerId,
        title: "New reply to your support ticket",
        body: args.body.substring(0, 100),
        type: "support_message",
        metadata: { ticketId: ticket._id },
        createdAt: now,
      })
    }
  },
})

// Update ticket (site admin only)
export const update = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    assignedToId: v.optional(v.union(v.id("users"), v.null())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const ticket = await ctx.db.get(args.ticketId)
    if (!ticket || ticket.deletedAt) throw new Error("Ticket not found")

    const updates: Partial<Doc<"supportTickets">> = {
      updatedAt: Date.now(),
    }

    if (args.status && STATUS_VALUES.includes(args.status as any)) {
      updates.status = args.status
      if (args.status === "resolved" && !ticket.resolvedAt) {
        updates.resolvedAt = Date.now()
      }
      if (args.status === "closed" && !ticket.closedAt) {
        updates.closedAt = Date.now()
      }
    }

    if (args.priority && PRIORITY_VALUES.includes(args.priority as any)) {
      updates.priority = args.priority
    }

    if (args.assignedToId !== undefined) {
      updates.assignedToId = args.assignedToId ?? undefined
    }

    if (args.tags !== undefined) {
      updates.tags = args.tags
    }

    await ctx.db.patch(args.ticketId, updates)
  },
})

// Delete ticket (site admin only)
export const remove = mutation({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const ticket = await ctx.db.get(args.ticketId)
    if (!ticket || ticket.deletedAt) throw new Error("Ticket not found")

    await ctx.db.patch(args.ticketId, {
      deletedAt: Date.now(),
    })
  },
})
