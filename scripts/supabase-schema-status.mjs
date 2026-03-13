import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const requiredTables = [
  'profiles',
  'categories',
  'products',
  'blog_posts',
  'services',
  'addresses',
  'cart_items',
  'wishlist_items',
  'orders',
  'contact_messages',
  'quote_requests',
  'newsletter_subscribers',
  'b2b_registrations',
  'site_settings',
];

const checks = await Promise.all(
  requiredTables.map(async (table) => {
    const { error } = await supabase.from(table).select('*').limit(1);

    return {
      table,
      ok: !error,
      error: error?.message ?? null,
    };
  }),
);

const missing = checks.filter((entry) => !entry.ok);

console.log(JSON.stringify({ ok: missing.length === 0, checkedWithServiceRole: Boolean(serviceRoleKey), checks }, null, 2));

if (missing.length > 0) {
  process.exitCode = 1;
}
