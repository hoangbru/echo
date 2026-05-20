import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export interface UserAuth {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export function useAuth() {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        if (user) {
          setUser({
            id: user.id,
            email: user.email || "",
            user_metadata: user.user_metadata,
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
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          user_metadata: session.user.user_metadata,
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

export function useProfileDetail() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.get(`/users/profile`);
      return res.data as { data: User };
    },
  });
}
