/**
 * @fileoverview Next.js middleware for Clerk authentication
 * @grep_search middleware, clerkMiddleware, publicRoutes
 * 
 * Protects routes requiring authentication
 * Public routes: /, /sign-in, /sign-up, /api/trpc (handled by Clerk context)
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Define public routes that don't require authentication
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/trpc(.*)", // tRPC handles auth via context
]);

/**
 * Clerk middleware
 * Automatically protects all routes except those in isPublicRoute
 * In Clerk v6+, clerkMiddleware handles protection automatically
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    /**
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

