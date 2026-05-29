'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useCtaTarget } from '@/components/use-cta';

const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

/* ─── Costix mark (static — no mount animation for inner pages) ── */
export function CostixMark({ size = 28 }: { size?: number }) {
  const rx = 8.5 * (size / 36);
  const bars = [
    { y: 5.5,  w: 22,  op: 1.00 },
    { y: 13,   w: 8.5, op: 0.55 },
    { y: 20,   w: 8.5, op: 0.75 },
    { y: 26.5, w: 22,  op: 1.00 },
  ];
  return (
    <svg
      width={size} height={size} viewBox="0 0 36 36" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden
    >
      <defs>
        <linearGradient id="cxG-sitenav" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10847A" />
          <stop offset="100%" stopColor="#0A5E57" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx={rx} fill="url(#cxG-sitenav)" />
      {bars.map(({ y, w, op }, i) => (
        <rect key={i} x="5.5" y={y} height="5" rx="2.5" width={w} fill="white" fillOpacity={op} />
      ))}
    </svg>
  );
}

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Costix home">
      <CostixMark size={30} />
      <span
        className="font-bold text-[17px] text-slate-900"
        style={{ letterSpacing: '-0.04em' }}
      >
        Costix
      </span>
    </Link>
  );
}

export function GradDivider() {
  return (
    <div
      aria-hidden
      className="h-px w-full"
      style={{
        background:
          'linear-gradient(to right, transparent 0%, #CBD5E1 25%, #CBD5E1 75%, transparent 100%)',
      }}
    />
  );
}

/* ─── Shared Navbar ───────────────────────────────────────────── */
export function SiteNavbar() {
  const [open, setOpen] = React.useState(false);
  const cta = useCtaTarget();

  const NAV_LINKS = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing',  href: '/#pricing'  },
    { label: 'FAQ',      href: '/faq'       },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-2xl"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <SiteLogo />

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
              >
                {label}
              </a>
            ))}
            <div className="h-4 w-px bg-slate-200" />
            <Link
              href="/login"
              className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
            >
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
        <div className="md:hidden border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur-sm flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="min-h-[44px] flex items-center text-[14px] font-medium text-slate-700"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="h-px w-full bg-slate-100 my-1" />
          <Link
            href="/login"
            className="min-h-[44px] flex items-center text-[14px] font-medium text-slate-700"
          >
            Log in
          </Link>
          <Link
            href={cta.href}
            className="mt-1 w-full min-h-[48px] inline-flex items-center justify-center rounded-xl text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #10B981, #0F766E)' }}
          >
            {cta.label}
          </Link>
        </div>
      )}
    </nav>
  );
}

/* ─── Shared Footer ───────────────────────────────────────────── */
export function SiteFooter() {
  const cta = useCtaTarget();
  const PRODUCT_LINKS = [
    { label: 'Features',        href: '/#features' },
    { label: 'Pricing',         href: '/#pricing'  },
    { label: 'Open Calculator', href: cta.href },
    { label: 'FAQ',             href: '/faq'       },
  ];
  const COMPANY_LINKS = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use',   href: '/terms'   },
    { label: 'Contact',        href: '/contact' },
  ];

  return (
    <>
      <GradDivider />
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 pb-10 border-b border-slate-100">
            {/* Brand */}
            <div className="md:col-span-1">
              <SiteLogo />
              <p className="mt-4 text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                Manufacturing costing workspace. Built for factory owners who need accurate numbers, fast.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Product</p>
              <ul className="space-y-3">
                {PRODUCT_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors duration-150"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Company</p>
              <ul className="space-y-3">
                {COMPANY_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors duration-150"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-[12px] text-slate-400">
              © {new Date().getFullYear()} Costix. All rights reserved.
            </p>
            <p className="text-[12px] text-slate-400">Manufacturing costing workspace.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
