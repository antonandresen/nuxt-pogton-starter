import { pgTable, serial, varchar, text, timestamp, integer, boolean, doublePrecision, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enum for user roles
export const roleEnum = pgEnum('Role', ['USER', 'ADMIN'])

// Users table
export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  stripeCustomerId: varchar('stripeCustomerId', { length: 255 }).unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
  role: roleEnum('role').notNull().default('USER')
})

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull(),
  stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  priceId: text('priceId'),
  currentPeriodStart: timestamp('currentPeriodStart'),
  currentPeriodEnd: timestamp('currentPeriodEnd'),
  cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').notNull().default(false),
  paymentMethodBrand: varchar('paymentMethodBrand', { length: 50 }),
  paymentMethodLast4: varchar('paymentMethodLast4', { length: 4 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt')
})

// Purchases table
export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull(),
  stripeSessionId: text('stripeSessionId').notNull().unique(),
  stripePaymentId: text('stripePaymentId').notNull().unique(),
  productId: text('productId').notNull(),
  productName: text('productName').notNull(),
  amount: doublePrecision('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt')
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  purchases: many(purchases)
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id]
  })
}))

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id]
  })
}))

// Export types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
export type Purchase = typeof purchases.$inferSelect
export type NewPurchase = typeof purchases.$inferInsert
