import { Metadata } from 'next';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | DS Akademi',
  description: 'DS Akademi yapısal tasarım eğitimleri, ödeme seçenekleri, sertifika süreçleri ve platform hakkında sıkça sorulan soruların yanıtları.',
  keywords: 'sıkça sorulan sorular, sss, inşaat mühendisliği kursu sss, ds akademi sss, online eğitim soruları',
};

export default function FaqPage() {
  return <FaqClient />;
}
