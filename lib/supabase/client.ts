import { createClient } from "@supabase/supabase-js";

// Use placeholder strings if variables are undefined to prevent library initialization crashes during Next.js build compile.
// We verify that variables are present in data/products.ts before executing any actual queries.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project-id.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
