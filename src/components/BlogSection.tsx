"use client";

import React from 'react';
import Image from 'next/image';
import { Clock, ArrowRight, Tag, BookOpen } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "TBDY 2018 Güncellemeleri: Yapısal Tasarımda Neler Değişti?",
    excerpt: "Türkiye Bina Deprem Yönetmeliği'nin son güncellemelerini ve mühendislik pratiğine etkilerini detaylı inceliyoruz.",
    category: "Yönetmelik",
    readTime: "8 dk",
    date: "28 Şubat 2026",
    featured: true,
    image: "/DS-201-DEPREME-DAYANIKLI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
  },
  {
    id: 2,
    title: "Çelik Yapılarda Performans Bazlı Tasarım Yaklaşımları",
    excerpt: "Modern çelik yapı tasarımında performans hedeflerinin belirlenmesi ve analiz yöntemleri.",
    category: "Çelik Yapı",
    readTime: "6 dk",
    date: "22 Şubat 2026",
    featured: false,
    image: "/DS-301-PERFORMANSA-DAYALI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
  },
  {
    id: 3,
    title: "BIM Teknolojisinin Yapı Sektöründeki Geleceği",
    excerpt: "Yapı Bilgi Modellemesi'nin sürdürülebilir inşaat ve proje yönetimine katkıları.",
    category: "BIM & Teknoloji",
    readTime: "5 dk",
    date: "15 Şubat 2026",
    featured: false,
    image: "/DS-501-BİNA-BİLGİ-MODELLEME-(BIM)-TEORİK-VE-UYGULAMA-EĞİTİMİ.jpg",
  },
  {
    id: 4,
    title: "Mevcut Betonarme Yapıların Değerlendirilmesinde Güncel Yöntemler",
    excerpt: "Deprem performansı değerlendirmesi için kullanılan modern analiz teknikleri.",
    category: "Betonarme",
    readTime: "7 dk",
    date: "8 Şubat 2026",
    featured: false,
    image: "/DS-302-MEVCUT-BETONARME-YAPILARIN-DEĞERLENDİRİLMESİ-VE-PERFORMANS-ANALİZİ-EĞİTİMİ.jpg",
  },
];

export default function BlogSection() {
  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => !a.featured);

  return (
    <section className="blog-section">
      <div className="container">
        {/* Header */}
        <div className="blog-top-row">
          <div className="blog-left">
            <span className="blog-badge">
              <BookOpen size={14} />
              TEKNİK KÜTÜPHANE
            </span>
            <h2 className="blog-heading">Makale & Kaynaklar</h2>
          </div>
          <button className="blog-view-all">
            Tümünü Gör <ArrowRight size={16} />
          </button>
        </div>

        {/* Content Grid */}
        <div className="blog-grid">
          {/* Featured Article */}
          <article className="blog-featured">
            <div className="blog-featured-img">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="blog-img"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <div className="blog-featured-overlay" />
              <span className="blog-cat-badge">{featured.category}</span>
            </div>
            <div className="blog-featured-content">
              <h3 className="blog-featured-title">{featured.title}</h3>
              <p className="blog-featured-excerpt">{featured.excerpt}</p>
              <div className="blog-meta">
                <span className="blog-date">{featured.date}</span>
                <span className="blog-dot">·</span>
                <span className="blog-read"><Clock size={13} /> {featured.readTime}</span>
              </div>
            </div>
          </article>

          {/* Side Articles */}
          <div className="blog-side">
            {rest.map((article) => (
              <article key={article.id} className="blog-card">
                <div className="blog-card-img">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="blog-img"
                    sizes="160px"
                  />
                </div>
                <div className="blog-card-content">
                  <span className="blog-card-cat">
                    <Tag size={11} /> {article.category}
                  </span>
                  <h4 className="blog-card-title">{article.title}</h4>
                  <div className="blog-meta">
                    <span className="blog-date">{article.date}</span>
                    <span className="blog-dot">·</span>
                    <span className="blog-read"><Clock size={12} /> {article.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
