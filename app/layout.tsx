/**
 * @fileoverview Root layout with Clerk authentication provider
 * @grep_search ClerkProvider, RootLayout, html, body
 * 
 * This is the root layout that wraps the entire application
 * Provides Clerk authentication context to all child components
 */

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OSHA Logbook - Safety Incident Management",
  description: "Manage OSHA 300/301 injury and illness records with confidence. Export compliant CSV files for small manufacturing companies.",
  keywords: ["OSHA", "safety", "compliance", "incident management", "manufacturing"],
};

/**
 * Root layout component
 * Wraps entire app with Clerk authentication provider
 * 
 * @param children - Page content
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0F172A", // slate-900
          colorBackground: "#FFFFFF",
          colorText: "#0F172A",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-slate-50 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

