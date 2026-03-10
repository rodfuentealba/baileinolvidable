import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const resolveAuthState = async (currentUser: User | null) => {
      if (!isMounted) return;

      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc("has_role", {
          _user_id: currentUser.id,
          _role: "admin",
        });

        if (error) {
          throw error;
        }

        if (!isMounted) return;
        setIsAdmin(Boolean(data));
      } catch (error) {
        console.error("Error checking admin role", error);
        if (!isMounted) return;
        setIsAdmin(false);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        void resolveAuthState(session?.user ?? null);
      }, 0);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      void resolveAuthState(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (!error && data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
      });
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  return { user, isAdmin, loading, signIn, signUp, signOut };
}
