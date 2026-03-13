# Supabase setup

This project uses the same app URL for the storefront and the admin area:

- `/` for the public storefront
- `/admin` for the admin dashboard

## 1. Environment

Use the frontend keys in `.env`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_EMAILS=admin@example.com
SUPABASE_SERVICE_ROLE_KEY=...
```

Notes:

- `VITE_ADMIN_EMAILS` is optional but useful for bootstrapping admin access before profile roles are fully managed.
- `SUPABASE_SERVICE_ROLE_KEY` is for local Node scripts only. Do not expose it in the browser with a `VITE_` prefix.

## 2. Apply the schema

Run these SQL files in the Supabase SQL Editor, in order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

This repo already contains the full schema for:

- auth-linked `profiles`
- orders, cart, wishlist, addresses
- quote requests, contact messages, newsletter, B2B registrations
- blog posts and services
- RLS policies and admin checks

## 3. Verify the project state

Run:

```bash
npm run supabase:status
```

If the script reports missing tables, the hosted project is not fully migrated yet.

## 4. Create or promote an admin

Register the admin user from the app, then promote that user:

```bash
npm run supabase:promote-admin -- admin@example.com
```

Alternative:

- Run `supabase/admin-setup.sql` after replacing the email.

## 5. Open the admin dashboard

After the user can authenticate as admin, use:

```text
/admin
```

The admin dashboard is part of the same Vite app and same origin as the storefront.
