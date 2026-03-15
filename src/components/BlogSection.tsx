"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Tag, BookOpen } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "TBDY 2018 Güncellemeleri: Yapısal Tasarımda Neler Değişti?",
    excerpt: "Türkiye Bina Deprem Yönetmeliği'nin son güncellemelerini ve mühendislik pratiğine etkilerini detaylı inceliyoruz.",
    category: "Yönetmelik",
    readTime: "8 dk",
    date: "28 Şubat 2026",
    image: "/DS-201-DEPREME-DAYANIKLI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    slug: "tbdy-2018-guncellemeleri",
  },
  {
    id: 2,
    title: "Çelik Yapılarda Performans Bazlı Tasarım Yaklaşımları",
    excerpt: "Modern çelik yapı tasarımında performans hedeflerinin belirlenmesi ve analiz yöntemleri hakkında kapsamlı bir inceleme.",
    category: "Çelik Yapı",
    readTime: "6 dk",
    date: "22 Şubat 2026",
    image: "/DS-301-PERFORMANSA-DAYALI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    slug: "celik-yapilarda-performans-bazli-tasarim",
  },
  {
    id: 3,
    title: "BIM Teknolojisinin Yapı Sektöründeki Geleceği",
    excerpt: "Yapı Bilgi Modellemesi'nin sürdürülebilir inşaat ve proje yönetimine katkıları ve sektördeki dönüşümü.",
    category: "BIM & Teknoloji",
    readTime: "5 dk",
    date: "15 Şubat 2026",
    image: "/DS-501-BİNA-BİLGİ-MODELLEME-(BIM)-TEORİK-VE-UYGULAMA-EĞİTİMİ.jpg",
    slug: "bim-teknolojisinin-gelecegi",
  },
];

export default function BlogSection() {
  return (
    <section className="blog-section">
      <div className="container">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[3px] uppercase text-[var(--accent-color)]">
              <BookOpen size={14} />
              TEKNİK KÜTÜPHANE
            </span>
            <h2 className="blog-heading">Makale &amp; Kaynaklar</h2>
          </div>
          <Link href="/blog" className="hero-slider-view-all shrink-0">
            Tümünü Gör <ArrowRight size={16} />
          </Link>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="blog-card-new group"
              style={{ textDecoration: 'none' }}
            >
              {/* Image */}
              <div className="blog-card-new-img">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="blog-img"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="blog-card-new-body">
                <span className="blog-card-cat">
                  <Tag size={11} /> {article.category}
                </span>
                <h3 className="blog-card-new-title">{article.title}</h3>
                <p className="blog-card-excerpt">{article.excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-date">{article.date}</span>
                  <span className="blog-dot">·</span>
                  <span className="blog-read"><Clock size={12} /> {article.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
