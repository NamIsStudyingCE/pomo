"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase-browser";
import { isGuestMode, setGuestMode, createGuestSession } from "./guest-storage";

export type AuthState = {
  status: "loading" | "ready";
  session: Session | null;
  configured: boolean;
  isGuest: boolean;
  loginAsGuest: () => void;
  logoutGuest: () => void;
};

const AuthContext = createContext<AuthState>({
  status: "loading",
  session: null,
  configured: true,
  isGuest: false,
  loginAsGuest: () => {},
  logoutGuest: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, "loginAsGuest" | "logoutGuest">>({
    status: "loading",
    session: null,
    configured: true,
    isGuest: false,
  });

  function loginAsGuest() {
    setGuestMode(true);
    const guestSession = createGuestSession();
    setState({
      status: "ready",
      session: guestSession,
      configured: true,
      isGuest: true,
    });
  }

  function logoutGuest() {
    setGuestMode(false);
    setState({
      status: "ready",
      session: null,
      configured: true,
      isGuest: false,
    });
  }

  useEffect(() => {
    // 1. Kiem tra xem co dang o che do Khach hay khong
    if (isGuestMode()) {
      setState({
        status: "ready",
        session: createGuestSession(),
        configured: true,
        isGuest: true,
      });
      return;
    }

    // 2. Kiem tra che do Supabase Auth
    const sb = getSupabase();
    if (!sb) {
      setState({ status: "ready", session: null, configured: false, isGuest: false });
      return;
    }

    let mounted = true;
    sb.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setState({ status: "ready", session: data.session, configured: true, isGuest: false });
      } else {
        setState({ status: "ready", session: null, configured: true, isGuest: false });
      }
    });

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session) {
          setState((s) => ({ ...s, status: "ready", session, isGuest: false }));
        } else if (!isGuestMode()) {
          setState((s) => ({ ...s, status: "ready", session: null, isGuest: false }));
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginAsGuest,
        logoutGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
