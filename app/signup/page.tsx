'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/* ─── Shared spring presets ─────────────────────────────────── */
const SPRING     = { type: 'spring', stiffness: 280, damping: 26 } as const;
const SPRING_UI  = { type: 'spring', stiffness: 400, damping: 34 } as const;

/* ─── Noise texture ─────────────────────────────────────────── */
const Noise = () => (
  <svg
    aria-hidden
    className="pointer-events-none select-none absolute inset-0 h-full w-full opacity-[0.035]"
  >
    <filter id="nx-signup">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#nx-signup)" />
  </svg>
);

/* ─── Animated Costix mark ──────────────────────────────────── */
const CostixMark = ({ size = 36 }: { size?: number }) => {
  const rx = 8.5 * (size / 36);
  const bars = [
    { y: 5.5,  w: 22,  op: 1.00, d: 0.18 },
    { y: 13,   w: 8.5, op: 0.55, d: 0.26 },
    { y: 20,   w: 8.5, op: 0.75, d: 0.34 },
    { y: 26.5, w: 22,  op: 1.00, d: 0.42 },
  ];
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 36 36" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...SPRING, delay: 0.1 }}
    >
      <defs>
        <linearGradient id="cxG-signup" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10847A" />
          <stop offset="100%" stopColor="#0A5E57" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx={rx} fill="url(#cxG-signup)" />
      {bars.map(({ y, w, op, d }, i) => (
        <motion.rect
          key={i} x="5.5" y={y} height="5" rx="2.5"
          fill="white" fillOpacity={op}
          initial={{ width: 0 }}
          animate={{ width: w }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: d }}
        />
      ))}
    </motion.svg>
  );
};

/* ─── Field wrapper ─────────────────────────────────────────── */
const Field = ({
  label, type, placeholder, delay,
}: {
  label: string; type: string; placeholder: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ ...SPRING, delay }}
  >
    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-shadow duration-150 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
    />
  </motion.div>
);

/* ─── Page ──────────────────────────────────────────────────── */
export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#F8FAFC]">
      {/* Background noise */}
      <Noise />

      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.18]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #10B981, transparent 65%)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <CostixMark size={36} />
          <motion.span
            className="font-bold text-[20px] text-slate-900"
            style={{ letterSpacing: '-0.04em' }}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: 0.22 }}
          >
            Costix
          </motion.span>
        </Link>

        {/* Card */}
        <motion.div
          className="bg-white rounded-[20px] p-8"
          style={{
            boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
          }}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...SPRING, delay: 0.08 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.2 }}
          >
            <h1 className="text-[20px] font-bold text-slate-900 tracking-tight mb-1">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mb-7">
              Start pricing products with confidence.
            </p>
          </motion.div>

          <div className="space-y-4">
            <Field label="Full name" type="text"     placeholder="Your name"       delay={0.26} />
            <Field label="Email"     type="email"    placeholder="you@company.com" delay={0.32} />
            <Field label="Password"  type="password" placeholder="••••••••"        delay={0.38} />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.44 }}
            >
              <motion.button
                className="w-full h-11 mt-1 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #0F766E)',
                  boxShadow: '0 2px 8px rgba(15,118,110,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
                whileHover={{ scale: 1.018 }}
                whileTap={{ scale: 0.968 }}
                transition={SPRING_UI}
                onClick={() => alert('Authentication coming soon.')}
              >
                Create Account
              </motion.button>
            </motion.div>
          </div>

          {/* Auth notice */}
          <motion.div
            className="mt-5 flex items-center justify-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.56 }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[11.5px] text-slate-400">
              Auth not live yet —{' '}
              <Link href="/app" className="text-teal-700 font-medium hover:underline underline-offset-2">
                use the calculator directly
              </Link>
            </span>
          </motion.div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          className="mt-6 text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.58 }}
        >
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-teal-700 hover:underline underline-offset-2">
              Log in
            </Link>
          </p>
          <p className="text-sm text-slate-400">
            Or{' '}
            <Link href="/app" className="font-medium text-teal-600 hover:underline underline-offset-2">
              go straight to the calculator →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
