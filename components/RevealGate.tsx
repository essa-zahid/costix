'use client';

import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useReveal } from '@/hooks/use-reveal';

/**
 * Wraps protected calculated values. When gated, the children stay mounted and
 * keep animating/updating behind a smooth blur, with a reveal CTA + credit
 * counter overlaid. When revealed (or for pro users) children render normally.
 *
 * Gating EXACT VALUE VISIBILITY only — never blocks calculator interaction.
 */
export default function RevealGate({
  children,
  className = '',
  dark = false,
  compact = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const { gated, reveal, authed, unlimited, credits, outOfCredits, loading } = useReveal();

  // Pro / already revealed → show as-is.
  if (!gated || unlimited) return <div className={className}>{children}</div>;

  const btnLabel = !authed
    ? 'Sign up to reveal'
    : outOfCredits
      ? 'Out of reveals'
      : 'Reveal Results';

  const sub = !authed
    ? 'Free — 5 reveals included'
    : outOfCredits
      ? "You've used all your reveals"
      : `${credits ?? 0} reveal${(credits ?? 0) === 1 ? '' : 's'} left`;

  return (
    <div className={`relative ${className}`}>
      {/* Live values keep animating behind the blur */}
      <div
        aria-hidden
        className="pointer-events-none select-none"
        style={{ filter: `blur(${compact ? 7 : 10}px)`, opacity: 0.8, transition: 'filter .35s ease, opacity .35s ease' }}
      >
        {children}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
        <button
          type="button"
          onClick={reveal}
          disabled={loading || outOfCredits}
          className={`inline-flex items-center gap-1.5 rounded-xl font-semibold transition-transform active:scale-95 disabled:opacity-60 disabled:active:scale-100 ${
            compact ? 'h-8 px-3 text-[12px]' : 'h-10 px-5 text-[13.5px]'
          } ${
            dark
              ? 'bg-white text-teal-700 hover:bg-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.18)]'
              : 'text-white hover:opacity-95 shadow-[0_2px_10px_rgba(15,118,110,0.32)]'
          }`}
          style={dark ? undefined : { background: 'linear-gradient(135deg, #10B981, #0F766E)' }}
        >
          {outOfCredits ? <Lock size={compact ? 13 : 15} /> : <Sparkles size={compact ? 13 : 15} />}
          {btnLabel}
        </button>
        {!compact && (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              dark ? 'bg-white/15 text-white backdrop-blur-sm' : 'bg-slate-900/5 text-slate-600'
            }`}
          >
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
