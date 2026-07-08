# EduApply SA — Phase 1

Project scaffold, database schema, and authentication for the EduApply SA
Student Application Management Platform.

## What's included in this phase

- Next.js 14 (App Router) + TypeScript + Tailwind CSS project scaffold
- Hand-written shadcn-style UI primitives (Button, Input, Label, Card, Alert)
- Supabase client/server/middleware helpers
- Full database schema (11 tables, enums, indexes, triggers) — `supabase/migrations/0001_schema.sql`
- Row Level Security policies for every table — `supabase/migrations/0002_rls_policies.sql`
- Working auth flow: register, email verification, login, forgot password, reset password
- Role-based redirect middleware (student → `/dashboard`, staff → `/admin`)
- Public landing page

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. In your project, go to **SQL Editor → New Query**
3. Paste the full contents of `supabase/migrations/0001_schema.sql` and run it
4. Repeat for `supabase/migrations/0002_rls_policies.sql`
5. Repeat for `supabase/migrations/0003_storage.sql` (sets up the private
   `documents` storage bucket used by the document upload center)
6. Optionally repeat for `supabase/migrations/0004_seed_data.sql` — adds
   sample universities, colleges, and bursaries so there's real data to
   browse and apply to while the admin CMS isn't built yet
7. Go to **Authentication → Providers** and confirm Email is enabled
8. Go to **Authentication → URL Configuration** and set:
   - Site URL: `http://localhost:3000` (update to your real domain after deploying)
   - Redirect URLs: add `http://localhost:3000/**`

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
**Project Settings → API** in your Supabase dashboard.

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Try registering a new student account — you
should receive a verification email, be able to log in, and land on
`/dashboard`.

### Creating your first admin/staff account

New signups always default to the `student` role. To promote an account to
staff, run this in the Supabase SQL Editor after the user has registered:

```sql
update profiles set role = 'super_admin' where email = 'you@example.com';
```

## 5. Deploy (free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com), import the repo
3. Add the same two environment variables in **Project Settings → Environment Variables**
4. Deploy
5. Back in Supabase, update **Authentication → URL Configuration** with your
   real Vercel URL (both Site URL and Redirect URLs)

## What's next (Phase 2+)

See the original build prompt for the full roadmap:
- Student dashboard (profile, documents, applications, CV builder) ✅ done
- Institution/bursary browse & search ✅ done
- Document upload center (Supabase Storage) ✅ done
- Application tracking timeline ✅ done
- CV Builder ✅ done
- Admin dashboard (user/application/document management, institutions & bursaries CMS, support tickets) ✅ done

Still to come, per the original roadmap:
- Online payment gateway integration (currently manual proof-of-payment via the general document uploader)
- AI features (Career Advisor, APS Calculator, CV Improvement, Motivation Letter Generator)
- SMS/WhatsApp notifications
- Mobile app
- Digital signatures, referral/affiliate programs, live chat

## Admin dashboard

Once you've promoted an account to staff (see the SQL command above), log in
with that account and you'll land on `/admin` instead of `/dashboard`. From
there you can:

- **Overview** — live platform stats
- **Applications** — change status, assign a consultant, add internal notes
- **Document Review** — approve/reject uploaded documents with a note
- **Institutions & Colleges** / **Bursaries** — add or remove listings (this
  is your CMS — the seed data from step 3 is just a starting point)
- **Support Tickets** — respond to and close student tickets
- **Users** — search all users and change roles (e.g. promote another
  account to `consultant` or `admin` directly from the UI, instead of SQL)

## CV Builder

Students fill in their details under **CV Builder**, choose between two
templates (Classic / Modern), and click **Download PDF** — this opens the
browser's native print dialog scoped to just the CV, where they choose
"Save as PDF" as the destination. No extra dependencies or paid PDF service
required.
