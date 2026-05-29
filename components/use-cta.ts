'use client';

import { useAuth } from '@/hooks/use-auth';

/**
 * Centralized auth-aware CTA routing for Costix.
 *
 * Single source of truth for where a "use the product" CTA leads and what it
 * says. Visitors are guided into the SaaS onboarding flow (sign up first);
 * authenticated users continue straight to the calculator.
 *
 * Product understanding stays public — only the CTAs route through here, not
 * the marketing content. Future gating (credits, reveal-result, paid plans,
 * workspace onboarding) should be layered in here so individual buttons never
 * need to change.
 */
export function useCtaTarget() {
  const { user, loading } = useAuth();
  const authed = !!user;

  return {
    /** True until auth state has resolved on the client. */
    loading,
    /** Whether the visitor is signed in. */
    authed,
    /** Destination for a primary "enter the product" CTA. */
    href: authed ? '/app' : '/signup',
    /** SaaS-oriented label for a primary CTA. */
    label: authed ? 'Continue to Calculator' : 'Get Started',
  };
}
