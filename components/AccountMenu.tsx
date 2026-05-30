'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Calculator, Settings, Sparkles, LogOut, ChevronDown, CreditCard } from 'lucide-react';
import type { AccountState } from '@/hooks/use-account';

const SPRING = { type: 'spring', stiffness: 400, damping: 32 } as const;

function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-semibold select-none"
      style={{
        width: size, height: size, fontSize: size * 0.4,
        background: 'linear-gradient(135deg, #10B981, #0F766E)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/**
 * Desktop account control: avatar button + dropdown.
 * Presentational - all account state comes from useAccount() via props so the
 * navbar owns a single source of auth state.
 */
export default function AccountMenu({ account }: { account: AccountState }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await account.signOut();
    router.push('/');
    router.refresh();
  };

  const creditsText = account.unlimited
    ? 'Unlimited'
    : account.credits === null ? '-' : `${account.credits}`;

  const itemClass = 'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13.5px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-1.5 hover:bg-slate-100 transition-colors"
        aria-haspopup="menu" aria-expanded={open} aria-label="Account menu"
      >
        <Avatar initials={account.initials} />
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={SPRING}
            role="menu"
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white p-1.5 z-50"
            style={{ boxShadow: '0 12px 40px -8px rgba(2,32,30,0.22), 0 0 0 1px rgba(0,0,0,0.06)' }}
          >
            {/* Identity header */}
            <div className="flex items-center gap-3 px-2.5 py-2.5">
              <Avatar initials={account.initials} size={38} />
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-slate-900 truncate">
                  {account.fullName || 'Your account'}
                </p>
                <p className="text-[12px] text-slate-400 truncate">{account.email}</p>
              </div>
            </div>

            {/* Plan + credits */}
            <div className="mx-1.5 mb-1.5 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-700">
                <Sparkles size={13} /> {account.planLabel} plan
              </span>
              <span className="text-[12px] text-slate-500">
                <span className="font-semibold text-slate-700">{creditsText}</span> {account.unlimited ? 'reveals' : 'credits'}
              </span>
            </div>

            <div className="h-px bg-slate-100 mx-2 my-1" />

            <Link href="/app" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
              <Calculator size={15} className="text-slate-400" /> Continue to Calculator
            </Link>
            <Link href="/account" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
              <Settings size={15} className="text-slate-400" /> Account Settings
            </Link>
            <Link href="/#pricing" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
              <CreditCard size={15} className="text-slate-400" /> Subscription &amp; Plan
            </Link>

            <div className="h-px bg-slate-100 mx-2 my-1" />

            <button role="menuitem" onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13.5px] text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={15} /> Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Avatar };
