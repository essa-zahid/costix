'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { signUp } from '@/hooks/use-auth';

const SPRING    = { type: 'spring', stiffness: 280, damping: 26 } as const;
const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

const Noise = () => (
  <svg aria-hidden className="pointer-events-none select-none absolute inset-0 h-full w-full opacity-[0.035]">
    <filter id="nx-signup"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
    <rect width="100%" height="100%" filter="url(#nx-signup)" />
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
        <linearGradient id="cxG-signup" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10847A" /><stop offset="100%" stopColor="#0A5E57" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8.5" fill="url(#cxG-signup)" />
      {bars.map(({ y, w, op, d }, i) => (
        <motion.rect key={i} x="5.5" y={y} height="5" rx="2.5" fill="white" fillOpacity={op}
          initial={{ width: 0 }} animate={{ width: w }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: d }} />
      ))}
    </motion.svg>
  );
};

export default function SignupPage() {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading]   = React.useState(false);
  const [error, setError]       = React.useState('');
  const [done, setDone]         = React.useState(false);
  const [existing, setExisting] = React.useState(false);

  const fieldClass = 'w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-shadow';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setExisting(false);
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const { error, alreadyRegistered } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (alreadyRegistered) {
      setExisting(true);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-[#F8FAFC]">
        <Noise />
        <div className="relative w-full max-w-sm text-center">
          <div className="flex justify-center mb-6"><CostixMark size={48} /></div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight mb-3">Check your email</h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            We sent a confirmation link to <strong className="text-slate-700">{email}</strong>.<br />
            Click it to activate your account and start costing.
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
            <h1 className="text-[20px] font-bold text-slate-900 tracking-tight mb-1">Create your account</h1>
            <p className="text-sm text-slate-500 mb-7">Start costing your products in minutes.</p>
          </motion.div>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {existing && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[13px] text-amber-800">
              This email already has an account.{' '}
              <Link href="/login" className="font-semibold underline underline-offset-2">Log in instead</Link>
              {' '}or{' '}
              <Link href="/forgot-password" className="font-semibold underline underline-offset-2">reset your password</Link>.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.26 }}>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Full name</label>
              <input type="text" placeholder="Ahmed Khan" required autoComplete="name"
                className={fieldClass} value={fullName} onChange={e => setFullName(e.target.value)} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.32 }}>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Work email</label>
              <input type="email" placeholder="you@company.com" required autoComplete="email"
                className={fieldClass} value={email} onChange={e => setEmail(e.target.value)} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.38 }}>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Password</label>
              <input type="password" placeholder="Min. 8 characters" required autoComplete="new-password" minLength={8}
                className={fieldClass} value={password} onChange={e => setPassword(e.target.value)} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.44 }}>
              <motion.button type="submit" disabled={loading}
                className="w-full h-11 mt-1 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)', boxShadow: '0 2px 8px rgba(15,118,110,0.3)' }}
                whileHover={!loading ? { scale: 1.018 } : {}} whileTap={!loading ? { scale: 0.968 } : {}}
                transition={SPRING_UI}>
                {loading ? 'Creating account…' : 'Create Account'}
              </motion.button>
            </motion.div>
          </form>

          <motion.p className="mt-5 text-[11.5px] text-slate-400 text-center leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}>
            By signing up you agree to our{'  '}
            <Link href="/terms" className="text-teal-700 hover:underline underline-offset-2">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-teal-700 hover:underline underline-offset-2">Privacy Policy</Link>.
          </motion.p>
        </motion.div>

        <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <p className="text-sm text-slate-500">
            Already have an account?{'  '}
            <Link href="/login" className="font-medium text-teal-700 hover:underline underline-offset-2">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
