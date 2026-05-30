'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth, signOut as authSignOut } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';

export type PlanType = 'free' | 'pro' | string;

export interface AccountState {
  /** True until the auth session has resolved on the client. */
  loading: boolean;
  /** True once the plan/credits profile row has loaded. */
  profileLoading: boolean;
  authed: boolean;
  email: string | null;
  fullName: string | null;
  /** 1-2 letter avatar fallback (no profile image system yet). */
  initials: string;
  plan: PlanType;
  /** Human label: Free / Advanced / capitalized plan name. */
  planLabel: string;
  /** Paid plans have unlimited reveals. */
  unlimited: boolean;
  /** Remaining reveal credits (null = not loaded / not applicable). */
  credits: number | null;
  signOut: () => Promise<void>;
}

/**
 * Single source of truth for account state in the marketing/site chrome
 * (navbar, account page). Wraps useAuth() and adds the plan + credits read
 * from `profiles`, so navbar auth logic is never duplicated per component.
 */
export function useAccount(): AccountState {
  const { user, loading: authLoading } = useAuth();
  const [plan, setPlan] = useState<PlanType>('free');
  const [credits, setCredits] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setPlan('free'); setCredits(null); setProfileLoading(false); return; }
    setProfileLoading(true);
    const supabase = createClient();
    supabase
      .from('profiles')
      .select('plan, free_credits_remaining')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setPlan(((data as any).plan as PlanType) || 'free');
          setCredits(typeof (data as any).free_credits_remaining === 'number' ? (data as any).free_credits_remaining : 0);
        } else {
          setPlan('free');
          setCredits(5);
        }
        setProfileLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const signOut = useCallback(async () => { await authSignOut(); }, []);

  const email = user?.email ?? null;
  const fullName = ((user?.user_metadata as any)?.full_name as string | undefined)?.trim() || null;

  const initials = (() => {
    if (fullName) {
      const parts = fullName.split(/\s+/).filter(Boolean);
      const a = parts[0]?.[0] ?? '';
      const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
      return (a + b).toUpperCase() || 'U';
    }
    if (email) return email[0].toUpperCase();
    return 'U';
  })();

  const unlimited = plan === 'pro';
  const planLabel =
    plan === 'free' ? 'Free' :
    plan === 'pro'  ? 'Advanced' :
    plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Free';

  return {
    loading: authLoading,
    profileLoading,
    authed: !!user,
    email,
    fullName,
    initials,
    plan,
    planLabel,
    unlimited,
    credits,
    signOut,
  };
}
