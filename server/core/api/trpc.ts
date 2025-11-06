/**
 * @fileoverview Core tRPC setup with Clerk authentication context
 * @grep_search trpc, createTRPCContext, protectedProcedure, publicProcedure
 * 
 * This module defines the tRPC context, procedures, and base router factory.
 * It integrates Clerk authentication and provides protected/public procedure builders.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "../db";
import * as Sentry from "@sentry/nextjs";

/**
 * Creates the tRPC context for each request
 * Attaches Clerk user and Drizzle DB instance to context
 * 
 * @param _opts - Fetch API context options (req, resHeaders, info)
 * @returns Context object with auth user and db instance
 */
export const createTRPCContext = async (_opts: FetchCreateContextFnOptions) => {
  try {
    const user = await currentUser();
    
    return {
      db,
      userId: user?.id ?? null,
      user: user ?? null,
    };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { component: "trpc-context" },
    });
    
    // Return unauthenticated context on error
    return {
      db,
      userId: null,
      user: null,
    };
  }
};

/**
 * Initialize tRPC with context type inference
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof Error ? error.cause.message : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

/**
 * Public procedure - accessible without authentication
 * Use for health checks, public data endpoints
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires Clerk authentication
 * Throws UNAUTHORIZED if user is not authenticated
 * Use for all user-specific operations
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.user) {
    Sentry.addBreadcrumb({
      category: "auth",
      message: "Unauthorized access attempt",
      level: "warning",
    });
    
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to perform this action",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      user: ctx.user,
    },
  });
});

