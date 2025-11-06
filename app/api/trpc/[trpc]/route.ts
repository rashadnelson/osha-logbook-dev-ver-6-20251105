/**
 * @fileoverview Next.js App Router API route handler for tRPC
 * @grep_search fetchRequestHandler, appRouter, createTRPCContext
 * 
 * Handles all tRPC requests through Next.js 14 App Router
 * Maps HTTP requests to tRPC procedures
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/server/core/api/root";
import { createTRPCContext } from "@/server/core/api/trpc";

/**
 * Handler for tRPC requests
 * Supports both GET (queries) and POST (mutations) methods
 * 
 * @param req - Next.js request object
 */
const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };

