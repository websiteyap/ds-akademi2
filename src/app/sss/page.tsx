import { Metadata } from 'next';
import { getFaqCategories } from '@/lib/api';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | DS Akademi',
  description: 'DS Akademi yapısal tasarım eğitimleri, ödeme seçenekleri, sertifika süreçleri ve platform hakkında sıkça sorulan soruların yanıtları.',
};

export default async function FaqPage() {
  const faqCategories = await getFaqCategories();
  return <FaqClient faqCategories={faqCategories} />;
}
