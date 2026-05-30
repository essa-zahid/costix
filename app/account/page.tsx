'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calculator, KeyRound, LogOut, Sparkles, ArrowUpRight } from 'lucide-react';
import { SiteNavbar } from '@/components/SiteNav';
import { Avatar } from '@/components/AccountMenu';
import { useAccount } from '@/hooks/use-account';

const SPRING = { type: 'spring', stiffness: 280, damping: 26 } as const;

export default function AccountPage() {
  const router = useRouter();
  const account = useAccount();

  // Once auth has resolved, a signed-out visitor has no account to view.
  React.useEffect(() => {
    if (!account.loading && !account.authed) router.replace('/login');
  }, [account.loading, account.authed, router]);

  const handleLogout = async () => {
    await account.signOut();
    router.push('/');
    router.refresh();
  };

  if (account.loading || !account.authed) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <SiteNavbar />
        <div className="flex items-center justify-center pt-40">
          <p className="text-sm text-slate-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  const creditsText = account.unlimited ? 'Unlimited' : (account.credits ?? '-');

  const rowClass = 'flex items-center justify-between gap-3 py-3.5';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SiteNavbar />

      <main className="max-w-xl mx-auto px-5 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
          <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">Account</h1>
          <p className="mt-1 text-[14px] text-slate-500">Manage your Costix profile and plan.</p>

          {/* Identity card */}
          <div className="mt-6 rounded-2xl bg-white p-6" style={{ boxShadow: '0 8px 40px -12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-4">
              <Avatar initials={account.initials} size={56} />
              <div className="min-w-0">
                <p className="text-[17px] font-bold text-slate-900 truncate">{account.fullName || 'Your account'}</p>
                <p className="text-[13px] text-slate-500 truncate">{account.email}</p>
              </div>
            </div>

            <div className="mt-5 h-px bg-slate-100" />

            {/* Plan */}
            <div className={rowClass}>
              <div>
                <p className="text-[13px] font-medium text-slate-700">Plan</p>
                <p className="text-[12px] text-slate-400">Your current subscription tier</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[12.5px] font-semibold text-teal-700">
                <Sparkles size={13} /> {account.planLabel}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Credits */}
            <div className={rowClass}>
              <div>
                <p className="text-[13px] font-medium text-slate-700">{account.unlimited ? 'Reveals' : 'Reveal credits'}</p>
                <p className="text-[12px] text-slate-400">{account.unlimited ? 'Included with your plan' : 'Remaining on the free plan'}</p>
              </div>
              <span className="text-[15px] font-bold text-slate-900">{creditsText}</span>
            </div>

            {!account.unlimited && (
              <Link href="/#pricing" className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-teal-700 hover:underline underline-offset-2">
                Upgrade to Advanced <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 rounded-2xl bg-white p-2" style={{ boxShadow: '0 8px 40px -12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)' }}>
            <Link href="/app" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Calculator size={17} className="text-slate-400" /> Continue to Calculator
            </Link>
            <Link href="/forgot-password" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <KeyRound size={17} className="text-slate-400" /> Change password
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={17} /> Log Out
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
