import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/api';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'İletişim | DS Akademi',
  description: 'DS Akademi ile iletişime geçin. Sorularınız, önerileriniz ve kurumsal eğitim talepleriniz için bize ulaşın.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactClient settings={settings} />;
}
