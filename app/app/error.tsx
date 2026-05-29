'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

const SPRING    = { type: 'spring', stiffness: 280, damping: 26 } as const;
const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

/* ─── Animated Costix mark ──────────────────────────────────── */
const CostixMark = () => {
  const bars = [
    { y: 5.5,  w: 22,  op: 1.00, d: 0.22 },
    { y: 13,   w: 8.5, op: 0.55, d: 0.30 },
    { y: 20,   w: 8.5, op: 0.75, d: 0.38 },
    { y: 26.5, w: 22,  op: 1.00, d: 0.46 },
  ];
  return (
    <motion.svg
      width="44" height="44" viewBox="0 0 36 36" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...SPRING, delay: 0.1 }}
    >
      <defs>
        <linearGradient id="cxG-err" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10847A" />
          <stop offset="100%" stopColor="#0A5E57" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8.5" fill="url(#cxG-err)" />
      {bars.map(({ y, w, op, d }, i) => (
        <motion.rect
          key={i} x="5.5" y={y} height="5" rx="2.5"
          fill="white" fillOpacity={op}
          initial={{ width: 0 }}
          animate={{ width: w }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: d }}
        />
      ))}
    </motion.svg>
  );
};

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Costix /app error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-[20px] p-8 text-center"
        style={{ boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)' }}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...SPRING, delay: 0.06 }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <CostixMark />
        </div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.28 }}
        >
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500">
            The calculator ran into an error while loading.
          </p>
        </motion.div>

        {/* Error message */}
        {error?.message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
          >
            <p className="text-[12px] text-red-500 font-mono bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 mt-4 text-left break-all leading-relaxed">
              {error.message}
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="flex gap-3 justify-center mt-6"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.42 }}
        >
          <motion.button
            onClick={reset}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #10B981, #0F766E)',
              boxShadow: '0 2px 8px rgba(15,118,110,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.965 }}
            transition={SPRING_UI}
          >
            Try again
          </motion.button>

          <motion.a
            href="/"
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_UI}
          >
            Go home
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
