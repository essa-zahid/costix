'use client';

import dynamic from 'next/dynamic';
import { RevealProvider } from '@/hooks/use-reveal';

/* ─── Animated loading splash ───────────────────────────────── */
function LoadingScreen() {
  // CSS keyframes defined inline to avoid globals.css edits
  const style = `
    @keyframes cx-bar {
      0%   { width: 0; opacity: 0 }
      30%  { opacity: 1 }
      100% { opacity: 1 }
    }
    @keyframes cx-fade {
      from { opacity: 0; transform: translateY(6px) }
      to   { opacity: 1; transform: translateY(0) }
    }
    @keyframes cx-pulse {
      0%, 100% { opacity: 0.6 }
      50%       { opacity: 1   }
    }
    .cx-bar-1 { animation: cx-bar 0.45s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
    .cx-bar-2 { animation: cx-bar 0.45s cubic-bezier(0.22,1,0.36,1) 0.23s both; }
    .cx-bar-3 { animation: cx-bar 0.45s cubic-bezier(0.22,1,0.36,1) 0.31s both; }
    .cx-bar-4 { animation: cx-bar 0.45s cubic-bezier(0.22,1,0.36,1) 0.39s both; }
    .cx-text  { animation: cx-fade 0.5s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
    .cx-dot   { animation: cx-pulse 1.8s ease-in-out 0.8s infinite; }
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <style>{style}</style>

      {/* Animated logo mark */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="loadGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10847A" />
            <stop offset="100%" stopColor="#0A5E57" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="8.5" fill="url(#loadGrad)" />
        <rect className="cx-bar-1" x="5.5" y="5.5"  height="5" rx="2.5" fill="white"                  style={{ width: 22 }} />
        <rect className="cx-bar-2" x="5.5" y="13"   height="5" rx="2.5" fill="white" fillOpacity="0.55" style={{ width: 8.5 }} />
        <rect className="cx-bar-3" x="5.5" y="20"   height="5" rx="2.5" fill="white" fillOpacity="0.75" style={{ width: 8.5 }} />
        <rect className="cx-bar-4" x="5.5" y="26.5" height="5" rx="2.5" fill="white"                  style={{ width: 22 }} />
      </svg>

      {/* Text */}
      <div className="cx-text mt-4 flex items-center gap-1.5">
        <span className="text-[13.5px] text-slate-500 font-medium tracking-tight">Loading Costix</span>
        <span className="cx-dot inline-block w-1 h-1 rounded-full bg-teal-500 mt-0.5" />
      </div>
    </div>
  );
}

/* ─── Dynamic calculator import ─────────────────────────────── */
// ssr: false prevents hydration mismatches from localStorage reads in the
// calculator (autosave, saved costings, language preference, etc.)
const CostixCalculator = dynamic(
  () => import('@/components/CostixCalculator'),
  { ssr: false, loading: () => <LoadingScreen /> }
);

export default function AppPage() {
  return (
    <RevealProvider>
      <CostixCalculator />
    </RevealProvider>
  );
}
