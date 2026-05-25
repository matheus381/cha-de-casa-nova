import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

/** Browser singleton for client components. */
let browserClient: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabaseClient() {
  if (!browserClient) {
    browserClient = createSupabaseClient();
  }
  return browserClient;
}
