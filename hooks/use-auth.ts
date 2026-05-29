'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}

// ── Auth actions ──────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${location.origin}/auth/callback`,
    },
  });

  // Supabase deliberately does NOT return an error when the email already
  // exists (to avoid leaking which addresses are registered). Instead it
  // returns a user object with an empty `identities` array and sends no
  // email. Detect that here so the UI can tell the user to log in instead
  // of showing a misleading "check your email" screen.
  const alreadyRegistered =
    !error &&
    !!data?.user &&
    Array.isArray(data.user.identities) &&
    data.user.identities.length === 0;

  return { data, error, alreadyRegistered };
}

export async function resetPasswordForEmail(email: string) {
  const supabase = createClient();
  // The recovery link lands on /auth/callback, which exchanges the code for
  // a session and forwards the user to /reset-password to set a new password.
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
  });
  return { data, error };
}

export async function updatePassword(password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({ password });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}
