/**
 * @fileoverview Next.js configuration for OSHA Logbook
 * @grep_search nextConfig, experimental, serverComponentsExternalPackages
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Enable React strict mode for better development warnings
   */
  reactStrictMode: true,

  /**
   * Server-side external packages
   * Moved from experimental.serverComponentsExternalPackages in Next.js 16+
   */
  serverExternalPackages: ["drizzle-orm", "@neondatabase/serverless", "winston"],

  /**
   * Turbopack configuration (required in Next.js 16+)
   * Empty config to enable Turbopack without custom webpack settings
   */
  turbopack: {},
};

export default nextConfig;

