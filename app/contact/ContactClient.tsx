'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { SiteNavbar, SiteFooter } from '@/components/SiteNav';

const SPRING_UI = { type: 'spring', stiffness: 400, damping: 34 } as const;

const SUBJECTS = [
  { value: 'support',   label: 'Technical support'          },
  { value: 'billing',   label: 'Billing or subscription'    },
  { value: 'feature',   label: 'Feature question'           },
  { value: 'business',  label: 'Business or enterprise inquiry' },
  { value: 'other',     label: 'Something else'             },
];

export default function ContactClient() {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    subject: 'support',
    message: '',
  });
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission (wire to backend/email service as needed)
    setTimeout(() => {
      setSent(true);
      setSubmitting(false);
    }, 900);
  };

  const fieldClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-colors';

  return (
    <main className="min-h-screen bg-white">
      <SiteNavbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-10 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-7 lg:px-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700 mb-3">Contact</p>
          <h1 className="text-[38px] sm:text-[44px] font-bold tracking-[-0.025em] text-slate-900 mb-4 leading-[1.08]">
            We're here to help.
          </h1>
          <p className="text-[16px] text-slate-500 leading-relaxed max-w-[480px]">
            Whether you have a question about a calculation, your plan, or how Costix fits
            your factory — reach out and we'll get back to you fast.
          </p>
        </div>
      </section>

      {/* ── Two-column layout ── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-7 lg:px-10 py-14 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">

          {/* Left — info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Support info */}
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 mb-5 tracking-tight">
                Get in touch
              </h2>
              <div className="space-y-4">

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={16} className="text-teal-700" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900 mb-0.5">Email us directly</p>
                    <a
                      href="mailto:hello@costix.io"
                      className="text-[13.5px] text-teal-700 hover:underline font-medium"
                    >
                      hello@costix.io
                    </a>
                    <p className="text-[12.5px] text-slate-400 mt-0.5">For all inquiries</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={16} className="text-teal-700" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900 mb-0.5">Response time</p>
                    <p className="text-[13.5px] text-slate-600">Within 1 business day</p>
                    <p className="text-[12.5px] text-slate-400 mt-0.5">Monday–Friday</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare size={16} className="text-teal-700" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900 mb-0.5">What to include</p>
                    <p className="text-[13px] text-slate-500 leading-snug">
                      For technical questions, let us know your product type, the cost inputs
                      you're working with, and what you're trying to calculate.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-slate-100" />

            {/* FAQ shortcut */}
            <div>
              <p className="text-[13px] font-semibold text-slate-700 mb-3">
                Looking for quick answers?
              </p>
              <Link
                href="/faq"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 hover:bg-teal-50/40 hover:border-teal-200 transition-colors"
              >
                <span className="text-[13.5px] font-medium text-slate-700 group-hover:text-teal-800 transition-colors">
                  Browse the FAQ
                </span>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
              </Link>
              <Link
                href="/app"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 mt-2.5 hover:bg-teal-50/40 hover:border-teal-200 transition-colors"
              >
                <span className="text-[13.5px] font-medium text-slate-700 group-hover:text-teal-800 transition-colors">
                  Try the calculator now
                </span>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
              </Link>
            </div>

          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            {sent ? (
              /* Success state */
              <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-8 sm:p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={22} className="text-teal-700" />
                </div>
                <h2 className="text-[20px] font-bold text-slate-900 mb-2 tracking-tight">
                  Message received.
                </h2>
                <p className="text-[15px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                  We'll get back to you at <strong className="text-slate-700">{form.email}</strong> within
                  one business day.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: 'support', message: '' }); }}
                  className="mt-7 text-[13px] text-teal-700 hover:underline font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* Contact form */
              <form
                onSubmit={handleSubmit}
                aria-label="Contact form"
                className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
              >
                <h2 className="text-[17px] font-bold text-slate-900 mb-6 tracking-tight">
                  Send a message
                </h2>

                <div className="space-y-4">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-[12.5px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wider"
                      >
                        Your name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Ahmed Khan"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-[12.5px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wider"
                      >
                        Email address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@yourfactory.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-[12.5px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wider"
                    >
                      What's this about?
                    </label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`${fieldClass} cursor-pointer`}
                    >
                      {SUBJECTS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[12.5px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wider"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Tell us what you're working on or what you need help with..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.975 }}
                    transition={SPRING_UI}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-white text-[14px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #0F766E)',
                      boxShadow: '0 2px 8px rgba(15,118,110,0.28)',
                    }}
                  >
                    {submitting ? 'Sending…' : (<>Send Message <ArrowRight size={15} /></>)}
                  </motion.button>

                  <p className="text-[12px] text-slate-400 text-center">
                    We respond within one business day. No spam, no CRM drip sequences.
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
