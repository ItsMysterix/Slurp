import type { createClient } from "@supabase/supabase-js"

declare global {
  var __supabase__: ReturnType<typeof createClient> | undefined
}
