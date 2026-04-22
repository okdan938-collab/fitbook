# FitBook MVP Starter

FitBook is a role-based marketplace for athletes and trainers with Stripe-powered trainer subscriptions.

## Included in this scaffold

- Next.js App Router + TypeScript
- NextAuth auth (Google, Apple, credentials)
- Role onboarding (`ATHLETE`, `TRAINER`, `ADMIN`)
- Trainer subscription flow via Stripe Checkout (`$7.99/month` plan via Price ID)
- Stripe webhook handling for successful payments, failed invoices, cancellation/updates
- Prisma/PostgreSQL schema for users, trainer profiles, reviews, favorites, subscriptions, and messages
- Athlete dashboard, trainer dashboard, trainer profile page, and basic admin panel
- Smart match API (`/api/match`) using sport + distance + skill weighted scoring

## Local setup

1. Install Node.js 20+ and npm.
2. Copy `.env.example` to `.env` and fill in required keys.
3. Install dependencies:
   - `npm install`
4. Generate Prisma client:
   - `npm run prisma:generate`
5. Run DB migration:
   - `npm run prisma:migrate -- --name init`
6. Start dev server:
   - `npm run dev`

## Required environment values

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_TRAINER_MONTHLY_PRICE_ID`

Optional (for OAuth):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `APPLE_ID`
- `APPLE_TEAM_ID`
- `APPLE_PRIVATE_KEY`
- `APPLE_KEY_ID`

## Stripe integration notes

- Uses Stripe Checkout Sessions in `subscription` mode (recommended for recurring plans).
- Uses Stripe Billing subscription lifecycle via webhook updates.
- Uses a Stripe Price ID, not legacy plans.
- Stripe API version pinned to `2025-08-27.basil` (compatible with installed SDK).

## Current MVP boundaries

- Booking slots are not fully implemented yet (schema is ready to extend).
- Verification badge is currently admin/manual toggle (`TrainerProfile.isVerified`).
- Messaging is basic and API-only (`/api/messages`) for MVP expansion.

## Suggested next steps

1. Add booking/session models and calendar availability.
2. Add customer portal route for subscription self-service.
3. Add upload storage (S3/Firebase) for trainer media and certification files.
4. Harden review posting rules to only users with completed sessions.
5. Add E2E tests for onboarding + subscription lifecycle.
