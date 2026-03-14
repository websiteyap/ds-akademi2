import { Metadata } from 'next';
import { getBlogBySlug } from '@/data/blogs';
import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Bulunamadı | DS Akademi',
    };
  }

  return {
    title: `${blog.title} | DS Akademi Blog`,
    description: blog.excerpt,
    openGraph: {
      images: [blog.image],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return <BlogDetailClient blog={blog} />;
}
