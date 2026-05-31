'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Calculator,
  Layers,
  Settings2,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
  Menu,
  X,
  Package,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ScanLine,
  Settings,
  CreditCard,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCtaTarget } from '@/components/use-cta';
import { useAccount } from '@/hooks/use-account';
import AccountMenu, { Avatar } from '@/components/AccountMenu';

/* ─── Shared spring presets ───────────────────────────────────── */
const SPRING    = { type: 'spring', stiffness: 280, damping: 26 } as const;
const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

/* ─── Noise texture overlay ───────────────────────────────────── */
const Noise = ({ opacity = 0.04 }: { opacity?: number }) => (
  <svg
    aria-hidden
    className="pointer-events-none select-none absolute inset-0 h-full w-full"
    style={{ opacity }}
  >
    <filter id="nx">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#nx)" />
  </svg>
);

/* ─── Gradient section divider ────────────────────────────────── */
const GradDivider = () => (
  <div
    aria-hidden
    className="h-px w-full"
    style={{ background: 'linear-gradient(to right, transparent 0%, #CBD5E1 25%, #CBD5E1 75%, transparent 100%)' }}
  />
);

/* ─── Scroll-triggered fade-up ────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef(null);
  const visible = useInView(ref, { once: true, margin: '-70px 0px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 240, damping: 26, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Costix Mark ─────────────────────────────────────────────── */
const CostixMark = ({
  size = 28,
  animate: run = false,
}: {
  size?: number;
  animate?: boolean;
}) => {
  const rx = 8.5 * (size / 36);
  const bars = [
    { y: 5.5,  w: 22,  op: 1.00, d: 0.00 },
    { y: 13,   w: 8.5, op: 0.55, d: 0.08 },
    { y: 20,   w: 8.5, op: 0.75, d: 0.16 },
    { y: 26.5, w: 22,  op: 1.00, d: 0.24 },
  ];
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 36 36" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden
      whileHover={{ scale: 1.07 }} transition={SPRING_UI}
    >
      <defs>
        <linearGradient id="cxG" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10847A" />
          <stop offset="100%" stopColor="#0A5E57" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx={rx} fill="url(#cxG)" />
      {bars.map(({ y, w, op, d }, i) => (
        <motion.rect
          key={i} x="5.5" y={y} height="5" rx="2.5"
          fill="white" fillOpacity={op}
          initial={run ? { width: 0 } : { width: w }}
          animate={{ width: w }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: run ? d + 0.15 : 0 }}
        />
      ))}
    </motion.svg>
  );
};

const Logo = () => (
  <Link href="/" className="flex items-center gap-2.5" aria-label="Costix home">
    <CostixMark size={30} animate />
    <motion.span
      className="font-bold text-[17px] text-slate-900"
      style={{ letterSpacing: '-0.04em' }}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING, delay: 0.28 }}
    >
      Costix
    </motion.span>
  </Link>
);

/* ─── Navbar ──────────────────────────────────────────────────── */
const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const account = useAccount();

  const handleMobileLogout = async () => {
    setOpen(false);
    await account.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <motion.nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/72 backdrop-blur-2xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay: 0.06 }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150">
              Features
            </a>
            <a href="#pricing" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150">
              Pricing
            </a>
            {account.loading ? (
              <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" aria-hidden />
            ) : account.authed ? (
              <AccountMenu account={account} />
            ) : (
              <>
                <div className="h-4 w-px bg-slate-200" />
                <Link href="/login" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150">
                  Log in
                </Link>
                <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.965 }} transition={SPRING_UI}>
                  <Link
                    href="/signup"
                    className="h-9 px-4 inline-flex items-center justify-center rounded-[9px] text-white text-[13px] font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #0F766E)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.12)',
                    }}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          className="md:hidden border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur-sm flex flex-col gap-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.18 }}
        >
          <a href="#features" className="min-h-[44px] flex items-center text-[14px] font-medium text-slate-700" onClick={() => setOpen(false)}>Features</a>
          <a href="#pricing"  className="min-h-[44px] flex items-center text-[14px] font-medium text-slate-700" onClick={() => setOpen(false)}>Pricing</a>
          <div className="h-px w-full bg-slate-100 my-1" />
          {account.loading ? null : account.authed ? (
            <>
              <div className="flex items-center gap-3 py-2">
                <Avatar initials={account.initials} size={40} />
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900 truncate">{account.fullName || 'Your account'}</p>
                  <p className="text-[12px] text-slate-400 truncate">{account.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-700">
                  <Sparkles size={13} /> {account.planLabel} plan
                </span>
                <span className="text-[12.5px] text-slate-500">
                  <span className="font-semibold text-slate-700">{account.unlimited ? 'Unlimited' : (account.credits ?? '-')}</span> {account.unlimited ? 'reveals' : 'credits'}
                </span>
              </div>
              <Link href="/app" onClick={() => setOpen(false)} className="min-h-[44px] flex items-center gap-2.5 text-[14px] font-medium text-slate-700">
                <Calculator size={16} className="text-slate-400" /> Continue to Calculator
              </Link>
              <Link href="/account" onClick={() => setOpen(false)} className="min-h-[44px] flex items-center gap-2.5 text-[14px] font-medium text-slate-700">
                <Settings size={16} className="text-slate-400" /> Account Settings
              </Link>
              <Link href="/#pricing" onClick={() => setOpen(false)} className="min-h-[44px] flex items-center gap-2.5 text-[14px] font-medium text-slate-700">
                <CreditCard size={16} className="text-slate-400" /> Subscription &amp; Plan
              </Link>
              <button onClick={handleMobileLogout} className="min-h-[44px] flex items-center gap-2.5 text-[14px] font-medium text-red-600">
                <LogOut size={16} /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="min-h-[44px] flex items-center text-[14px] font-medium text-slate-700">Log in</Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="mt-1 w-full min-h-[48px] inline-flex items-center justify-center rounded-xl text-white text-[14px] font-semibold"
                style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

/* ─── Animated value — soft opacity fade between values ──────── */
function AnimVal({ val, className = '' }: { val: string; className?: string }) {
  const [shown,   setShown]   = React.useState(val);
  const [opacity, setOpacity] = React.useState(1);
  React.useEffect(() => {
    if (val === shown) return;
    setOpacity(0);
    const t = setTimeout(() => { setShown(val); setOpacity(1); }, 220);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span
      className={className}
      style={{ opacity, transition: 'opacity 0.22s ease', display: 'inline-block' }}
    >
      {shown}
    </span>
  );
}

/* ─── Animated bar — smooth width transition ─────────────────── */
function AnimBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      className="h-1 rounded-full"
      style={{
        width: `${pct}%`,
        background: color,
        transition: 'width 0.85s cubic-bezier(0.4,0,0.2,1)',
      }}
    />
  );
}

/* ─── Hero costing demo — auto-playing 5-step simulation ──────── */
// Lightweight & isolated: a small frame array drives smooth value
// fades (AnimVal) and bar widths (AnimBar). No giant timelines, no
// coupling to the real calculator. Each frame is the end-state of one
// user action, so the loop reads as a person testing pricing live.
//
// Fixed-cost model so volume changes move cost/unit realistically:
//   cost/unit = materials/unit + (Labor $900 + Electricity $300) ÷ units
//   suggested price = cost/unit ÷ (1 − target margin)
interface Frame {
  caption: string;
  units: string;
  imported: boolean;
  fabric: string;       // landed fabric price / unit
  materials: string;    // materials / unit
  target: number;       // target margin %
  costUnit: string;
  totalCost: string;
  price: string;
  profit: string;
  margin: string;       // achieved margin
  healthy: boolean;
  matPct: number; laborPct: number; elecPct: number;
}

const FRAMES: Frame[] = [
  { caption: 'Live costing',             units: '500', imported: false, fabric: '$3.50', materials: '$4.20', target: 35, costUnit: '$6.60', totalCost: '$3,300', price: '$10.15', profit: '$3.55', margin: '35%', healthy: true,  matPct: 64, laborPct: 27, elecPct: 9 },
  { caption: 'Cotton price ↑',           units: '500', imported: false, fabric: '$4.10', materials: '$4.80', target: 35, costUnit: '$7.20', totalCost: '$3,600', price: '$11.08', profit: '$3.88', margin: '35%', healthy: true,  matPct: 67, laborPct: 25, elecPct: 8 },
  { caption: 'Units 500 → 800',          units: '800', imported: false, fabric: '$4.10', materials: '$4.80', target: 35, costUnit: '$6.30', totalCost: '$5,040', price: '$9.69',  profit: '$3.39', margin: '35%', healthy: true,  matPct: 76, laborPct: 18, elecPct: 6 },
  { caption: 'Target margin → 42%',      units: '800', imported: false, fabric: '$4.10', materials: '$4.80', target: 42, costUnit: '$6.30', totalCost: '$5,040', price: '$10.86', profit: '$4.56', margin: '42%', healthy: true,  matPct: 76, laborPct: 18, elecPct: 6 },
  { caption: 'Imported — landed cost ↑', units: '800', imported: true,  fabric: '$5.50', materials: '$6.20', target: 42, costUnit: '$7.70', totalCost: '$6,160', price: '$10.86', profit: '$3.16', margin: '29%', healthy: false, matPct: 80, laborPct: 15, elecPct: 5 },
];

const LiveCalcPreview = () => {
  const [inpIdx, setInpIdx] = React.useState(0); // input panel
  const [sumIdx, setSumIdx] = React.useState(0); // summary trails inputs ~420ms

  // Auto-play loop — advance one frame; summary recalculates with a stagger
  React.useEffect(() => {
    let dead = false;
    let lag: ReturnType<typeof setTimeout>;
    const iv = setInterval(() => {
      if (dead) return;
      setInpIdx(i => {
        const next = (i + 1) % FRAMES.length;
        lag = setTimeout(() => { if (!dead) setSumIdx(next); }, 420);
        return next;
      });
    }, 3300);
    return () => { dead = true; clearInterval(iv); clearTimeout(lag); };
  }, []);

  const inp = FRAMES[inpIdx];
  const sum = FRAMES[sumIdx];
  const TABS = ['Quick Cost', 'Batch', 'Saved'];
  const healthColor = sum.healthy ? 'text-emerald-600' : 'text-amber-600';

  const summaryRows: [string, string, string][] = [
    ['Cost / unit',  sum.costUnit,  'text-slate-700'],
    ['Total cost',   sum.totalCost, 'text-slate-700'],
    ['Gross profit', sum.profit,    healthColor],
    ['Margin',       sum.margin,    healthColor],
  ];
  const costSplit: [string, number, string][] = [
    ['Materials',   sum.matPct,   '#0F766E'],
    ['Labor',       sum.laborPct, '#10B981'],
    ['Electricity', sum.elecPct,  '#6EE7B7'],
  ];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden bg-white"
      style={{ boxShadow: '0 24px 64px -12px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.05)' }}
    >
      {/* App header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <CostixMark size={22} />
          <span className="font-semibold text-sm text-slate-900 tracking-tight">Costix</span>
        </div>
        <div className="flex gap-1">
          {TABS.map((label, i) => (
            <div
              key={label}
              className="text-[11px] px-2.5 py-1 rounded-full font-medium"
              style={{ background: i === 0 ? '#0F766E' : '#f1f5f9', color: i === 0 ? 'white' : '#64748b' }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Action caption — fixed height so steps never shift layout */}
      <div className="flex items-center gap-1.5 px-4 h-7 border-b border-slate-100 bg-slate-50/50">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <AnimVal val={inp.caption} className="text-[10px] font-medium text-slate-500" />
      </div>

      <div className="grid grid-cols-5">
        {/* Left — inputs */}
        <div className="col-span-3 border-r border-slate-100 p-4 space-y-2.5">
          {/* Product + units */}
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[12px] text-slate-700 bg-slate-50 font-medium">
              Cotton T-shirt
            </div>
            <div className="rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] text-slate-600 bg-white font-semibold whitespace-nowrap">
              <AnimVal val={inp.units} className="text-teal-700" /> units
            </div>
          </div>

          {/* Materials — Local/Imported toggle + animated fabric price */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Package size={10} className="text-teal-700" />
              <span className="text-[10px] font-semibold text-slate-700">Materials</span>
              <AnimVal val={inp.materials} className="ml-auto text-[10px] font-semibold text-slate-900" />
              <span className="text-[8.5px] text-slate-400">/unit</span>
            </div>
            <div className="flex p-0.5 rounded-lg bg-slate-100 mb-1.5 text-[9px] font-semibold">
              <div className="flex-1 text-center py-1 rounded-md" style={{ background: inp.imported ? 'transparent' : 'white', color: inp.imported ? '#94a3b8' : '#0F766E', boxShadow: inp.imported ? 'none' : '0 1px 2px rgba(0,0,0,0.06)', transition: 'all 0.3s ease' }}>Local</div>
              <div className="flex-1 text-center py-1 rounded-md" style={{ background: inp.imported ? 'white' : 'transparent', color: inp.imported ? '#0F766E' : '#94a3b8', boxShadow: inp.imported ? '0 1px 2px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.3s ease' }}>Imported</div>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[9.5px] text-slate-500">Cotton fabric{inp.imported ? ' · landed' : ''}</span>
              <AnimVal val={inp.fabric} className="text-[9.5px] font-medium text-slate-700" />
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[9.5px] text-slate-500">Thread</span>
              <span className="text-[9.5px] font-medium text-slate-700">$0.70</span>
            </div>
          </div>

          {/* Fixed costs / batch — static */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Settings2 size={10} className="text-teal-700" />
              <span className="text-[10px] font-semibold text-slate-700">Fixed costs</span>
              <span className="ml-auto text-[8.5px] text-slate-400">/batch</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[9.5px] text-slate-500">Labor</span>
              <span className="text-[9.5px] font-medium text-slate-700">$900</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[9.5px] text-slate-500">Electricity</span>
              <span className="text-[9.5px] font-medium text-slate-700">$300</span>
            </div>
          </div>

          {/* Target margin — animated */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp size={10} className="text-teal-700" />
              <span className="text-[10px] font-semibold text-teal-800">Target margin</span>
              <AnimVal val={`${inp.target}%`} className="ml-auto text-[10px] font-bold text-teal-800" />
            </div>
            <div className="h-1.5 rounded-full bg-teal-100">
              <AnimBar pct={inp.target} color="#0F766E" />
            </div>
          </div>
        </div>

        {/* Right — summary (lagged recalculation) */}
        <div className="col-span-2 p-4 space-y-2.5">
          <div className="text-[9.5px] uppercase tracking-wider text-slate-400 font-medium">Summary</div>

          {/* Suggested price */}
          <div className="rounded-xl p-3 text-center" style={{ background: 'linear-gradient(135deg, #0F766E, #10B981)' }}>
            <div className="text-[9.5px] text-white/70 mb-0.5">Suggested price</div>
            <AnimVal val={sum.price} className="text-xl font-bold text-white block" />
            <div className="text-[9.5px] text-white/70 mt-0.5">per unit</div>
          </div>

          {/* Margin health badge */}
          <div
            className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[10px] font-semibold"
            style={{ background: sum.healthy ? '#ecfdf5' : '#fffbeb', color: sum.healthy ? '#047857' : '#b45309', transition: 'background 0.4s ease, color 0.4s ease' }}
          >
            {sum.healthy ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <AnimVal val={sum.healthy ? 'Healthy margin' : 'Below target'} />
          </div>

          {/* Summary rows */}
          <div>
            {summaryRows.map(([l, v, c]) => (
              <div key={l} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-[9.5px] text-slate-500">{l}</span>
                <AnimVal val={v} className={`text-[10px] font-semibold ${c}`} />
              </div>
            ))}
          </div>

          {/* Cost split */}
          <div>
            <div className="text-[9.5px] uppercase tracking-wider text-slate-400 font-medium mb-1.5">Cost split</div>
            {costSplit.map(([l, p, c]) => (
              <div key={l} className="mb-1.5">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[9.5px] text-slate-500">{l}</span>
                  <AnimVal val={`${p}%`} className="text-[9.5px] font-medium text-slate-700" />
                </div>
                <div className="h-1 rounded-full bg-slate-100">
                  <AnimBar pct={p} color={c} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Pricing feature lists ───────────────────────────────────── */
const PRO_FEATURES = [
  'Quick Cost calculator',
  'Unlimited reveals',
  'Up to 5 saved costings',
  'Machine depreciation',
  'Imported material costing',
  'What-if analysis',
  'PDF & XLSX export',
] as const;

const PRO_LIMITS = ['1 user · 1 workspace', 'Single currency', 'English only'] as const;

const ADV_EXTRAS = [
  'Batch costing',
  'Unlimited saved costings',
  'Costing history & snapshots',
  'Duplicate & re-cost products',
  'Saved templates & presets',
  'Team workspace — multiple users',
  'Shared costings & history',
  'Multi-currency workspace',
  'Multi-language support',
  'Priority support',
] as const;

/* ─── Pricing Section ─────────────────────────────────────────── */
function PricingSection() {
  const cta = useCtaTarget();
  const [yearly, setYearly] = React.useState(true);

  const plans = [
    {
      name: 'Pro',
      tagline: 'For solo manufacturers running a single, simple operation.',
      priceMonthly: 29,
      priceYearly: 24,
      cta: 'Start Costing',
      features: PRO_FEATURES as unknown as string[],
      limits: PRO_LIMITS as unknown as string[],
      highlighted: false,
    },
    {
      name: 'Advanced',
      tagline: 'For growing manufacturers managing costing across products, currencies, and teams.',
      priceMonthly: 59,
      priceYearly: 49,
      cta: 'Use Costix',
      features: ['Everything in Pro, plus:', ...ADV_EXTRAS] as string[],
      limits: [] as string[],
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">

        {/* Header */}
        <FadeIn className="mb-10">
          <div className="max-w-xl">
            <h2 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] text-slate-900 mb-3">
              Simple, operational pricing.
            </h2>
            <p className="text-[15px] text-slate-500 leading-relaxed">
              Start free with Quick Cost. Pro adds saved costings and pro tools; Advanced adds batch costing, team workspaces, and multi-currency operations.
            </p>
          </div>
        </FadeIn>

        {/* Billing toggle */}
        <FadeIn delay={0.04} className="mb-10">
          <div className="inline-flex items-center gap-3">
            <span className={`text-[13.5px] font-medium transition-colors ${!yearly ? 'text-slate-900' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={yearly}
              onClick={() => setYearly(!yearly)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${yearly ? 'bg-teal-700' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${yearly ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-[13.5px] font-medium transition-colors ${yearly ? 'text-slate-900' : 'text-slate-400'}`}>
              Yearly
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-semibold">
                Save 17%
              </span>
            </span>
          </div>
        </FadeIn>

        {/* Plan cards */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
          {plans.map((plan, i) => {
            const price = yearly ? plan.priceYearly : plan.priceMonthly;
            const billedNote = yearly
              ? `$${plan.priceYearly * 12}/year`
              : 'billed monthly';
            return (
              <FadeIn key={plan.name} delay={i * 0.05}>
                <div
                  className={`relative h-full bg-white rounded-2xl border p-7 sm:p-8 flex flex-col ${
                    plan.highlighted
                      ? 'border-teal-300 ring-1 ring-teal-200'
                      : 'border-slate-200/80'
                  }`}
                  style={
                    plan.highlighted
                      ? { boxShadow: '0 8px 32px -8px rgba(15,118,110,0.18)' }
                      : { boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }
                  }
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-700 text-white text-[11.5px] font-semibold shadow-sm">
                        <Zap size={10} strokeWidth={2.5} /> Operational
                      </span>
                    </div>
                  )}

                  {/* Plan name + description */}
                  <div className="mb-5">
                    <p className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${plan.highlighted ? 'text-teal-700' : 'text-slate-400'}`}>
                      {plan.name}
                    </p>
                    <p className="text-[13.5px] text-slate-500 leading-snug">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-5 border-b border-slate-100 pb-5">
                    <div className="flex items-end gap-1.5">
                      <span className="text-[40px] font-bold text-slate-900 leading-none">${price}</span>
                      <span className="text-[14px] text-slate-400 mb-1.5">/mo</span>
                    </div>
                    <p className="text-[12px] text-slate-400 mt-1.5">{billedNote}</p>
                  </div>

                  {/* CTA */}
                  <motion.div
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.975 }}
                    transition={SPRING_UI}
                    className="mb-7"
                  >
                    <Link
                      href={cta.href}
                      className={`w-full h-10 rounded-xl text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                        plan.highlighted
                          ? 'text-white hover:opacity-90'
                          : 'border border-slate-200 text-slate-900 hover:bg-slate-50'
                      }`}
                      style={
                        plan.highlighted
                          ? {
                              background: 'linear-gradient(135deg, #10B981, #0F766E)',
                              boxShadow: '0 2px 8px rgba(15,118,110,0.28)',
                            }
                          : { boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }
                      }
                    >
                      {plan.cta} <ArrowRight size={13} strokeWidth={2.5} />
                    </Link>
                  </motion.div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-700">
                        <CheckCircle2
                          size={14}
                          className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-teal-600' : 'text-slate-400'}`}
                        />
                        {f}
                      </li>
                    ))}
                    {plan.limits.map((l) => (
                      <li key={l} className="flex items-start gap-2.5 text-[13px] text-slate-400">
                        <span className="mt-0.5 shrink-0 w-3.5 text-center text-[10px] leading-[14px]">—</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Team workspace note */}
        <FadeIn delay={0.12}>
          <div className="mt-8 max-w-3xl rounded-2xl bg-slate-50 border border-slate-200/80 px-6 py-5">
            <p className="text-[13px] font-semibold text-slate-700 mb-1.5">How team workspace works</p>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              With Advanced, one account becomes your shared workspace. Factory managers create costings.
              Accountants export reports. Supervisors review pricing. Everyone works from the same data —
              no syncing, no spreadsheet versions.
            </p>
          </div>
        </FadeIn>

        {/* Positioning footnote */}
        <FadeIn delay={0.14}>
          <p className="mt-5 text-[12px] text-slate-400 max-w-md">
            Costix is a manufacturing costing workspace — not ERP, not accounting software, not inventory management.
          </p>
        </FadeIn>

      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function Home() {
  const cta = useCtaTarget();
  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.14 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  };

  /* Feature list — horizontal rows, not cards */
  const features = [
    {
      icon: Calculator,
      title: 'Per-unit costing',
      desc: 'Add materials, labor, electricity, packaging, and rent. Get cost-per-unit and a suggested price in real time.',
    },
    {
      icon: ScanLine,
      title: 'What-if scenarios',
      desc: 'Adjust any input — material cost, labor rate, freight — and see the margin impact before you quote.',
    },
    {
      icon: Layers,
      title: 'Batch production runs',
      desc: 'Plan multi-size runs and see exactly how cost-per-unit shifts as volume increases.',
    },
    {
      icon: Settings2,
      title: 'Machine cost allocation',
      desc: 'Spread machine purchase and maintenance across production runs — by time or by unit output.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Professional reports',
      desc: 'One click exports: a clean PDF for clients or a fully-functional Excel sheet for your finance team.',
    },
    {
      icon: Package,
      title: 'Imported material costing',
      desc: 'Add freight, duty, clearing, and taxes to landed cost. Recoverable taxes excluded automatically.',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-20 bg-white">
        <Noise opacity={0.032} />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[720px] h-[440px] opacity-[0.2]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, #10B981 0%, transparent 68%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left — copy */}
            <motion.div
              className="max-w-lg"
              variants={heroContainer}
              initial="hidden"
              animate="show"
            >
              <motion.h1
                variants={heroItem}
                className="text-[40px] sm:text-[48px] lg:text-[54px] font-bold tracking-[-0.03em] text-slate-900 mb-5 leading-[1.06]"
              >
                Know your{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #0F766E 0%, #10B981 60%)' }}
                >
                  real
                </span>
                <br className="hidden sm:block" />
                {' '}production cost.
              </motion.h1>

              <motion.p variants={heroItem} className="text-[16px] text-slate-600 mb-8 leading-[1.7] max-w-[440px]">
                AI-assisted costing built for manufacturers. Enter your materials,
                labor, and overhead — Costix calculates your exact cost-per-unit,
                sets your margin, and tells you what to charge.
              </motion.p>

              <motion.div variants={heroItem} className="flex flex-col sm:flex-row gap-3">
                <motion.div whileHover={{ scale: 1.022 }} whileTap={{ scale: 0.966 }} transition={SPRING_UI}>
                  <Link
                    href={cta.href}
                    className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-xl text-white font-semibold text-[14px]"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #0F766E)',
                      boxShadow: '0 2px 8px rgba(15,118,110,0.32), inset 0 1px 0 rgba(255,255,255,0.13)',
                    }}
                  >
                    Start Calculating <ArrowRight size={15} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.018 }} whileTap={{ scale: 0.97 }} transition={SPRING_UI}>
                  <a
                    href="#pricing"
                    className="h-11 px-6 inline-flex items-center justify-center rounded-xl text-slate-700 text-[14px] font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                  >
                    View Pricing
                  </a>
                </motion.div>
              </motion.div>

              {/* Quiet trust line */}
              <motion.p
                variants={heroItem}
                className="mt-6 text-[12px] text-slate-400 tracking-tight"
              >
                No spreadsheets. No setup. Works in your browser.
              </motion.p>
            </motion.div>

            {/* Right — preview */}
            <motion.div
              className="relative w-full"
              initial={{ opacity: 0, y: 24, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 28, delay: 0.28 }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-25 scale-90"
                style={{ background: 'radial-gradient(ellipse at 60% 40%, #10B981, transparent 70%)' }}
              />
              <LiveCalcPreview />
            </motion.div>
          </div>
        </div>
      </section>

      <GradDivider />

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">

          {/* Section header — left-aligned, more authoritative */}
          <FadeIn className="mb-12">
            <div className="max-w-xl">
              <h2 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] text-slate-900 mb-3">
                Built for manufacturers who need to know their numbers.
              </h2>
              <p className="text-[15px] text-slate-500 leading-relaxed">
                Every cost input accounted for — from raw materials and landed freight to
                machine depreciation and overhead allocation.
              </p>
            </div>
          </FadeIn>

          {/* Horizontal feature rows — not a card grid */}
          <div className="grid md:grid-cols-2 gap-x-14 lg:gap-x-20">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.05}>
                <div className="flex gap-4 py-5 border-b border-slate-100 last:border-0 md:[&:nth-last-child(2)]:border-0">
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: '#F0FDF9' }}
                  >
                    <Icon size={15} className="text-teal-700" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-slate-900 mb-1 tracking-tight">{title}</h3>
                    <p className="text-[13.5px] text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Export note — inline, compact */}
          <FadeIn delay={0.3}>
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="text-[13px] font-medium text-slate-500">Export your work:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[13px] text-slate-700 font-medium">
                  <FileSpreadsheet size={14} className="text-teal-600" />
                  PDF for clients
                </div>
                <div className="w-px h-3 bg-slate-200" />
                <div className="flex items-center gap-2 text-[13px] text-slate-700 font-medium">
                  <BarChart3 size={14} className="text-teal-600" />
                  Excel for your finance team
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <GradDivider />

      {/* ── What-If ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-[#FAFBFC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Mock card */}
            <FadeIn className="order-2 lg:order-1">
              <div
                className="relative rounded-2xl border border-slate-200/70 bg-white overflow-hidden p-6 sm:p-8"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                <Noise opacity={0.025} />
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ ...SPRING, delay: 0.1 }}
                >
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1">Scenario</div>
                      <div className="text-[15px] font-semibold text-slate-900">Cotton fabric +18%</div>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold border"
                      style={{ background: '#FFF1F2', color: '#E11D48', borderColor: '#FFE4E6' }}
                    >
                      Material spike
                    </div>
                  </div>
                  <div className="space-y-0">
                    {[
                      { label: 'Current cost / unit',    val: '$6.60',        color: 'text-slate-900' },
                      { label: 'Projected cost / unit',  val: '$7.39',        color: 'text-red-600'   },
                      { label: 'Margin impact',          val: '−4.8 pp',      color: 'text-red-600'   },
                      { label: 'Suggested price increase', val: '+$0.79 / unit', color: 'text-teal-700' },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="flex justify-between items-center py-3.5 border-b border-slate-100 last:border-0">
                        <span className="text-[13px] text-slate-500">{label}</span>
                        <span className={`text-[15px] font-semibold tabular-nums ${color}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </FadeIn>

            {/* Copy */}
            <FadeIn className="order-1 lg:order-2" delay={0.08}>
              <h2 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] text-slate-900 mb-4 leading-[1.2]">
                See the impact of price changes before they hit your margin.
              </h2>
              <p className="text-[15px] text-slate-600 mb-7 leading-[1.7]">
                Adjust any input — raw material cost, freight rate, labor — and Costix
                recalculates cost-per-unit and margin instantly. Know your numbers before
                you commit to a quote.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Full breakdown by material, labor, and overhead',
                  'Run-size comparison for volume pricing',
                  'Margin target updates as you type',
                  'Imported material costing with landed cost',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-[14px] text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.022 }} whileTap={{ scale: 0.966 }} transition={SPRING_UI} className="inline-block">
                <Link
                  href={cta.href}
                  className="h-10 px-5 inline-flex items-center gap-2 rounded-xl text-white font-semibold text-[13.5px]"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #0F766E)',
                    boxShadow: '0 2px 8px rgba(15,118,110,0.28)',
                  }}
                >
                  Try it now <ArrowRight size={14} />
                </Link>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      <GradDivider />

      <PricingSection />

      <GradDivider />

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <Noise opacity={0.028} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #F0FDF9 0%, #ffffff 50%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">
          <div className="max-w-xl">
            <FadeIn>
              <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.025em] text-slate-900 mb-4 leading-[1.2]">
                Your next quote starts here.
              </h2>
              <p className="text-[15px] text-slate-600 mb-8 leading-[1.7]">
                Replace the spreadsheet. Know your real cost. Price with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div whileHover={{ scale: 1.022 }} whileTap={{ scale: 0.966 }} transition={SPRING_UI}>
                  <Link
                    href={cta.href}
                    className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-xl text-white font-semibold text-[14px]"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #0F766E)',
                      boxShadow: '0 3px 12px rgba(15,118,110,0.36), inset 0 1px 0 rgba(255,255,255,0.13)',
                    }}
                  >
                    Start Calculating <ArrowRight size={15} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.018 }} whileTap={{ scale: 0.97 }} transition={SPRING_UI}>
                  <a
                    href="#pricing"
                    className="h-11 px-6 inline-flex items-center justify-center rounded-xl text-slate-700 text-[14px] font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                  >
                    See pricing
                  </a>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <GradDivider />
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 pb-10 border-b border-slate-100">
            {/* Brand */}
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-4 text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                AI-assisted manufacturing costing. Built for factory owners who need accurate numbers, fast.
              </p>
            </div>

            {/* Product links */}
            <div>
              <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Product</p>
              <ul className="space-y-3">
                {[
                  { label: 'Features',        href: '#features' },
                  { label: 'Pricing',         href: '#pricing'  },
                  { label: 'Open Calculator', href: cta.href },
                  { label: 'FAQ',             href: '/faq'      },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors duration-150">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Company</p>
              <ul className="space-y-3">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Use',   href: '/terms'   },
                  { label: 'Contact',        href: '/contact' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors duration-150">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-[12px] text-slate-400">© {new Date().getFullYear()} Costix. All rights reserved.</p>
            <p className="text-[12px] text-slate-400">Intelligent manufacturing costing.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
