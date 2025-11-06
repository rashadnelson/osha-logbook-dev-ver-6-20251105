/**
 * @fileoverview Root tRPC router combining all domain routers
 * @grep_search appRouter, createTRPCRouter
 * 
 * This is the main router that combines all sub-routers (establishment, incident, etc.)
 * Export this as the single source of truth for all tRPC endpoints
 */

import { createTRPCRouter } from "./trpc";
import { establishmentRouter } from "./routers/establishmentRouter";

/**
 * Root application router
 * Combines all domain-specific routers under namespaced keys
 * 
 * @example
 * // Client usage:
 * trpc.establishment.list.useQuery()
 * trpc.establishment.create.useMutation()
 */
export const appRouter = createTRPCRouter({
  establishment: establishmentRouter,
  // Future routers will be added here:
  // incident: incidentRouter,
  // export: exportRouter,
});

/**
 * Export type definition for client-side type safety
 */
export type AppRouter = typeof appRouter;

