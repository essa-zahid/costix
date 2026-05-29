import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { SiteNavbar, SiteFooter, GradDivider } from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Terms of Use — Costix Manufacturing Costing Software',
  description:
    'Costix terms of use — fair, plain-language terms for manufacturers using our production costing workspace.',
  alternates: { canonical: 'https://costix.io/terms' },
  openGraph: {
    title: 'Terms of Use — Costix',
    description: 'Simple, fair terms for manufacturers using Costix.',
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
  variant = 'slate',
}: {
  title?: string;
  children: React.ReactNode;
  variant?: 'teal' | 'slate' | 'amber';
}) {
  const styles: Record<string, string> = {
    teal:  'bg-teal-50/60 border-teal-100 text-teal-900',
    slate: 'bg-slate-50 border-slate-200/80 text-slate-700',
    amber: 'bg-amber-50/60 border-amber-100 text-amber-900',
  };
  return (
    <div className={`rounded-2xl border p-5 ${styles[variant]}`}>
      {title && <p className="font-semibold mb-2 text-[14.5px]">{title}</p>}
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
export default function TermsPage() {
  const TOC = [
    { href: '#what-costix-is',       label: 'What Costix Is'                  },
    { href: '#your-account',         label: 'Your Account'                    },
    { href: '#acceptable-use',       label: 'Acceptable Use'                  },
    { href: '#subscriptions',        label: 'Subscriptions & Billing'         },
    { href: '#cancellation',         label: 'Cancellation'                    },
    { href: '#exports-ip',           label: 'Exports & Intellectual Property' },
    { href: '#disclaimer',           label: 'Calculation Disclaimer'          },
    { href: '#liability',            label: 'Limitation of Liability'         },
    { href: '#changes',              label: 'Changes to These Terms'          },
    { href: '#contact',              label: 'Contact'                         },
  ];

  return (
    <main className="min-h-screen bg-white">
      <SiteNavbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-10 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-7">
          <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700 mb-3">Legal</p>
          <h1 className="text-[38px] sm:text-[44px] font-bold tracking-[-0.025em] text-slate-900 mb-4 leading-[1.08]">
            Terms of Use
          </h1>
          <p className="text-[16px] text-slate-500 leading-relaxed max-w-[500px]">
            Simple, fair terms for real manufacturing businesses. We've kept the legal language
            minimal so you can actually understand what you're agreeing to.
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

          <Section id="what-costix-is" number="01" title="What Costix Is">
            <p>
              Costix is a manufacturing costing workspace — a focused tool that helps factory owners,
              production managers, and manufacturers calculate accurate cost per unit, set pricing
              margins, and understand the full cost of producing a product.
            </p>
            <p>
              Costix is not an ERP system, accounting software, inventory management platform,
              or legal/financial advisory service. It is a calculation workspace, and calculations
              should be verified before use in business decisions.
            </p>
            <p>
              By using Costix, you agree to these Terms of Use. These terms apply to all users of
              Costix, including free trial users, Pro subscribers, and Advanced subscribers.
            </p>
          </Section>

          <Section id="your-account" number="02" title="Your Account">
            <p>
              To access saved costings, team workspaces, and plan features, you need a Costix
              account. You're responsible for maintaining the security of your account password
              and for all activity that occurs under your account.
            </p>
            <p>
              One account corresponds to one workspace. On the Advanced plan, your workspace
              can be shared with team members. You are responsible for ensuring that anyone
              you add to your workspace complies with these Terms of Use.
            </p>
            <p>
              You must provide accurate information when creating your account. Impersonating
              another person, business, or organization is not permitted.
            </p>
          </Section>

          <Section id="acceptable-use" number="03" title="Acceptable Use">
            <p>You may use Costix for any legitimate manufacturing, production costing, or
            business pricing purpose. You may not:</p>
            <Bullets
              items={[
                'Use Costix for unlawful purposes or to facilitate illegal activity',
                'Reverse engineer, decompile, or attempt to extract Costix\'s source code',
                'Use automated bots, scrapers, or scripts to access the service without permission',
                'Attempt to gain unauthorized access to other users\' accounts or data',
                'Upload malicious code, files, or content of any kind',
                'Resell or sublicense access to Costix without written permission',
                'Use Costix to infringe on the intellectual property rights of third parties',
              ]}
            />
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms
              without prior notice.
            </p>
          </Section>

          <Section id="subscriptions" number="04" title="Subscriptions & Billing">
            <p>
              Costix offers paid plans that unlock additional features beyond the free workspace.
              Current plan pricing is listed on the{' '}
              <a href="/#pricing" className="text-teal-700 hover:underline font-medium">
                pricing page
              </a>
              . All prices are in US dollars unless stated otherwise.
            </p>
            <p>
              Subscriptions renew automatically at the end of each billing period (monthly or yearly,
              depending on the plan you chose). You will be charged using the payment method on file.
              We send a billing reminder before your renewal date.
            </p>
            <p>
              All payments are processed by Stripe. Costix does not store your payment card
              details. Billing receipts are sent to your account email address.
            </p>
            <Callout variant="slate" title="Taxes">
              Prices displayed may not include applicable taxes (VAT, GST, sales tax). Taxes are
              calculated and added at checkout based on your billing location.
            </Callout>
          </Section>

          <Section id="cancellation" number="05" title="Cancellation">
            <p>
              You can cancel your subscription at any time from your account settings.
              Cancellation takes effect at the end of your current billing period — you retain
              full access to your plan features until then.
            </p>
            <p>
              We do not offer partial-month refunds for monthly plans. For yearly plans, if
              you cancel within 14 days of your renewal date and have not exported data or used
              the service beyond basic access during that period, contact us at{' '}
              <a href="mailto:hello@costix.io" className="text-teal-700 hover:underline font-medium">
                hello@costix.io
              </a>{' '}
              and we'll review your situation.
            </p>
            <p>
              After cancellation, your saved costings remain accessible in read-only mode for 90 days.
              After that period, they are permanently deleted. We recommend exporting your costings
              before cancelling.
            </p>
          </Section>

          <Section id="exports-ip" number="06" title="Exports & Intellectual Property">
            <p>
              <strong className="font-semibold text-slate-800">Your costing data is yours.</strong>{' '}
              The product costings, cost inputs, and pricing data you create in Costix are your
              intellectual property. You can export them at any time as PDF or Excel files.
              We make no claim over your business data.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">Costix's intellectual property.</strong>{' '}
              The Costix platform, software, interface, branding, calculation logic, and all related
              technology are the intellectual property of Costix and its creators. You may not copy,
              reproduce, or use Costix's branding or software outside of normal use of the product.
            </p>
          </Section>

          <Section id="disclaimer" number="07" title="Calculation Disclaimer">
            <Callout variant="amber" title="Important: Verify before you act.">
              Costix assists with manufacturing cost calculations, but users remain responsible
              for verifying pricing, taxes, duties, and financial decisions before operational
              use. Costix-generated calculations are based solely on the data you provide.
              Errors in your inputs produce errors in your outputs. Always cross-check important
              pricing decisions with a qualified accountant or financial adviser.
            </Callout>
            <p>
              Costix is a calculation workspace, not a licensed financial, accounting, legal, or
              tax advisory service. Nothing in the Costix platform constitutes professional
              financial advice. Import duties, VAT rates, currency exchange rates, and local
              tax regulations change frequently — Costix does not automatically update these figures.
              You are responsible for entering accurate, current data.
            </p>
            <p>
              Costix is provided "as is." We strive to keep it accurate and reliable, but we make
              no warranties, express or implied, about the correctness or completeness of any
              calculation result.
            </p>
          </Section>

          <Section id="liability" number="08" title="Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Costix and its creators will not be liable
              for any indirect, incidental, special, or consequential damages — including lost
              profits, lost production value, or business decisions made based on Costix
              calculations — arising from your use of the service.
            </p>
            <p>
              Our maximum liability to you for any claim arising from your use of Costix is limited
              to the amount you paid to Costix in the 12 months prior to the claim.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion of certain warranties or limitation of
              liability. Where applicable local law requires it, these exclusions may not apply to you.
            </p>
          </Section>

          <Section id="changes" number="09" title="Changes to These Terms">
            <p>
              We may update these terms from time to time. If we make material changes, we'll
              notify you by email at least 14 days before they take effect. Continued use of
              Costix after the effective date of updated terms constitutes your acceptance of
              the new terms.
            </p>
            <p>
              If you disagree with updated terms, you may cancel your subscription before the
              effective date and we'll handle your data according to our cancellation policy above.
            </p>
          </Section>

          <Section id="contact" number="10" title="Contact">
            <p>
              Questions about these terms? We're happy to clarify.
            </p>
            <Callout variant="slate" title="Reach us at">
              <p>
                Email:{' '}
                <a href="mailto:hello@costix.io" className="text-teal-700 hover:underline font-medium">
                  hello@costix.io
                </a>
              </p>
              <p className="mt-1.5">
                Or use our{' '}
                <Link href="/contact" className="text-teal-700 hover:underline font-medium">
                  contact page
                </Link>
                .
              </p>
              <p className="mt-2 text-[13px] text-slate-500">We typically respond within 1 business day.</p>
            </Callout>
          </Section>

        </div>
      </div>

      <GradDivider />
      <SiteFooter />
    </main>
  );
}
