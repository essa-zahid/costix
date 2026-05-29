# Costix

**Manufacturing costing software for factories, workshops, and production teams.**

Costix is a fast, offline-capable costing tool that helps manufacturers calculate the true cost of what they make — covering materials, labor, electricity, rent, machines, and packaging — across both single-product and batch production runs.

---

## Features

- **Quick Cost** — cost per unit, margin, and profit in real time with full breakdown across materials, labor, electricity, rent, machinery, and packaging
- **Batch Costing** — wizard-driven batch run costing across 8 cost categories with per-unit summary
- **Landed Cost** — imported materials with recoverable/non-recoverable tax handling
- **Rent Allocation** — smart factory/warehouse/office space allocation with hard validation (never allows >100% allocation)
- **Machine Depreciation** — time-based and unit-based machine costing
- **Saved Costings** — save, reopen, and duplicate any costing as a new record
- **PDF & Excel Export** — branded exports with full cost breakdown
- **Multi-currency** — live currency switching with confirmation guard when data exists
- **Bilingual** — English + Roman Urdu interface
- **Mobile-first** — fully responsive across phones, tablets, and desktops
- **Offline-ready** — all calculations run in the browser with localStorage persistence

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript + JSX |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| PDF Export | [jsPDF](https://github.com/parallax/jsPDF) + html2canvas |
| Excel Export | [SheetJS (xlsx)](https://sheetjs.com/) |
| State | React hooks + `localStorage` persistence |
| Deployment | [Vercel](https://vercel.com/) |

---

## Local Development

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/essa-zahid/costix.git
cd costix

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Build

```bash
npm run build
npm run start
```

---

## Deploy to Vercel

1. Push to GitHub (already done)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the `essa-zahid/costix` repository
4. Vercel auto-detects Next.js — no configuration needed
5. Click **Deploy**

No environment variables are required for the base deployment.

---

## Project Structure

```
costix/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Landing page
│   ├── app/page.tsx          # Calculator workspace
│   ├── faq/                  # FAQ page (AEO-optimized)
│   ├── contact/              # Contact page
│   ├── privacy/              # Privacy policy
│   └── terms/                # Terms of use
├── components/
│   ├── CostixCalculator.jsx  # Full calculator (Quick Cost + Batch + Saved)
│   └── SiteNav.tsx           # Shared navbar and footer
├── public/                   # Static assets
└── ...config files
```

---

## Roadmap

- [ ] Monthly overhead costing mode
- [ ] Team workspaces (multi-user)
- [ ] Cloud sync for saved costings
- [ ] Arabic UI support
- [ ] API for programmatic costing

---

## License

Private. All rights reserved — Accountibles, 2025.
