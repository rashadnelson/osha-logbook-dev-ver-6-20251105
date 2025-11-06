/**
 * @fileoverview Drizzle ORM schema definitions for OSHA Logbook
 * @grep_search establishments, subscriptions, pgTable, uuid
 * 
 * Defines all database tables using Drizzle ORM conventions:
 * - UUID primary keys with randomUUID() defaults
 * - Explicit foreign key constraints
 * - Timestamps for audit trails
 * - Relations for type-safe joins
 */

import { pgTable, uuid, varchar, integer, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Establishments table
 * Each establishment represents a physical location that must maintain OSHA logs
 * One Clerk user can own multiple establishments
 * Each establishment can have multiple yearly subscriptions
 */
export const establishments = pgTable("establishments", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  /**
   * Clerk user ID who owns this establishment
   * Format: user_xxxxxxxxxxxxxxxxxxxxx
   */
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  /**
   * Legal name of the establishment as it will appear on OSHA forms
   */
  name: varchar("name", { length: 255 }).notNull(),
  
  /**
   * Street address of the establishment
   */
  address: varchar("address", { length: 500 }).notNull(),
  
  city: varchar("city", { length: 100 }).notNull(),
  
  /**
   * Two-letter state code (e.g., CA, TX, NY)
   */
  state: varchar("state", { length: 2 }).notNull(),
  
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  
  /**
   * 6-digit NAICS code for OSHA industry classification
   * Optional but strongly recommended for OSHA compliance
   * @example "332710" for Machine Shops
   */
  naicsCode: varchar("naics_code", { length: 6 }),
  
  /**
   * Human-readable industry description
   * Optional supplementary information
   */
  industryDescription: varchar("industry_description", { length: 500 }),
  
  /**
   * Average number of employees during the reporting year
   * Used for OSHA 300A calculations
   */
  averageEmployees: integer("average_employees").notNull().default(0),
  
  /**
   * Audit timestamps
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Subscriptions table
 * Tracks Clerk paid subscriptions for each establishment per calendar year
 * Enforces business rule: 1 subscription per establishment per year = $99/year
 */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  /**
   * Foreign key to establishments table
   */
  establishmentId: uuid("establishment_id").notNull(),
  
  /**
   * Calendar year this subscription covers (e.g., 2024, 2025)
   */
  year: integer("year").notNull(),
  
  /**
   * Clerk subscription ID for payment tracking
   * Format: sub_xxxxxxxxxxxxxxxxxxxxx
   */
  clerkSubscriptionId: varchar("clerk_subscription_id", { length: 255 }).notNull(),
  
  /**
   * Subscription status: active | cancelled | expired
   * - active: User can read/write incidents for this establishment+year
   * - cancelled: Subscription was cancelled but may still be in grace period
   * - expired: Subscription ended, user has read-only access
   */
  status: varchar("status", { length: 50 }).notNull().default("active"),
  
  /**
   * Audit timestamps
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  /**
   * Foreign key constraint to establishments
   */
  establishmentFk: foreignKey({
    columns: [table.establishmentId],
    foreignColumns: [establishments.id],
    name: "subscriptions_establishment_fk"
  }).onDelete("cascade"),
}));

/**
 * Relations for type-safe queries
 * Enables: db.query.establishments.findMany({ with: { subscriptions: true } })
 */
export const establishmentsRelations = relations(establishments, ({ many }) => ({
  subscriptions: many(subscriptions),
  // Future relations:
  // incidents: many(incidents),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  establishment: one(establishments, {
    fields: [subscriptions.establishmentId],
    references: [establishments.id],
  }),
}));
