import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Costix — Manufacturing Costing Software Support',
  description:
    'Get in touch with the Costix team. Support for manufacturing costing questions, billing, and business inquiries. We respond within one business day.',
  alternates: { canonical: 'https://costix.io/contact' },
  openGraph: {
    title: 'Contact Costix',
    description: 'Get support for your manufacturing costing workspace.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
