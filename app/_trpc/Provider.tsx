/**
 * @fileoverview tRPC provider wrapper with React Query
 * @grep_search TRPCProvider, QueryClient, httpBatchLink
 * 
 * Wraps the application with tRPC and React Query providers
 * Configures HTTP batching, retries, and error handling
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./client";

/**
 * Get base URL for tRPC API endpoints
 * Handles both server-side and client-side rendering
 * 
 * @returns Base URL for API calls
 */
function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Browser: use relative path
    return "";
  }

  if (process.env.VERCEL_URL) {
    // Vercel deployment
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    // Railway deployment
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }

  // Local development
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * tRPC Provider component
 * Wraps children with tRPC and React Query context
 * 
 * @param children - Child components that need tRPC access
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * Disable automatic refetching on window focus
             * Safety officers may switch tabs frequently
             */
            refetchOnWindowFocus: false,
            
            /**
             * Retry failed queries once
             * Reduces unnecessary network calls
             */
            retry: 1,
            
            /**
             * Cache data for 5 minutes
             * Establishments change infrequently
             */
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          /**
           * Construct API endpoint URL
           * Next.js 14 App Router uses /api/trpc/[trpc] route
           */
          url: `${getBaseUrl()}/api/trpc`,
          
          /**
           * Include credentials for Clerk authentication
           */
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

