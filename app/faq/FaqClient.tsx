'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowRight, MessageSquare } from 'lucide-react';
import { SiteNavbar, SiteFooter } from '@/components/SiteNav';

const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

/* ─── FAQ data — all answers optimized for AEO (direct first sentence) ── */
const FAQ_CATEGORIES = [
  {
    id: 'about',
    label: 'About Costix',
    items: [
      {
        q: 'What is Costix?',
        a: 'Costix is a manufacturing costing workspace built for factory owners and production businesses. You enter your raw material costs, labor rates, electricity, machine depreciation, and overhead — and Costix calculates your exact cost per unit, applies your target margin, and tells you what to charge. It works for any manufactured product, from garments and furniture to food products and electronics.',
      },
      {
        q: 'Who is Costix built for?',
        a: 'Costix is built for small and mid-size manufacturers, factory owners, and production managers who need to price their products accurately. This includes garment factories, furniture makers, food producers, electronics assemblers, cosmetics manufacturers, and anyone who makes physical goods at scale. If you produce things and need to know what they actually cost to make, Costix was built for you.',
      },
      {
        q: 'Is Costix an ERP system?',
        a: 'No. Costix is a focused costing workspace — not an ERP, not accounting software, and not an inventory management platform. It does one thing well: helps you understand exactly what it costs to produce a unit and what to charge for it. If you need purchase orders, payroll, or full inventory tracking, you\'ll want a separate tool for those. Costix is designed to work alongside your existing systems as your dedicated costing layer.',
      },
      {
        q: 'How is Costix different from spreadsheets?',
        a: 'Spreadsheets require you to build your own formulas, maintain them when things break, and manage versions across your team. Costix is purpose-built for manufacturing costing — it handles landed cost calculation, machine depreciation allocation, batch run analysis, multi-currency inputs, and margin calculation out of the box. There\'s no formula maintenance, no version drift, and no shared-file confusion. You focus on your numbers; Costix handles the structure.',
      },
      {
        q: 'Is Costix cloud-based?',
        a: 'Yes. Costix runs entirely in your web browser — no installation or download required. Your saved costings sync to your account so you can access them from any device. Quick Cost calculations are also stored locally in your browser, so your work is preserved even if you haven\'t created an account yet.',
      },
      {
        q: 'Can I use Costix on mobile?',
        a: 'Yes. Costix is fully responsive and optimized for mobile use. The layout stacks cleanly on phones and tablets — inputs are large enough for touch, sections collapse neatly, and the cost summary updates in real time as you type. Whether you\'re on your factory floor or at a client meeting, Costix works on your phone.',
      },
    ],
  },
  {
    id: 'features',
    label: 'Features & Calculations',
    items: [
      {
        q: 'What is cost per unit?',
        a: 'Cost per unit is the total cost of producing one unit of a product. It includes all direct material costs (fabric, components, packaging), direct labor (cutting, sewing, assembly time), and allocated overhead (electricity, machine depreciation, rent per unit). Costix calculates your cost per unit automatically as you fill in each section, so you always see your running total in real time.',
      },
      {
        q: 'How does manufacturing costing work?',
        a: 'Manufacturing costing breaks down every cost involved in producing a product, then totals them to find the cost per unit. You add materials with quantities and unit prices, labor with hours and hourly rates, and overhead like electricity and machine costs. Costix calculates your total production cost, then applies your target profit margin to suggest a selling price that makes your business financially sustainable.',
      },
      {
        q: 'What is landed cost?',
        a: 'Landed cost is the total cost of getting a material into your production facility, including the purchase price, freight charges, import duties, customs clearing fees, and applicable taxes. For manufacturers who import raw materials, landed cost is critical — ignoring import expenses often leads to significant underpricing. Costix has a dedicated imported materials section that calculates landed cost automatically based on the figures you provide.',
      },
      {
        q: 'Can I calculate machine depreciation in Costix?',
        a: 'Yes. Costix includes a machine cost section where you enter your machine\'s purchase price, expected useful life in years or production hours, and ongoing maintenance costs. Costix allocates this cost across your production runs so each unit carries its fair share of the machine investment. This is especially important for businesses using specialized manufacturing equipment.',
      },
      {
        q: 'How do I calculate manufacturing overhead in Costix?',
        a: 'Manufacturing overhead in Costix includes expenses like factory rent, electricity, machine running costs, and general facility costs. You enter the total overhead cost and the production quantity, and Costix divides the overhead across each unit produced. For batch production runs, Costix handles this allocation across your full batch automatically.',
      },
      {
        q: 'Does Costix support batch costing?',
        a: 'Yes. Costix has a dedicated Batch Costing mode designed for production runs. You enter your full run details — materials for the batch, labor hours, machine time, and batch size — and Costix calculates the cost per unit for that run. You can model different batch sizes to see how production volume affects your unit cost, which is essential for quoting wholesale and large orders accurately.',
      },
      {
        q: 'What is what-if analysis in Costix?',
        a: 'What-if analysis lets you model the impact of a change in any input before it happens. If a material supplier raises prices, or if you\'re considering a new labor rate, you can update that single input in Costix and immediately see how it changes your cost per unit, profit margin, and suggested selling price. This helps manufacturers make informed pricing decisions before committing to quotes.',
      },
      {
        q: 'Does Costix support imported raw materials?',
        a: 'Yes. Costix has a dedicated imported materials section that calculates the full landed cost of imported inputs. You enter the purchase price, freight cost, import duty rate, customs clearing fee, and applicable local taxes. Costix totals them to find your real landed cost, which is then used in your per-unit calculation. This ensures your product pricing reflects the true cost of imported materials.',
      },
      {
        q: 'Can restaurants and food businesses use Costix?',
        a: 'Costix is primarily built for manufacturers of physical goods, but food producers, bakeries, and packaged food businesses can use it effectively for recipe-to-product costing and batch production analysis. If you\'re calculating ingredient costs per unit, packaging, and labor for a manufactured food product, Costix handles that workflow well. For restaurant menu costing or hospitality-specific costing, a food-service-specific tool may serve you better.',
      },
    ],
  },
  {
    id: 'exports',
    label: 'Reports & Exports',
    items: [
      {
        q: 'Can I export PDF and Excel reports from Costix?',
        a: 'Yes. Costix generates professional PDF cost sheets and fully functional Excel (XLSX) reports with a single click. The PDF is formatted cleanly for sharing with clients, buyers, or keeping on record. The Excel file includes all your cost inputs and calculated outputs so your finance team or accountant can work with it directly in their own tools.',
      },
      {
        q: 'Can I save previous costings?',
        a: 'Yes. With a Pro or Advanced plan, you can save product costings to your account and access them from any device at any time. Each saved costing stores the complete breakdown — materials, labor, overhead, margin, and pricing. On the Advanced plan, you can duplicate a saved costing as a starting point for a new product, and your team members can access shared costings within the workspace.',
      },
      {
        q: 'Can I track profitability in Costix?',
        a: 'Yes. Costix shows you product-level profitability in real time — cost per unit, profit per unit, and gross margin percentage update as you enter data. You can see the margin impact of every input change immediately. While Costix is not a full accounting tool and doesn\'t replace a P&L across your business, it gives you precise visibility into which products are profitable and by how much.',
      },
    ],
  },
  {
    id: 'plans',
    label: 'Teams, Languages & Plans',
    items: [
      {
        q: 'Can teams collaborate in Costix?',
        a: 'Yes, with the Advanced plan. One Costix account becomes your shared team workspace. Factory managers can create and update costings, accountants can export reports, and supervisors can review pricing — all from the same account, working from the same data. There\'s no file sharing, no syncing between people, and no spreadsheet version confusion. Everyone works from a single, live source of truth.',
      },
      {
        q: 'Does Costix support multiple currencies?',
        a: 'Yes. You can set your workspace currency, and all cost and price outputs are formatted accordingly. The Advanced plan supports multi-currency workspaces, which is useful for businesses that source materials in one currency and sell in another. You can enter material costs in their source currency and set your output pricing in your sales currency.',
      },
      {
        q: 'Does Costix support multiple languages?',
        a: 'Yes. Costix supports English and Roman Urdu in the standard interface, making it accessible to factory owners and production teams across South Asia. The Advanced plan adds support for Arabic, Chinese, Russian, Spanish, Portuguese, and French. Your language preference is saved to your workspace so it\'s ready each time you open Costix.',
      },
      {
        q: 'How does Costix pricing work?',
        a: 'Costix has two plans. The Pro plan is $29 per month (or $24/month billed yearly) — designed for solo manufacturers and small production businesses with up to 5 saved costings and single-user access. The Advanced plan is $59 per month (or $49/month billed yearly) — for operational teams with unlimited saved costings, team workspaces, multi-currency support, and access to all languages. There are no per-user fees and no setup costs. You can cancel anytime from your account settings.',
      },
    ],
  },
] as const;

/* ─── FAQ JSON-LD schema for AEO ─────────────────────────────── */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
};

/* ─── Single accordion item ───────────────────────────────────── */
function AccordionItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-start justify-between py-4 sm:py-4.5 text-left gap-5 group"
      >
        <span className="text-[14.5px] font-semibold text-slate-900 leading-snug group-hover:text-teal-800 transition-colors">
          {q}
        </span>
        <span
          className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mt-0.5 transition-all ${
            open ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white'
          }`}
        >
          {open ? (
            <Minus size={11} className="text-teal-700" />
          ) : (
            <Plus size={11} className="text-slate-500" />
          )}
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-11 text-[14.5px] text-slate-600 leading-[1.78]">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── Category accordion group ───────────────────────────────── */
function AccordionGroup({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  return (
    <div>
      {items.map((item, i) => (
        <AccordionItem
          key={item.q}
          q={item.q}
          a={item.a}
          open={openIdx === i}
          onToggle={() => setOpenIdx(openIdx === i ? null : i)}
        />
      ))}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function FaqClient() {
  const [activeCategory, setActiveCategory] = React.useState('about');

  const currentCat = FAQ_CATEGORIES.find((c) => c.id === activeCategory) ?? FAQ_CATEGORIES[0];

  return (
    <>
      {/* JSON-LD FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-white">
        <SiteNavbar />

        {/* ── Hero ── */}
        <section className="pt-28 pb-10 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-7 lg:px-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700 mb-3">FAQ</p>
            <h1 className="text-[38px] sm:text-[44px] font-bold tracking-[-0.025em] text-slate-900 mb-4 leading-[1.08]">
              Frequently Asked Questions
            </h1>
            <p className="text-[16px] text-slate-500 leading-relaxed max-w-[500px]">
              Everything you need to know about Costix, manufacturing costing, and how to get the
              most out of your costing workspace.
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="max-w-5xl mx-auto px-5 sm:px-7 lg:px-10 py-12 lg:py-16">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Category sidebar */}
            <nav
              aria-label="FAQ categories"
              className="lg:col-span-1 space-y-1"
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 hidden lg:block">
                Categories
              </p>
              <div className="flex lg:flex-col gap-2 flex-wrap">
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-left px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-teal-700 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`ml-2 text-[11px] tabular-nums ${
                        activeCategory === cat.id ? 'text-teal-200' : 'text-slate-400'
                      }`}
                    >
                      {cat.items.length}
                    </span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Questions */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
                    {currentCat.label}
                  </h2>
                  <p className="text-[13px] text-slate-400 mt-0.5">
                    {currentCat.items.length} questions
                  </p>
                </div>
                <div className="px-6">
                  <AccordionGroup items={currentCat.items} />
                </div>
              </div>

              {/* All questions indicator */}
              <p className="mt-4 text-[13px] text-slate-400 text-center">
                {FAQ_CATEGORIES.flatMap((c) => c.items).length} questions total ·{' '}
                {FAQ_CATEGORIES.length} categories
              </p>
            </div>
          </div>
        </div>

        {/* ── Still have questions ── */}
        <section className="py-14 bg-[#FAFBFC] border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-7 lg:px-10">
            <div className="grid sm:grid-cols-2 gap-5">

              <div
                className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                  <MessageSquare size={18} className="text-teal-700" />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2 tracking-tight">
                  Still have questions?
                </h3>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-5">
                  We're happy to answer anything about manufacturing costing, how Costix works,
                  or whether it's the right fit for your production setup.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                >
                  Contact us <ArrowRight size={14} />
                </Link>
              </div>

              <div
                className="rounded-2xl p-6 sm:p-7 text-white"
                style={{
                  background: 'linear-gradient(135deg, #0F766E 0%, #10B981 100%)',
                  boxShadow: '0 4px 20px rgba(15,118,110,0.25)',
                }}
              >
                <h3 className="text-[16px] font-bold mb-2 tracking-tight">
                  See it for yourself.
                </h3>
                <p className="text-[14px] text-white/80 leading-relaxed mb-5">
                  The fastest way to understand Costix is to open the calculator and cost your
                  first product. No account required to get started.
                </p>
                <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }} transition={SPRING_UI} className="inline-block">
                  <Link
                    href="/app"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-[9px] bg-white text-teal-800 text-[13px] font-semibold"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
                  >
                    Open Calculator <ArrowRight size={13} />
                  </Link>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
