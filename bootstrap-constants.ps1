# bootstrap-constants.ps1
# WINDOWS POWERSHELL 5 SAFE — UTF8

# Core runtime dependencies — installed one-by-one (PNPM safe)
$CoreDeps = @(
    "@clerk/nextjs",
    "drizzle-orm",
    "@neondatabase/serverless",
    "@trpc/server",
    "@trpc/client",
    "@trpc/react-query",
    "@trpc/next",
    "zod",
    "uploadthing",
    "@uploadthing/react",
    "resend",
    "@sentry/nextjs",
    "winston",
    "react-hook-form"
)

# Dev-only dependencies
$DevDeps = @(
    "drizzle-kit"
)

# Sentry companion files (UTF-8 safe)
$SentryClientConfigFile = @"
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
"@

$SentryServerConfigFile = @"
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
"@
