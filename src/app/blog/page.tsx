import { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog | DS Akademi',
  description: 'Yapısal mühendislik, güncel yönetmelikler, kariyer tavsiyeleri ve sektördeki son gelişmeler hakkında uzman akademisyenlerimizden blog yazıları.',
  keywords: 'inşaat mühendisliği blog, yapısal tasarım makaleleri, tbdy 2018, ds akademi blog, deprem mühendisliği yazıları',
};

export default function BlogPage() {
  return <BlogClient />;
}
