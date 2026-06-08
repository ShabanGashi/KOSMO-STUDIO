import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let initialized = false;
    let lastAuthEvent: { event: string; timestamp: number; token: string | null } | null = null;

    const shouldIgnoreEvent = (event: string, session: Session | null) => {
      const now = Date.now();
      const token = session?.access_token ?? null;

      if (lastAuthEvent?.event === event && lastAuthEvent.token === token && now - lastAuthEvent.timestamp < 2500) {
        console.log("[AuthProvider] ignoring duplicate auth event:", event);
        return true;
      }

      if (event === "SIGNED_OUT" && lastAuthEvent?.event === "TOKEN_REFRESHED" && now - lastAuthEvent.timestamp < 3000) {
        console.log("[AuthProvider] ignoring SIGNED_OUT immediately after TOKEN_REFRESHED");
        lastAuthEvent = { event, timestamp: now, token };
        return true;
      }

      lastAuthEvent = { event, timestamp: now, token };
      return false;
    };

    const applyAuthEvent = (event: string, session: Session | null) => {
      if (shouldIgnoreEvent(event, session)) {
        return;
      }

      const shouldUpdateSession =
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        (event === "TOKEN_REFRESHED" && session !== null);

      if (shouldUpdateSession) {
        console.log("[AuthProvider] auth state change:", event, session);
        setSession(session);
      } else {
        console.log("[AuthProvider] ignored auth event:", event);
      }

      if (!initialized) {
        setLoading(false);
        initialized = true;
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      applyAuthEvent(event, session);
    });

    void (async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!initialized) {
          console.log("[AuthProvider] initial session:", initialSession);
          setSession(initialSession);
          setLoading(false);
          initialized = true;
        }
      } catch (error) {
        console.error("[AuthProvider] initial getSession failed:", error);
        if (!initialized) {
          setLoading(false);
          initialized = true;
        }
      }
    })();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
