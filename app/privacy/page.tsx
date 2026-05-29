import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { SiteNavbar, SiteFooter, GradDivider } from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Privacy Policy — Costix Manufacturing Costing Software',
  description:
    'Costix privacy policy — how we collect, use, and protect your manufacturing costing data. Simple, clear, and honest.',
  alternates: { canonical: 'https://costix.io/privacy' },
  openGraph: {
    title: 'Privacy Policy — Costix',
    description: 'How we handle your manufacturing costing data.',
    type: 'website',
  },
};

/* ─── Section component ───────────────────────────────────────── */
function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-[11px] font-bold text-teal-600 tabular-nums">{number}</span>
        <h2
          id={`${id}-heading`}
          className="text-[20px] font-bold text-slate-900 tracking-tight"
        >
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-[15px] text-slate-600 leading-[1.78]">{children}</div>
    </section>
  );
}

/* ─── Callout box ─────────────────────────────────────────────── */
function Callout({
  title,
  children,
  variant = 'teal',
}: {
  title?: string;
  children: React.ReactNode;
  variant?: 'teal' | 'slate';
}) {
  const styles =
    variant === 'teal'
      ? 'bg-teal-50/60 border-teal-100 text-teal-900'
      : 'bg-slate-50 border-slate-200/80 text-slate-700';
  return (
    <div className={`rounded-2xl border p-5 ${styles}`}>
      {title && <p className="font-semibold mb-1.5 text-[14.5px]">{title}</p>}
      <div className="text-[14px] leading-[1.7]">{children}</div>
    </div>
  );
}

/* ─── Bullet list ─────────────────────────────────────────────── */
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-[9px] w-1 h-1 rounded-full bg-teal-500 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function PrivacyPage() {
  const TOC = [
    { href: '#what-we-collect',  label: 'Information We Collect'     },
    { href: '#how-we-use',       label: 'How We Use Your Information' },
    { href: '#saved-costings',   label: 'Saved Product Costings'      },
    { href: '#browser-storage',  label: 'Browser Storage & Cookies'   },
    { href: '#security',         label: 'Data Security'               },
    { href: '#third-parties',    label: 'Third-Party Services'        },
    { href: '#your-rights',      label: 'Your Rights'                 },
    { href: '#contact',          label: 'Contact Us'                  },
  ];

  return (
    <main className="min-h-screen bg-white">
      <SiteNavbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-10 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-7">
          <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700 mb-3">Legal</p>
          <h1 className="text-[38px] sm:text-[44px] font-bold tracking-[-0.025em] text-slate-900 mb-4 leading-[1.08]">
            Privacy Policy
          </h1>
          <p className="text-[16px] text-slate-500 leading-relaxed max-w-[500px]">
            We keep it simple: your costing data is yours. Here's exactly what we collect,
            why we collect it, and how we protect it.
          </p>
          <p className="mt-5 text-[13px] text-slate-400">
            Effective date: May 28, 2026 · Last updated: May 28, 2026
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-7 py-14 lg:py-16">

        {/* Table of contents */}
        <nav aria-label="Page sections" className="mb-12 rounded-2xl bg-slate-50 border border-slate-200/80 p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">On this page</p>
          <ol className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
            {TOC.map(({ href, label }, i) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-[13.5px] text-teal-700 hover:text-teal-900 transition-colors font-medium"
                >
                  {i + 1}. {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14">

          <Section id="what-we-collect" number="01" title="Information We Collect">
            <p>
              Costix collects only what's necessary to run your manufacturing costing workspace.
              Here's a plain breakdown of what that includes.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">Account information.</strong>{' '}
              When you create an account, we collect your name, email address, and password (stored
              as a secure hash — we never see your actual password).
            </p>
            <p>
              <strong className="font-semibold text-slate-800">Saved product costings.</strong>{' '}
              If you save costings to your account (available on Pro and Advanced plans), we store
              the data you enter — product names, material costs, labor rates, overhead, and pricing
              outputs. This data is tied to your account and visible only to you or your team
              workspace members on the Advanced plan.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">Browser and device data.</strong>{' '}
              We collect basic technical information — browser type, operating system, and device
              category — to ensure Costix works correctly across all devices.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">Usage data.</strong>{' '}
              We collect anonymous, aggregated information about how features are used. This data
              cannot identify you personally and is used only to improve the product.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">Payment information.</strong>{' '}
              We do not store your payment card details. All billing is handled by Stripe, a
              PCI-compliant payment processor. We receive only a confirmation that a payment
              succeeded and basic billing metadata (plan type, renewal date).
            </p>
          </Section>

          <Section id="how-we-use" number="02" title="How We Use Your Information">
            <p>
              We use your information to run your costing workspace reliably and make it better
              over time. Here's exactly what that means:
            </p>
            <Bullets
              items={[
                'To create and maintain your account',
                'To save and restore your product costings and workspace preferences',
                'To process subscription payments and send billing receipts',
                'To provide customer support when you reach out',
                'To send important account notifications — security alerts, plan changes, and billing reminders',
                'To understand which features are most useful and where to focus improvements',
                'To maintain uptime, detect errors, and fix problems before they affect you',
              ]}
            />
            <Callout variant="teal" title="What we don't do with your data">
              We do not sell your data to third parties. We do not use your costing data for
              advertising. We do not share your product costs, margins, or business inputs with
              anyone outside of Costix operations.
            </Callout>
          </Section>

          <Section id="saved-costings" number="03" title="Saved Product Costings">
            <Callout variant="teal" title="Your costings belong to you.">
              Product names, material costs, labor rates, margins, and pricing outputs you enter
              into Costix are your business data. We use this data only to run your workspace —
              nothing else.
            </Callout>
            <p>
              When you save a product costing, it's stored in your account database, protected by
              your login credentials and encrypted at rest. On the Advanced plan, saved costings
              are visible to all members of your team workspace — be mindful of who you add.
            </p>
            <p>
              If you delete a costing, it's removed from our active database immediately.
              Deleted data may persist in encrypted backups for up to 30 days before being
              fully purged.
            </p>
            <p>
              Quick Cost calculations that are not explicitly saved remain only in your browser's
              local storage. They are not sent to our servers unless you choose to save them.
            </p>
          </Section>

          <Section id="browser-storage" number="04" title="Browser Storage & Cookies">
            <p>
              Costix uses your browser's local storage to provide a smooth, persistent experience —
              even without an account. This includes remembering your selected tab, currency
              preference, language setting, and any in-progress Quick Cost calculation.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">What we store locally:</strong>{' '}
              your selected tab (Quick Cost, Batch, Saved), currency display, language preference,
              and the current state of your Quick Cost session. This data lives on your device only
              and is never uploaded to our servers unless you explicitly save a costing.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">Cookies.</strong>{' '}
              We use session cookies strictly for authentication — keeping you logged in between
              sessions. We do not use third-party advertising cookies. We do not track you across
              other websites.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">Analytics.</strong>{' '}
              We use a privacy-respecting analytics tool that does not use cookies and does not
              collect personally identifiable information. We only see aggregate numbers like
              page views and feature usage rates — never individual behavior tied to you.
            </p>
          </Section>

          <Section id="security" number="05" title="Data Security">
            <p>
              All data transmitted between your browser and Costix is encrypted using HTTPS/TLS.
              Your account password is stored as a salted cryptographic hash — it's never stored
              or accessible in plain text.
            </p>
            <p>
              Access to user data within Costix is strictly limited to authorized team members
              who need it to operate and support the platform. We do not grant external parties
              access to user data without a legal obligation to do so.
            </p>
            <Callout variant="slate" title="Security incident notification">
              If we discover a breach that affects your account data, we will notify you by email
              within 72 hours of the confirmed incident.
            </Callout>
          </Section>

          <Section id="third-parties" number="06" title="Third-Party Services">
            <p>
              Costix works with a small number of trusted providers to operate. We only share the
              minimum information each service needs to function.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Stripe',    role: 'Payment processing and subscription billing' },
                { name: 'Hosting',   role: 'Cloud infrastructure, database, and file storage' },
                { name: 'Analytics', role: 'Privacy-first, cookie-free usage analytics' },
                { name: 'Email',     role: 'Transactional account and billing emails' },
              ].map(({ name, role }) => (
                <div key={name} className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                  <p className="text-[13px] font-semibold text-slate-900">{name}</p>
                  <p className="text-[12.5px] text-slate-500 mt-0.5">{role}</p>
                </div>
              ))}
            </div>
            <p>
              Each provider operates under their own privacy policies and data processing agreements.
              We review these agreements before onboarding any new provider.
            </p>
          </Section>

          <Section id="your-rights" number="07" title="Your Rights">
            <p>You have the right to:</p>
            <Bullets
              items={[
                'Access a copy of the personal data we hold about you',
                'Correct inaccurate information in your account profile',
                'Delete your account and all associated data',
                'Export your saved product costings at any time as PDF or Excel',
                'Withdraw consent for marketing emails at any time (transactional account emails are always sent)',
              ]}
            />
            <p>
              To exercise any of these rights, email us at{' '}
              <a href="mailto:hello@costix.io" className="text-teal-700 hover:underline font-medium">
                hello@costix.io
              </a>
              . We'll respond within 5 business days.
            </p>
          </Section>

          <Section id="contact" number="08" title="Contact Us">
            <p>
              If you have questions about this Privacy Policy or how we handle your manufacturing
              costing data, we're happy to talk.
            </p>
            <Callout variant="slate" title="Privacy questions">
              <p>
                Email us at{' '}
                <a href="mailto:hello@costix.io" className="text-teal-700 hover:underline font-medium">
                  hello@costix.io
                </a>{' '}
                or use our{' '}
                <Link href="/contact" className="text-teal-700 hover:underline font-medium">
                  contact page
                </Link>
                .
              </p>
              <p className="mt-2 text-[13px] text-slate-500">
                We typically respond within 1 business day.
              </p>
            </Callout>
          </Section>

        </div>
      </div>

      <GradDivider />
      <SiteFooter />
    </main>
  );
}
