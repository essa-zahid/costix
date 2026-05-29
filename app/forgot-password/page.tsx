'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { resetPasswordForEmail } from '@/hooks/use-auth';

const SPRING    = { type: 'spring', stiffness: 280, damping: 26 } as const;
const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

const Noise = () => (
  <svg aria-hidden className="pointer-events-none select-none absolute inset-0 h-full w-full opacity-[0.035]">
    <filter id="nx-forgot"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
    <rect width="100%" height="100%" filter="url(#nx-forgot)" />
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
        <linearGradient id="cxG-forgot" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10847A" /><stop offset="100%" stopColor="#0A5E57" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8.5" fill="url(#cxG-forgot)" />
      {bars.map(({ y, w, op, d }, i) => (
        <motion.rect key={i} x="5.5" y={y} height="5" rx="2.5" fill="white" fillOpacity={op}
          initial={{ width: 0 }} animate={{ width: w }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: d }} />
      ))}
    </motion.svg>
  );
};

export default function ForgotPasswordPage() {
  const [email, setEmail]     = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError]     = React.useState('');
  const [done, setDone]       = React.useState(false);

  const fieldClass = 'w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-shadow';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await resetPasswordForEmail(email);
    setLoading(false);
    // Always show the confirmation screen even on error, so we never reveal
    // whether an address is registered.
    if (error && !/rate limit/i.test(error.message)) {
      // Surface only genuine, non-enumerating errors (e.g. rate limiting).
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-[#F8FAFC]">
        <Noise />
        <div className="relative w-full max-w-sm text-center">
          <div className="flex justify-center mb-6"><CostixMark size={48} /></div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight mb-3">Check your email</h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            If an account exists for <strong className="text-slate-700">{email}</strong>, we&apos;ve sent a
            password reset link. It expires in 1 hour.
          </p>
          <Link href="/login" className="inline-flex items-center justify-center h-11 px-6 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)' }}>
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#F8FAFC]">
      <Noise />
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.18]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #10B981, transparent 65%)' }} />

      <div className="relative w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <CostixMark size={36} />
          <motion.span className="font-bold text-[20px] text-slate-900" style={{ letterSpacing: '-0.04em' }}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: 0.22 }}>
            Costix
          </motion.span>
        </Link>

        <motion.div className="bg-white rounded-[20px] p-8"
          style={{ boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)' }}
          initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...SPRING, delay: 0.08 }}>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.2 }}>
            <h1 className="text-[20px] font-bold text-slate-900 tracking-tight mb-1">Reset your password</h1>
            <p className="text-sm text-slate-500 mb-7">Enter your email and we&apos;ll send you a reset link.</p>
          </motion.div>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.28 }}>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" placeholder="you@company.com" required autoComplete="email"
                className={fieldClass} value={email} onChange={e => setEmail(e.target.value)} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.36 }}>
              <motion.button type="submit" disabled={loading}
                className="w-full h-11 mt-1 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)', boxShadow: '0 2px 8px rgba(15,118,110,0.3)' }}
                whileHover={!loading ? { scale: 1.018 } : {}} whileTap={!loading ? { scale: 0.968 } : {}}
                transition={SPRING_UI}>
                {loading ? 'Sending link…' : 'Send reset link'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <p className="text-sm text-slate-500">
            Remembered it?{' '}
            <Link href="/login" className="font-medium text-teal-700 hover:underline underline-offset-2">Back to login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
