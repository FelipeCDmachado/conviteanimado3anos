import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://pnwvwkjfectaocfzhpkc.supabase.co"
const supabaseAnonKey = "sb_publishable_iX57ANUeqPXBDoFeCqGIeA_Uc160IOX"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})