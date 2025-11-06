/**
 * @fileoverview tRPC router for establishment CRUD operations
 * @grep_search establishmentRouter, protectedProcedure, establishments
 * 
 * Provides endpoints for creating, reading, updating, and deleting establishments
 * All mutations are protected and require Clerk authentication
 * Future: Add subscription enforcement middleware
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { establishments } from "../../db/schema";

/**
 * Input validation schema for creating/updating establishments
 * Matches OSHA requirements for establishment identification
 */
const establishmentInputSchema = z.object({
  name: z.string().min(1, "Establishment name is required").max(255),
  address: z.string().min(1, "Address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().length(2, "State must be 2-letter code (e.g., CA, TX)").toUpperCase(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format").max(10),
  naicsCode: z.string().regex(/^\d{6}$/, "NAICS code must be exactly 6 digits").optional(),
  industryDescription: z.string().max(500).optional(),
  averageEmployees: z.number().int().min(0, "Average employees must be 0 or greater"),
});

/**
 * Establishment router
 * Handles all CRUD operations for establishments table
 */
export const establishmentRouter = createTRPCRouter({
  /**
   * List all establishments for the authenticated user
   * Returns establishments ordered by creation date (newest first)
   */
  list: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        Sentry.addBreadcrumb({
          category: "db-query",
          message: `Fetching establishments for user ${ctx.userId}`,
          level: "info",
        });

        const results = await ctx.db
          .select()
          .from(establishments)
          .where(eq(establishments.userId, ctx.userId))
          .orderBy(establishments.createdAt);

        return results;
      } catch (error) {
        Sentry.captureException(error, {
          tags: { component: "establishmentRouter.list", userId: ctx.userId },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch establishments",
          cause: error,
        });
      }
    }),

  /**
   * Get a single establishment by ID
   * Ensures user owns the establishment before returning
   */
  getById: protectedProcedure
    .input(z.object({
      id: z.string().uuid("Invalid establishment ID"),
    }))
    .query(async ({ ctx, input }) => {
      try {
        Sentry.addBreadcrumb({
          category: "db-query",
          message: `Fetching establishment ${input.id}`,
          level: "info",
        });

        const result = await ctx.db
          .select()
          .from(establishments)
          .where(
            and(
              eq(establishments.id, input.id),
              eq(establishments.userId, ctx.userId)
            )
          )
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Establishment not found or you do not have access",
          });
        }

        return result[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        Sentry.captureException(error, {
          tags: { component: "establishmentRouter.getById", establishmentId: input.id },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch establishment",
          cause: error,
        });
      }
    }),

  /**
   * Create a new establishment
   * Ties establishment to authenticated user's Clerk ID
   * 
   * @returns Newly created establishment with generated UUID
   */
  create: protectedProcedure
    .input(establishmentInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        Sentry.addBreadcrumb({
          category: "db-mutation",
          message: `Creating establishment for user ${ctx.userId}`,
          level: "info",
        });

        const result = await ctx.db
          .insert(establishments)
          .values({
            userId: ctx.userId,
            name: input.name,
            address: input.address,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            naicsCode: input.naicsCode || null,
            industryDescription: input.industryDescription || null,
            averageEmployees: input.averageEmployees,
            updatedAt: new Date(),
          })
          .returning();

        if (result.length === 0) {
          throw new Error("Insert failed - no rows returned");
        }

        Sentry.addBreadcrumb({
          category: "db-mutation",
          message: `Successfully created establishment ${result[0]!.id}`,
          level: "info",
        });

        return result[0];
      } catch (error) {
        Sentry.captureException(error, {
          tags: { component: "establishmentRouter.create", userId: ctx.userId },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create establishment",
          cause: error,
        });
      }
    }),

  /**
   * Update an existing establishment
   * Validates ownership before allowing update
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid("Invalid establishment ID"),
      data: establishmentInputSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // First verify ownership
        const existing = await ctx.db
          .select()
          .from(establishments)
          .where(
            and(
              eq(establishments.id, input.id),
              eq(establishments.userId, ctx.userId)
            )
          )
          .limit(1);

        if (existing.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Establishment not found or you do not have access",
          });
        }

        Sentry.addBreadcrumb({
          category: "db-mutation",
          message: `Updating establishment ${input.id}`,
          level: "info",
        });

        const result = await ctx.db
          .update(establishments)
          .set({
            ...input.data,
            updatedAt: new Date(),
          })
          .where(eq(establishments.id, input.id))
          .returning();

        return result[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        Sentry.captureException(error, {
          tags: { component: "establishmentRouter.update", establishmentId: input.id },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update establishment",
          cause: error,
        });
      }
    }),

  /**
   * Delete an establishment
   * Validates ownership before allowing deletion
   * Note: Cascades to subscriptions via FK constraint
   */
  delete: protectedProcedure
    .input(z.object({
      id: z.string().uuid("Invalid establishment ID"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // First verify ownership
        const existing = await ctx.db
          .select()
          .from(establishments)
          .where(
            and(
              eq(establishments.id, input.id),
              eq(establishments.userId, ctx.userId)
            )
          )
          .limit(1);

        if (existing.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Establishment not found or you do not have access",
          });
        }

        Sentry.addBreadcrumb({
          category: "db-mutation",
          message: `Deleting establishment ${input.id}`,
          level: "info",
        });

        await ctx.db
          .delete(establishments)
          .where(eq(establishments.id, input.id));

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        Sentry.captureException(error, {
          tags: { component: "establishmentRouter.delete", establishmentId: input.id },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete establishment",
          cause: error,
        });
      }
    }),
});

