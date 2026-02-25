import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!_client) _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

/** Use this in client-side code only. Returns null when env vars are missing. */
export function getSupabase(): SupabaseClient | null {
  return getClient()
}
