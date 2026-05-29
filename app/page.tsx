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
  ArrowRight,
  ScanLine,
} from 'lucide-react';
import { useCtaTarget } from '@/components/use-cta';

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
  const cta = useCtaTarget();
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
            <div className="h-4 w-px bg-slate-200" />
            <Link href="/login" className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150">
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.965 }} transition={SPRING_UI}>
              <Link
                href={cta.href}
                className="h-9 px-4 inline-flex items-center justify-center rounded-[9px] text-white text-[13px] font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #0F766E)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
              >
                {cta.label}
              </Link>
            </motion.div>
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
          <Link href="/login" className="min-h-[44px] flex items-center text-[14px] font-medium text-slate-700">Log in</Link>
          <Link
            href={cta.href}
            className="mt-1 w-full min-h-[48px] inline-flex items-center justify-center rounded-xl text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)' }}
          >
            {cta.label}
          </Link>
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

/* ─── Costing scenarios (all values mathematically verified) ──── */
// cost = materials + $1.80 labor + $0.60 elec; price = cost ÷ 0.65 (35% margin target)
interface Scenario {
  fabric: string; materials: string;
  costUnit: string; price: string; profit: string; margin: string;
  matPct: number; laborPct: number; elecPct: number;
}
const SCENARIOS: Scenario[] = [
  // Baseline: fabric $3.50 + thread $0.70 → mat $4.20 → cost $6.60 → price $10.15
  { fabric:'$3.50', materials:'$4.20', costUnit:'$6.60', price:'$10.15', profit:'$3.55', margin:'34.9%', matPct:64, laborPct:27, elecPct:9  },
  // Spike:    fabric $4.10 + thread $0.70 → mat $4.80 → cost $7.20 → price $11.08
  { fabric:'$4.10', materials:'$4.80', costUnit:'$7.20', price:'$11.08', profit:'$3.88', margin:'35.0%', matPct:67, laborPct:25, elecPct:8  },
  // Adjusted: fabric $3.70 + thread $0.70 → mat $4.40 → cost $6.80 → price $10.46
  { fabric:'$3.70', materials:'$4.40', costUnit:'$6.80', price:'$10.46', profit:'$3.66', margin:'35.0%', matPct:65, laborPct:26, elecPct:9  },
];

/* ─── Live App Preview — operational animation loop ──────────── */
const LiveCalcPreview = () => {
  const [scIdx,     setScIdx]     = React.useState(0); // drives left-panel inputs
  const [sumIdx,    setSumIdx]    = React.useState(0); // drives right-panel summary (lags ~720ms)
  const [activeTab, setActiveTab] = React.useState(0); // 0=Quick Cost 1=Batch 2=Saved

  // Passive operational loop — simulates a user adjusting material costs
  React.useEffect(() => {
    let dead = false;
    const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    const run = async () => {
      while (!dead) {
        // ── Fabric price rises ────────────────────────────
        await wait(5500);  if (dead) break;
        setScIdx(1);                        // input panel updates first
        await wait(720);   if (dead) break;
        setSumIdx(1);                       // summary recalculates with stagger

        // ── Fabric adjusts down ───────────────────────────
        await wait(6200);  if (dead) break;
        setScIdx(2);
        await wait(720);   if (dead) break;
        setSumIdx(2);

        // ── Brief Batch tab peek ──────────────────────────
        await wait(4000);  if (dead) break;
        setActiveTab(1);
        await wait(2600);  if (dead) break;
        setActiveTab(0);

        // ── Returns to baseline ───────────────────────────
        await wait(2200);  if (dead) break;
        setScIdx(0);
        await wait(720);   if (dead) break;
        setSumIdx(0);

        await wait(3500); // rest before next cycle
      }
    };

    run();
    return () => { dead = true; };
  }, []);

  const inp = SCENARIOS[scIdx];
  const sum = SCENARIOS[sumIdx];
  const TABS = ['Quick Cost', 'Batch', 'Saved'];

  // Batch view: 500 units × current scenario costs
  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const batchMat   = fmt(500 * parseFloat(inp.materials.replace('$', '')));
  const batchTotal = fmt(500 * parseFloat(inp.costUnit.replace('$', '')));

  const summaryRows: [string, string, string][] = [
    ['Cost / unit',   sum.costUnit, 'text-slate-700'],
    ['Profit / unit', sum.profit,   'text-emerald-600'],
    ['Margin',        sum.margin,   'text-emerald-600'],
  ];
  const costSplit: [string, number, string][] = [
    ['Materials',   sum.matPct,   '#0F766E'],
    ['Labor',       sum.laborPct, '#10B981'],
    ['Electricity', sum.elecPct,  '#6EE7B7'],
  ];
  const batchRows: [string, string, string][] = [
    ['Materials / batch',   batchMat,     'text-slate-700'],
    ['Labor / batch',       '$900.00',    'text-slate-700'],
    ['Electricity / batch', '$300.00',    'text-slate-700'],
    ['Cost / unit',         inp.costUnit, 'text-teal-700'],
    ['Total run cost',      batchTotal,   'text-slate-900'],
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
              style={{
                background: i === activeTab ? '#0F766E' : '#f1f5f9',
                color:      i === activeTab ? 'white'   : '#64748b',
                transition: 'background 0.32s ease, color 0.32s ease',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Cost tab ─────────────────────────────────────── */}
      {activeTab === 0 && (
        <div className="grid grid-cols-5">
          {/* Left — inputs */}
          <div className="col-span-3 border-r border-slate-100 p-4 space-y-2.5">
            <div>
              <div className="text-[9.5px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Product</div>
              <div className="rounded-lg border border-slate-200 px-3 py-2 text-[12px] text-slate-700 bg-slate-50 font-medium">
                Cotton T-shirt
              </div>
            </div>

            {/* Materials — animated fabric price */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Package size={10} className="text-teal-700" />
                <span className="text-[10px] font-semibold text-slate-700">Materials</span>
                <AnimVal val={inp.materials} className="ml-auto text-[10px] font-semibold text-slate-900" />
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9.5px] text-slate-500">Cotton fabric</span>
                <AnimVal val={inp.fabric} className="text-[9.5px] font-medium text-slate-700" />
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9.5px] text-slate-500">Thread</span>
                <span className="text-[9.5px] font-medium text-slate-700">$0.70</span>
              </div>
            </div>

            {/* Labor — static */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Settings2 size={10} className="text-teal-700" />
                <span className="text-[10px] font-semibold text-slate-700">Labor</span>
                <span className="ml-auto text-[10px] font-semibold text-slate-900">$1.80</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9.5px] text-slate-500">Seamstress · 0.5 hr</span>
                <span className="text-[9.5px] font-medium text-slate-700">$1.80</span>
              </div>
            </div>

            {/* Electricity — static */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
              <div className="flex items-center gap-1.5">
                <Zap size={10} className="text-teal-700" />
                <span className="text-[10px] font-semibold text-slate-700">Electricity</span>
                <span className="ml-auto text-[10px] font-semibold text-slate-900">$0.60</span>
              </div>
            </div>

            {/* Margin target */}
            <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp size={10} className="text-teal-700" />
                <span className="text-[10px] font-semibold text-teal-800">Target margin — 35%</span>
              </div>
              <div className="h-1.5 rounded-full bg-teal-100">
                <div className="h-1.5 rounded-full" style={{ width: '35%', background: '#0F766E' }} />
              </div>
            </div>
          </div>

          {/* Right — summary (lagged recalculation) */}
          <div className="col-span-2 p-4 space-y-2.5">
            <div className="text-[9.5px] uppercase tracking-wider text-slate-400 font-medium">Summary</div>

            {/* Suggested price card */}
            <div className="rounded-xl p-3 text-center" style={{ background: 'linear-gradient(135deg, #0F766E, #10B981)' }}>
              <div className="text-[9.5px] text-white/70 mb-0.5">Suggested price</div>
              <AnimVal val={sum.price} className="text-xl font-bold text-white block" />
              <div className="text-[9.5px] text-white/70 mt-0.5">per unit</div>
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

            {/* Cost split bars */}
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

            {/* Export buttons */}
            <div className="flex gap-1.5 pt-0.5">
              <div className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-[9.5px] font-semibold text-white" style={{ background: '#0F766E' }}>
                <FileSpreadsheet size={9} /> PDF
              </div>
              <div className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-[9.5px] font-semibold border border-slate-200 text-slate-600 bg-slate-50">
                <BarChart3 size={9} /> XLSX
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Batch tab ──────────────────────────────────────────── */}
      {activeTab === 1 && (
        <div className="p-4">
          <div className="text-[9.5px] uppercase tracking-wider text-slate-400 mb-2 font-medium">Batch Run</div>
          <div className="rounded-lg border border-slate-200 px-3 py-2 text-[12px] text-slate-700 bg-slate-50 font-medium mb-3">
            Cotton T-shirt · 500 units
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
            {batchRows.map(([l, v, c]) => (
              <div key={l} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-[9.5px] text-slate-500">{l}</span>
                <span className={`text-[10px] font-semibold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/40 p-2.5">
            <span className="text-[9.5px] font-medium text-teal-800">
              Add run sizes to compare cost per unit at different production volumes.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Pricing feature lists ───────────────────────────────────── */
const PRO_FEATURES = [
  'Quick Costing & Batch Costing',
  'Machine Depreciation',
  'Imported Material Costing',
  'What-if Analysis',
  'PDF & XLSX Export',
  'Up to 5 saved costings',
  'English & Urdu/Hindi',
] as const;

const PRO_LIMITS = ['1 user · 1 workspace', 'Single currency'] as const;

const ADV_EXTRAS = [
  'Unlimited saved costings',
  'Costing history & snapshots',
  'Duplicate & re-cost products',
  'Saved templates & presets',
  'Team workspace — multiple users',
  'Shared costings & history',
  'Multi-currency workspace',
  'Arabic, Chinese, Russian, Spanish, Portuguese, French',
  'Priority support',
] as const;

/* ─── Pricing Section ─────────────────────────────────────────── */
function PricingSection() {
  const cta = useCtaTarget();
  const [yearly, setYearly] = React.useState(true);

  const plans = [
    {
      name: 'Pro',
      tagline: 'For solo manufacturers and small production businesses.',
      priceMonthly: 29,
      priceYearly: 24,
      cta: 'Start Costing',
      features: PRO_FEATURES as unknown as string[],
      limits: PRO_LIMITS as unknown as string[],
      highlighted: false,
    },
    {
      name: 'Advanced',
      tagline: 'For businesses managing costing across products and teams.',
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
              No per-user fees. No setup costs. Pay for what you need.
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
                    {cta.label} <ArrowRight size={15} />
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
                  {cta.label} <ArrowRight size={14} />
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
                    {cta.label} <ArrowRight size={15} />
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
                  { label: cta.label, href: cta.href },
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
