import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

let supabaseRuntimeDisabled = false;

export const isSupabaseConfigured = () =>
  Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      !import.meta.env.VITE_SUPABASE_URL.includes('YOUR_SUPABASE_URL') &&
      !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY') &&
      !supabaseRuntimeDisabled,
  );

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Soft-disable Supabase usage for the current session when we detect that the
 * browser runtime or project env vars are not compatible with live Supabase.
 * Subsequent calls will fall back to local/demo data instead of throwing.
 */
export const disableSupabaseRuntime = (reason?: unknown) => {
  supabaseRuntimeDisabled = true;

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn('[supabase] Runtime disabled, falling back to local data.', reason);
  }
};

/**
 * Hook used by API helpers to make sure Supabase is safe to call.
 * For now this is a thin wrapper around configuration + runtime flag, but it
 * stays async so we can add health checks later without changing callers.
 */
export const ensureSupabaseReady = async () => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  return true;
};

/**
 * Helpers to detect common Supabase error classes. These are intentionally
 * conservative – if we are not sure, we return false and let the caller
 * surface a readable error instead of auto-disabling Supabase.
 */
export const isSupabaseAccessDeniedError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as { code?: string; message?: string };
  const message = candidate.message?.toLowerCase() ?? '';

  return (
    candidate.code === '42501' ||
    message.includes('row-level security') ||
    message.includes('permission denied') ||
    message.includes('not allowed')
  );
};

export const isSupabaseSchemaMismatchError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as { code?: string; message?: string };
  const message = candidate.message?.toLowerCase() ?? '';

  return (
    candidate.code === '42P01' || // undefined_table
    candidate.code === '42703' || // undefined_column
    message.includes('column') ||
    message.includes('relation') ||
    message.includes('schema mismatch') ||
    message.includes('type mismatch')
  );
};

