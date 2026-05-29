import type { Metadata } from 'next';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'FAQ — Costix Manufacturing Costing Software',
  description:
    'Answers to common questions about Costix: what is cost per unit, how does batch costing work, what is landed cost, how to calculate manufacturing overhead, and more.',
  alternates: { canonical: 'https://costix.io/faq' },
  openGraph: {
    title: 'FAQ — Costix Manufacturing Costing Software',
    description:
      'Everything you need to know about Costix manufacturing costing software — cost per unit, batch costing, landed cost, exports, and team workspaces.',
    type: 'website',
  },
  keywords: [
    'manufacturing costing software FAQ',
    'cost per unit calculator',
    'what is landed cost',
    'batch costing software',
    'factory costing calculator',
    'production cost calculator',
    'manufacturing overhead calculation',
    'costing workspace for manufacturers',
    'product costing tool',
  ],
};

export default function FaqPage() {
  return <FaqClient />;
}
