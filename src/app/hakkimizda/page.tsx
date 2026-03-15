import type { Metadata } from 'next';
import { getAboutSections, getSiteSettings } from '@/lib/api';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Hakkımızda | DS Akademi',
  description: "DS Akademi, Türkiye'nin önde gelen akademisyenleriyle yapısal mühendislik alanında performansa dayalı tasarım eğitimleri sunar.",
};

export default async function AboutPage() {
  const [sections, settings] = await Promise.all([
    getAboutSections(),
    getSiteSettings(),
  ]);
  return <AboutClient sections={sections} settings={settings} />;
}
