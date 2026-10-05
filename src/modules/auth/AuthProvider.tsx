"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase-browser";

export type AuthState = {
  status: "loading" | "ready";
  session: Session | null;
  configured: boolean;
};

const AuthContext = createContext<AuthState>({
  status: "loading",
  session: null,
  configured: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    session: null,
    configured: true,
  });

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setState({ status: "ready", session: null, configured: false });
      return;
    }
    let mounted = true;
    sb.auth.getSession().then(({ data }) => {
      if (mounted) setState({ status: "ready", session: data.session, configured: true });
    });
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (mounted) setState((s) => ({ ...s, status: "ready", session }));
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
