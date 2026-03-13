import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const targetEmail = process.argv[2]?.trim().toLowerCase();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_KEY;

if (!targetEmail) {
  console.error('Usage: npm run supabase:promote-admin -- admin@example.com');
  process.exit(1);
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let page = 1;
let matchedUser = null;

while (!matchedUser) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });

  if (error) {
    console.error(`Failed to list auth users: ${error.message}`);
    process.exit(1);
  }

  const users = data?.users ?? [];
  matchedUser = users.find((entry) => entry.email?.toLowerCase() === targetEmail) ?? null;

  if (users.length < 200) {
    break;
  }

  page += 1;
}

if (!matchedUser) {
  console.error(`No auth user found for ${targetEmail}. The user needs to register first.`);
  process.exit(1);
}

const fullName =
  matchedUser.user_metadata?.full_name ||
  matchedUser.user_metadata?.name ||
  targetEmail.split('@')[0] ||
  'Admin user';

const { error: profileError } = await supabase.from('profiles').upsert({
  id: matchedUser.id,
  email: matchedUser.email,
  name: fullName,
  role: 'admin',
});

if (profileError) {
  console.error(`Failed to upsert profile: ${profileError.message}`);
  process.exit(1);
}

const { error: authUpdateError } = await supabase.auth.admin.updateUserById(matchedUser.id, {
  user_metadata: {
    ...matchedUser.user_metadata,
    full_name: fullName,
    role: 'admin',
  },
});

if (authUpdateError) {
  console.error(`Profile promoted but failed to sync auth metadata: ${authUpdateError.message}`);
  process.exit(1);
}

console.log(`Promoted ${targetEmail} to admin.`);
