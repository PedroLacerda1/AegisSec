import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (if provided)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

let cachedClient: SupabaseClient | null = null;

/**
 * Returns a Supabase Client instance if Supabase URL and Key are provided in the environment.
 * Otherwise returns null, allowing seamless fallback to internal Cloud SQL PostgreSQL pool.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return cachedClient;
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
