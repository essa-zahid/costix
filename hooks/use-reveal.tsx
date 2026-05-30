'use client';

import React, {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';

/**
 * Centralized reveal-credit system for Costix (free-user value gating).
 *
 * One source of truth for: the user's plan, remaining reveal credits, and
 * whether the protected summary values are currently revealed. The calculator
 * stays fully interactive — only EXACT VALUE VISIBILITY is gated.
 *
 * Behaviour:
 *  - pro            → unlimited, never gated, never consumes credits
 *  - free + credits → clicking Reveal consumes 1 credit (atomic RPC) and shows values
 *  - free + 0       → Reveal is disabled (upgrade hook is a future concern)
 *  - anonymous      → Reveal redirects to /signup; the entered values persist in
 *                     localStorage and the reveal auto-resumes after sign-in.
 *  - any input change re-blurs the values (reveal is per costing snapshot).
 *
 * Structured so future plans/subscriptions slot in at the data layer
 * (profiles.plan_type / free_credits_remaining) without touching the UI.
 */

export type PlanType = 'free' | 'pro';
export type AdvancedFeature = 'batch' | 'saved';
export const PENDING_REVEAL_KEY = 'costix_pending_reveal';

interface RevealContextValue {
  loading: boolean;
  authed: boolean;
  plan: PlanType;
  unlimited: boolean;
  credits: number | null;   // remaining reveal credits (null = anon / not loaded)
  revealed: boolean;
  gated: boolean;           // true → values should be blurred
  outOfCredits: boolean;
  reveal: () => void;
  reportSignature: (sig: string) => void;
  // Advanced (paid) feature gating — Batch + Saved are paid-only.
  canUseAdvanced: boolean;                 // true → unrestricted access to Batch/Saved
  upgradeFeature: AdvancedFeature | null;  // which locked feature triggered the upgrade modal
  openUpgrade: (feature: AdvancedFeature) => void;
  closeUpgrade: () => void;
}

const RevealContext = createContext<RevealContextValue | null>(null);

export function RevealProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [plan, setPlan] = useState<PlanType>('free');
  const [credits, setCredits] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<AdvancedFeature | null>(null);
  const sigRef = useRef<string | null>(null);

  const authed = !!user;
  const unlimited = plan === 'pro';
  // Any non-free plan unlocks the Advanced (paid) features.
  const canUseAdvanced = authed && plan !== 'free';

  const openUpgrade = useCallback((feature: AdvancedFeature) => setUpgradeFeature(feature), []);
  const closeUpgrade = useCallback(() => setUpgradeFeature(null), []);

  // Load the profile (plan + credits) whenever the auth user changes.
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
          setCredits(typeof data.free_credits_remaining === 'number' ? data.free_credits_remaining : 0);
        } else {
          // Row not created yet (trigger lag) — assume fresh free allowance.
          setPlan('free');
          setCredits(5);
        }
        setProfileLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  // Re-blur whenever the costing snapshot changes.
  const reportSignature = useCallback((sig: string) => {
    if (sigRef.current === null) { sigRef.current = sig; return; }
    if (sig !== sigRef.current) { sigRef.current = sig; setRevealed(false); }
  }, []);

  // Atomic credit consume via SECURITY DEFINER RPC; returns the new balance.
  const consumeAndReveal = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase.rpc('consume_reveal_credit');
    if (error) return;
    if (data && typeof data === 'object') {
      if (typeof (data as any).remaining === 'number') setCredits((data as any).remaining);
      if ((data as any).plan_type) setPlan((data as any).plan_type as PlanType);
      if ((data as any).revealed !== false) setRevealed(true);
    } else if (typeof data === 'number') {
      setCredits(data);
      setRevealed(true);
    }
  }, [user]);

  const reveal = useCallback(() => {
    if (unlimited) { setRevealed(true); return; }
    if (!authed) {
      try { localStorage.setItem(PENDING_REVEAL_KEY, '1'); } catch {}
      router.push('/signup?next=/app');
      return;
    }
    if (credits !== null && credits <= 0) return; // out of credits
    void consumeAndReveal();
  }, [unlimited, authed, credits, router, consumeAndReveal]);

  // Resume a reveal that was started while signed out.
  useEffect(() => {
    if (!user || profileLoading || credits === null) return;
    let pending = false;
    try { pending = localStorage.getItem(PENDING_REVEAL_KEY) === '1'; } catch {}
    if (!pending) return;
    try { localStorage.removeItem(PENDING_REVEAL_KEY); } catch {}
    if (plan === 'pro') setRevealed(true);
    else if (credits > 0) void consumeAndReveal();
  }, [user, profileLoading, credits, plan, consumeAndReveal]);

  const value: RevealContextValue = {
    loading: authLoading || profileLoading,
    authed,
    plan,
    unlimited,
    credits,
    revealed: unlimited ? true : revealed,
    gated: unlimited ? false : !revealed,
    outOfCredits: authed && !unlimited && credits !== null && credits <= 0,
    reveal,
    reportSignature,
    canUseAdvanced,
    upgradeFeature,
    openUpgrade,
    closeUpgrade,
  };

  return <RevealContext.Provider value={value}>{children}</RevealContext.Provider>;
}

// Safe default if used outside a provider: never gate (calculator stays usable).
const NOOP: RevealContextValue = {
  loading: false, authed: false, plan: 'free', unlimited: false, credits: null,
  revealed: true, gated: false, outOfCredits: false,
  reveal: () => {}, reportSignature: () => {},
  canUseAdvanced: true, upgradeFeature: null, openUpgrade: () => {}, closeUpgrade: () => {},
};

export function useReveal(): RevealContextValue {
  return useContext(RevealContext) ?? NOOP;
}
