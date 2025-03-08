import { useEffect, useState } from "react";
import { createClient, User } from "@supabase/supabase-js";

// Supabase istemcisini oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Fetching current user from Supabase");

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Mevcut kullanıcıyı kontrol et
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log("Current session:", session ? "exists" : "none");
        setUser(session?.user ?? null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching session:", err);
        setError(err);
        setIsLoading(false);
      });

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading, error };
}
