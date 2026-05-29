'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';
import { updatePassword, useAuth } from '@/hooks/use-auth';

const SPRING    = { type: 'spring', stiffness: 280, damping: 26 } as const;
const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

const Noise = () => (
  <svg aria-hidden className="pointer-events-none select-none absolute inset-0 h-full w-full opacity-[0.035]">
    <filter id="nx-reset"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
    <rect width="100%" height="100%" filter="url(#nx-reset)" />
  </svg>
);

const CostixMark = ({ size = 36 }: { size?: number }) => {
  const bars = [
    { y: 5.5,  w: 22,  op: 1.00, d: 0.18 },
    { y: 13,   w: 8.5, op: 0.55, d: 0.26 },
    { y: 20,   w: 8.5, op: 0.75, d: 0.34 },
    { y: 26.5, w: 22,  op: 1.00, d: 0.42 },
  ];
  return (
    <motion.svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden
      initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...SPRING, delay: 0.1 }}>
      <defs>
        <linearGradient id="cxG-reset" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10847A" /><stop offset="100%" stopColor="#0A5E57" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8.5" fill="url(#cxG-reset)" />
      {bars.map(({ y, w, op, d }, i) => (
        <motion.rect key={i} x="5.5" y={y} height="5" rx="2.5" fill="white" fillOpacity={op}
          initial={{ width: 0 }} animate={{ width: w }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: d }} />
      ))}
    </motion.svg>
  );
};

const fieldClass = 'w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-shadow';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#F8FAFC]">
      <Noise />
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.18]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #10B981, transparent 65%)' }} />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <CostixMark size={36} />
          <span className="font-bold text-[20px] text-slate-900" style={{ letterSpacing: '-0.04em' }}>Costix</span>
        </Link>
        {children}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();

  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm]   = React.useState('');
  const [loading, setLoading]   = React.useState(false);
  const [error, setError]       = React.useState('');
  const [done, setDone]         = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => { router.push('/app'); router.refresh(); }, 1400);
  }

  // Still resolving whether the recovery link produced a valid session.
  if (authLoading) {
    return (
      <Shell>
        <div className="bg-white rounded-[20px] p-8 text-center" style={{ boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)' }}>
          <p className="text-sm text-slate-500">Verifying your reset link…</p>
        </div>
      </Shell>
    );
  }

  // No session means the link was missing, already used, or expired.
  if (!session) {
    return (
      <Shell>
        <div className="bg-white rounded-[20px] p-8 text-center" style={{ boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)' }}>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight mb-2">Link expired or invalid</h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            This password reset link is no longer valid. Reset links expire after 1 hour and can only be used once.
          </p>
          <Link href="/forgot-password" className="inline-flex items-center justify-center h-11 px-6 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)' }}>
            Request a new link
          </Link>
        </div>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <div className="bg-white rounded-[20px] p-8 text-center" style={{ boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)' }}>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight mb-2">Password updated</h1>
          <p className="text-sm text-slate-500">Taking you to the app…</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <motion.div className="bg-white rounded-[20px] p-8"
        style={{ boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)' }}
        initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...SPRING, delay: 0.08 }}>

        <h1 className="text-[20px] font-bold text-slate-900 tracking-tight mb-1">Set a new password</h1>
        <p className="text-sm text-slate-500 mb-7">Choose a strong password you don&apos;t use elsewhere.</p>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">New password</label>
            <input type="password" placeholder="Min. 8 characters" required autoComplete="new-password" minLength={8}
              className={fieldClass} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Confirm new password</label>
            <input type="password" placeholder="Re-enter password" required autoComplete="new-password" minLength={8}
              className={fieldClass} value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          <motion.button type="submit" disabled={loading}
            className="w-full h-11 mt-1 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)', boxShadow: '0 2px 8px rgba(15,118,110,0.3)' }}
            whileHover={!loading ? { scale: 1.018 } : {}} whileTap={!loading ? { scale: 0.968 } : {}}
            transition={SPRING_UI}>
            {loading ? 'Updating…' : 'Update password'}
          </motion.button>
        </form>
      </motion.div>
    </Shell>
  );
}
