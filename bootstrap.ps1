# bootstrap.ps1
# MODE 1 — run INSIDE repo root
# PowerShell 5 SAFE — UTF8

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# load constants
. .\bootstrap-constants.ps1

Write-Host ""
Write-Host "------------------------------------"
Write-Host "BOOTSTRAP STARTING (MODE 1)"
Write-Host "This will scaffold NEXT.JS + SaaS baseline INTO THIS FOLDER"
Write-Host "------------------------------------"
Write-Host ""

# ensure a basic .gitignore exists BEFORE create-next-app (required)
if (!(Test-Path ".gitignore")) {
@"
# node / next basics
node_modules
.next
out
.env
.env.*
pnpm-lock.yaml
"@ | Out-File -Encoding utf8 ".gitignore"
}

# scaffold Next.js baseline (App Router / TS / Tailwind / ESLint)
npx create-next-app@latest . --ts --tailwind --eslint --app --no-src

# ensure pnpm installed globally
npm install -g pnpm

# Install core deps one-by-one
foreach ($dep in $CoreDeps) {
    Write-Host "Installing $dep ..."
    pnpm add $dep
}

# Install dev deps one-by-one
foreach ($dep in $DevDeps) {
    Write-Host "Installing dev dep $dep ..."
    pnpm add -D $dep
}

# create env placeholders
@"
DATABASE_URL=""
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""
"@ | Out-File -Encoding utf8 ".env.local"

# create backend structure
New-Item -ItemType Directory -Force -Path "server\core\db" | Out-Null
New-Item -ItemType Directory -Force -Path "server\core\api" | Out-Null
New-Item -ItemType Directory -Force -Path "server\core\env" | Out-Null
New-Item -ItemType Directory -Force -Path "server\core\logger" | Out-Null

# drizzle placeholder schema
@"
export const placeholder = true;
"@ | Out-File -Encoding utf8 "server\core\db\schema.ts"

# drizzle db client
@"
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
"@ | Out-File -Encoding utf8 "server\core\db\index.ts"

# add sentry configs
$SentryClientConfigFile | Out-File -Encoding utf8 "sentry.client.config.ts"
$SentryServerConfigFile | Out-File -Encoding utf8 "sentry.server.config.ts"

# create empty rules folder for MDC
New-Item -ItemType Directory -Force -Path ".cursor\rules" | Out-Null

# create validators + file
New-Item -ItemType Directory -Force -Path ".cursor\validators" | Out-Null

@"
# bootstrap-validator.mdc

## PURPOSE
Validate the baseline SaaS project after bootstrap.

## CHECKLIST

1) Next.js 14+ App Router exists (confirm /app)
2) Tailwind exists (tailwind.config + postcss.config)
3) Drizzle exists (server/core/db/index.ts)
4) Env placeholders exist (.env.local)
5) Sentry configs exist (sentry.*.config.ts)

## SUCCESS SIGNAL

When all checks pass, reply:

BOOTSTRAP VALID ✅
"@ | Out-File -Encoding utf8 ".cursor\validators\bootstrap-validator.mdc"

Write-Host ""
Write-Host "✅ Bootstrap complete."
Write-Host "Next: run → pnpm dev"
Write-Host ""
