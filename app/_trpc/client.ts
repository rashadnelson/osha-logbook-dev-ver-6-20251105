/**
 * @fileoverview tRPC client configuration for React Query
 * @grep_search createTRPCReact, httpBatchLink, AppRouter
 * 
 * Creates type-safe tRPC client hooks for use in React components
 * Enables batching of requests for better performance
 */

import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/core/api/root";

/**
 * Create typed tRPC React hooks
 * Usage in components:
 * 
 * @example
 * const { data, isLoading } = trpc.establishment.list.useQuery();
 * const createMutation = trpc.establishment.create.useMutation();
 */
export const trpc = createTRPCReact<AppRouter>();

