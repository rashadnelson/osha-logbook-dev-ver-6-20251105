/**
 * @fileoverview Dashboard layout with navigation and tRPC provider
 * @grep_search DashboardLayout, UserButton, TRPCProvider
 * 
 * Wraps all dashboard pages with:
 * - Clerk authentication check
 * - Navigation header
 * - tRPC React Query provider
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { TRPCProvider } from "@/app/_trpc/Provider";
import { EstablishmentProvider } from "@/app/hooks/useEstablishmentContext";
import { EstablishmentSelector } from "@/app/components/EstablishmentSelector";
import { YearSelector } from "@/app/components/YearSelector";

/**
 * Dashboard layout component
 * Enforces authentication and provides navigation
 * 
 * @param children - Dashboard page content
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Redirect to sign-in if not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <TRPCProvider>
      <EstablishmentProvider>
      <div className="min-h-screen flex flex-col">
        {/* Navigation Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <Link href="/establishments" className="text-xl font-bold text-slate-900">
                  OSHA Logbook
                </Link>

                <nav className="flex gap-6">
                  <Link
                    href="/establishments"
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Establishments
                  </Link>
                  <Link
                    href="/incidents"
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Incidents
                  </Link>
                  <Link
                    href="/reports"
                    className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Reports
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-6">
                <EstablishmentSelector showLabel={false} />
                <YearSelector />
                <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                  <span className="text-sm text-slate-600">
                    {user.emailAddresses[0]?.emailAddress}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-600">
            © {new Date().getFullYear()} OSHA Logbook. Built for safety officers.
          </div>
        </footer>
      </div>
      </EstablishmentProvider>
    </TRPCProvider>
  );
}

