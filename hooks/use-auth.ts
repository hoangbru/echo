import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserService } from "@/lib/services";
import { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        if (user) {
          UserService.getProfile(supabase, user.id).then((userRes) => {
            const user = userRes || null;
            setUser(user);
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        UserService.getProfile(supabase, session?.user.id).then((userRes) => {
          const user = userRes || null;
          setUser(user);
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}
