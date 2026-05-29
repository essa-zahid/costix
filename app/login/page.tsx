'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { signIn } from '@/hooks/use-auth';

const SPRING    = { type: 'spring', stiffness: 280, damping: 26 } as const;
const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

const Noise = () => (
  <svg aria-hidden className="pointer-events-none select-none absolute inset-0 h-full w-full opacity-[0.035]">
    <filter id="nx-login"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
    <rect width="100%" height="100%" filter="url(#nx-login)" />
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
        <linearGradient id="cxG-login" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10847A" /><stop offset="100%" stopColor="#0A5E57" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8.5" fill="url(#cxG-login)" />
      {bars.map(({ y, w, op, d }, i) => (
        <motion.rect key={i} x="5.5" y={y} height="5" rx="2.5" fill="white" fillOpacity={op}
          initial={{ width: 0 }} animate={{ width: w }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: d }} />
      ))}
    </motion.svg>
  );
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading]   = React.useState(false);
  const [error, setError]       = React.useState('');

  const urlError = searchParams.get('error');
  const fieldClass = 'w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-shadow';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/app');
      router.refresh();
    }
  }

  return (
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
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-7">Log in to your Costix account.</p>
        </motion.div>

        {(error || urlError) && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700">
            {error || (urlError === 'auth_callback_failed' ? 'Authentication failed. Please try again.' : urlError)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.28 }}>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email</label>
            <input type="email" placeholder="you@company.com" required autoComplete="email"
              className={fieldClass} value={email} onChange={e => setEmail(e.target.value)} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.34 }}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-slate-700">Password</label>
              <Link href="/forgot-password" className="text-[12.5px] font-medium text-teal-700 hover:underline underline-offset-2">
                Forgot password?
              </Link>
            </div>
            <input type="password" placeholder="••••••••" required autoComplete="current-password"
              className={fieldClass} value={password} onChange={e => setPassword(e.target.value)} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.4 }}>
            <motion.button type="submit" disabled={loading}
              className="w-full h-11 mt-1 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)', boxShadow: '0 2px 8px rgba(15,118,110,0.3)' }}
              whileHover={!loading ? { scale: 1.018 } : {}} whileTap={!loading ? { scale: 0.968 } : {}}
              transition={SPRING_UI}>
              {loading ? 'Logging in…' : 'Log In'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      <motion.div className="mt-6 text-center space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <p className="text-sm text-slate-500">
          No account?{' '}
          <Link href="/signup" className="font-medium text-teal-700 hover:underline underline-offset-2">Sign up free</Link>
        </p>
        <p className="text-sm text-slate-400">
          Or{' '}
          <Link href="/app" className="font-medium text-teal-600 hover:underline underline-offset-2">
            go straight to the calculator &rarr;
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#F8FAFC]">
      <Noise />
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.18]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #10B981, transparent 65%)' }} />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
