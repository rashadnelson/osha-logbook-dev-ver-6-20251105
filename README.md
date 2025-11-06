# OSHA Logbook - Phase 2 Complete

OSHA incident management SaaS for small manufacturing companies. Built with Next.js 14, tRPC, Drizzle ORM, and Clerk authentication.

---

## ✅ Phase 2 Implementation Complete

### What's Been Built

**Core Infrastructure:**
- ✅ tRPC API with Clerk authentication context
- ✅ Drizzle ORM schema for establishments & subscriptions
- ✅ Next.js 14 App Router with layouts and providers
- ✅ React Query + tRPC client setup
- ✅ Clerk email-only authentication
- ✅ Sentry error monitoring integration

**Establishments CRUD:**
- ✅ Create new establishments with full validation
- ✅ List all establishments for authenticated user
- ✅ Delete establishments (with cascade to subscriptions)
- ✅ Establishment selector in navigation
- ✅ Year selector with localStorage persistence

**UI Components:**
- ✅ Dashboard layout with navigation
- ✅ Add Establishment form (React Hook Form + Zod)
- ✅ Establishments list with table view
- ✅ Year selector dropdown
- ✅ Establishment selector dropdown
- ✅ Sign-in/Sign-up pages

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- Clerk account for authentication

### Environment Setup

1. Copy `.env.example` to `.env` (create from template below):

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard/establishments
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard/establishments

# Sentry (optional)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# UploadThing (Phase 7)
# UPLOADTHING_SECRET=sk_live_xxxxx
# UPLOADTHING_APP_ID=xxxxx

# Resend (Phase 7)
# RESEND_API_KEY=re_xxxxx
```

### Installation

```bash
# Install dependencies
npm install

# Generate and run database migrations
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

Visit http://localhost:3000

---

## 📁 Project Structure

```
osha-logbook/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (sign-in, sign-up)
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── establishments/       # Establishments CRUD
│   │   ├── incidents/            # Phase 3
│   │   └── reports/              # Phase 4-5
│   ├── _trpc/                    # tRPC client setup
│   ├── api/trpc/                 # tRPC API route
│   ├── components/               # Shared components
│   ├── hooks/                    # Custom hooks (context)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── server/core/
│   ├── api/
│   │   ├── routers/              # tRPC routers
│   │   ├── root.ts               # Root router
│   │   └── trpc.ts               # tRPC setup
│   └── db/
│       ├── index.ts              # Drizzle connection
│       └── schema.ts             # Database schema
├── lib/validations/              # Zod schemas
├── drizzle.config.ts             # Drizzle Kit config
├── middleware.ts                 # Clerk middleware
├── next.config.ts                # Next.js config
└── tsconfig.json                 # TypeScript config
```

---

## 🗄️ Database Schema

### Establishments Table
- `id` (UUID, PK)
- `userId` (Clerk user ID)
- `name`, `address`, `city`, `state`, `zipCode`
- `industryDescription`, `averageEmployees`
- `createdAt`, `updatedAt`

### Subscriptions Table
- `id` (UUID, PK)
- `establishmentId` (FK → establishments)
- `year` (integer, e.g., 2024)
- `clerkSubscriptionId` (Clerk subscription tracking)
- `status` (active | cancelled | expired)
- `createdAt`, `updatedAt`

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

---

## 📋 Phase 2 Checklist

- [x] tRPC setup with Clerk context
- [x] Drizzle ORM schema (establishments + subscriptions)
- [x] Establishment CRUD router
- [x] Next.js App Router structure
- [x] tRPC React Query client
- [x] Add Establishment form with validation
- [x] Establishments list page
- [x] Year selector component
- [x] Establishment context hook
- [x] Sign-in/Sign-up pages
- [x] Middleware for auth protection
- [x] No TypeScript errors ✅
- [x] Dev server runs successfully ✅

---

## 🎯 Next Steps (Phase 3)

**OSHA 300/301 Incident Entry:**
1. Define `incidents` table per OSHA CSV schema
2. Build incident entry form with full Zod validation
3. Build paginated list of incidents filtered by establishment + year
4. Implement subscription enforcement middleware

---

## 📚 Tech Stack

- **Frontend:** Next.js 14, React 19, TypeScript, Tailwind CSS v4
- **Backend:** tRPC, Drizzle ORM, Neon PostgreSQL
- **Auth:** Clerk (email-only)
- **Forms:** React Hook Form + Zod
- **State:** React Query
- **Monitoring:** Sentry
- **Deployment:** Railway (Phase 8)

---

## 🔐 Architecture Mandates

Per `.mdc` rules:
- ✅ NO Clerk organizations (custom establishments table instead)
- ✅ NO Stripe (Clerk paid subscriptions only)
- ✅ CSV generation client-side only (Phase 5)
- ✅ Multi-establishment per user support
- ✅ Multi-year storage (Y2 model)
- ✅ Subscription enforcement per establishment + year

---

## 📝 Notes

- Incidents page is a placeholder (Phase 3)
- Reports/CSV export is a placeholder (Phase 4-5)
- Subscription enforcement middleware will be added in Phase 3
- Email (Resend) and file uploads (UploadThing) in Phase 7

---

**Built by Cursor AI following strict `.mdc` implementation guidelines.**

