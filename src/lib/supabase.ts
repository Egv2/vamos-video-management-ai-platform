import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client for browser-side usage with type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// For server-side operations that need elevated privileges
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  console.log("Creating server-side Supabase client with service role");

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  });
};

// Helper function for server components
export const createServerSupabaseClient = async () => {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();

  console.log("Creating server component Supabase client");

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
};

// Log initialization for debugging
console.log("Supabase client initialized");
