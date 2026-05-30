'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Layers, Bookmark, Sparkles, X, Check, Languages, Globe } from 'lucide-react';
import { useReveal, type AdvancedFeature } from '@/hooks/use-reveal';

const SPRING = { type: 'spring', stiffness: 320, damping: 30 } as const;

const FEATURES: Record<AdvancedFeature, {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  tagline: string;
  points: string[];
  tier: string;     // plan where this feature first becomes available
  planNote: string; // plan-availability line shown in the modal body
}> = {
  batch: {
    icon: Layers,
    title: 'Batch Costing',
    tagline: 'Cost a whole production run at once — not one product at a time.',
    points: [
      'Price multiple products in a single guided flow',
      'Compare runs and scale pricing across volumes',
      'Built for real factory output, not one-offs',
    ],
    tier: 'Advanced',
    planNote: 'Batch Costing is part of the Advanced plan.',
  },
  saved: {
    icon: Bookmark,
    title: 'Saved Costings',
    tagline: 'Keep every costing you build and pick up right where you left off.',
    points: [
      'Save and revisit costings across sessions and devices',
      'Build a reusable library of your products',
      'Duplicate and update instead of starting over',
    ],
    tier: 'Pro',
    planNote: 'Saved Costings is included on Pro, with unlimited history on Advanced.',
  },
  language: {
    icon: Languages,
    title: 'Multi-language',
    tagline: 'Run Costix in your team\'s language — 8 languages, switch any time.',
    points: [
      'English, Roman Urdu/Hindi, Arabic, Chinese, and more',
      'Right-to-left support for Arabic',
      'Pro is English-only; Advanced unlocks every language',
    ],
    tier: 'Advanced',
    planNote: 'Multi-language is part of the Advanced plan.',
  },
  currency: {
    icon: Globe,
    title: 'Multi-currency',
    tagline: 'Cost and price across currencies in one workspace.',
    points: [
      'Switch between 30+ currencies any time',
      'Each costing keeps its own currency',
      'Pro is single-currency; Advanced unlocks switching',
    ],
    tier: 'Advanced',
    planNote: 'Multi-currency is part of the Advanced plan.',
  },
  savedLimit: {
    icon: Bookmark,
    title: 'Unlimited saved costings',
    tagline: 'You\'ve reached the 5-costing limit on Pro.',
    points: [
      'Save unlimited costings on Advanced',
      'Keep full history, templates, and snapshots',
      'Never delete an old costing to make room again',
    ],
    tier: 'Advanced',
    planNote: 'Unlimited saved costings is part of the Advanced plan.',
  },
};

export default function UpgradeModal() {
  const { upgradeFeature, closeUpgrade, authed } = useReveal();
  const router = useRouter();
  const open = upgradeFeature !== null;
  const feature = upgradeFeature ? FEATURES[upgradeFeature] : null;

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeUpgrade(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeUpgrade]);

  const handlePrimary = () => {
    closeUpgrade();
    // Anonymous users start with a free account first; signed-in free users
    // are sent to the pricing section to upgrade. (No billing wired up yet.)
    if (!authed) router.push('/signup?next=/app');
    else router.push('/#pricing');
  };

  const Icon = feature?.icon ?? Lock;

  return (
    <AnimatePresence>
      {open && feature && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeUpgrade}
          role="dialog" aria-modal="true" aria-label={`Unlock ${feature.title}`}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <motion.div
            className="relative w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden"
            style={{ boxShadow: '0 24px 70px -12px rgba(2,32,30,0.45)' }}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={SPRING}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium header band */}
            <div className="relative px-6 pt-7 pb-6 text-white"
              style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)' }}>
              <button onClick={closeUpgrade} aria-label="Close"
                className="absolute top-4 right-4 h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors">
                <X size={16} />
              </button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase">
                <Sparkles size={12} /> {feature.tier}
              </span>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-11 w-11 inline-flex items-center justify-center rounded-2xl bg-white/15">
                  <Icon size={22} strokeWidth={2.1} />
                </span>
                <h2 className="text-[22px] font-bold tracking-tight">{feature.title}</h2>
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-white/90">{feature.tagline}</p>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <ul className="space-y-3">
                {feature.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                    <span className="mt-0.5 h-5 w-5 shrink-0 inline-flex items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <Check size={13} strokeWidth={2.6} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-3 text-[12.5px] text-slate-500">
                {feature.planNote} Quick Cost stays free, always.
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <motion.button onClick={handlePrimary}
                  className="w-full h-11 rounded-xl text-white text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)', boxShadow: '0 2px 10px rgba(15,118,110,0.3)' }}
                  whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                  {authed ? `Upgrade to ${feature.tier}` : 'Create a free account'}
                </motion.button>
                <button onClick={closeUpgrade}
                  className="w-full h-10 rounded-xl text-[13.5px] font-medium text-slate-500 hover:text-slate-700 transition-colors">
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
