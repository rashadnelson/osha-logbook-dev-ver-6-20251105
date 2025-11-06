/**
 * @fileoverview Landing page / dashboard entry point
 * @grep_search HomePage, redirect, establishments
 * 
 * Root page that redirects authenticated users to dashboard
 * Shows sign-in prompt for unauthenticated users
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * Home page component
 * Redirects authenticated users to establishments dashboard
 * Shows landing page for unauthenticated users
 */
export default async function HomePage() {
  const user = await currentUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect("/establishments");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">
          OSHA Logbook
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Manage workplace injury and illness records with confidence.
          Export OSHA-compliant CSV files for Form 300, 300A, and 301.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-in"
            className="btn-primary"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="btn-secondary"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="card">
            <h3 className="mb-2">✓ OSHA Compliant</h3>
            <p className="text-slate-600">
              Export strict-schema CSV files that match OSHA ITA portal requirements exactly
            </p>
          </div>

          <div className="card">
            <h3 className="mb-2">📊 Multi-Year Support</h3>
            <p className="text-slate-600">
              Manage records across multiple years and establishments
            </p>
          </div>

          <div className="card">
            <h3 className="mb-2">🔒 Secure & Simple</h3>
            <p className="text-slate-600">
              Email-only authentication, designed for safety officers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

