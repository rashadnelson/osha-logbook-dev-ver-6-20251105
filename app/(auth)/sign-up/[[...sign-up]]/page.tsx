/**
 * @fileoverview Clerk sign-up page
 * @grep_search SignUp, Clerk, registration
 * 
 * Renders Clerk's sign-up component
 * Configured for email-only authentication
 */

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Get Started
          </h1>
          <p className="text-slate-600">
            Create your account to start managing OSHA records
          </p>
        </div>
        
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}

