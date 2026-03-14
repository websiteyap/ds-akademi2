"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, ArrowRight, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { BlogPost, blogs } from '@/data/blogs';
import Breadcrumb from '@/components/Breadcrumb';

interface Props {
  blog: BlogPost;
}

export default function BlogDetailClient({ blog }: Props) {
  // Get 2 related posts (excluding current)
  const relatedPosts = blogs.filter(b => b.id !== blog.id).slice(0, 2);

  return (
    <main className="blog-detail-page">
      <div className="container">
        <Breadcrumb 
          items={[
            { label: 'Blog', href: '/blog' },
            { label: blog.title, href: `/blog/${blog.slug}` }
          ]} 
        />
        
        <article className="blog-article">
          <header className="blog-article-header">
            <Link href="/blog" className="back-to-blog">
              <ArrowLeft size={16} /> Blog'a Dön
            </Link>
            
            <div className="blog-article-category">
              {blog.category}
            </div>
            
            <h1 className="blog-article-title">{blog.title}</h1>
            
            <p className="blog-article-excerpt">{blog.excerpt}</p>
            
            <div className="blog-article-meta">
              <div className="meta-author">
                <Image 
                  src={blog.author.image} 
                  alt={blog.author.name}
                  width={40}
                  height={40}
                  className="meta-author-img"
                />
                <div className="meta-author-info">
                  <span className="meta-author-name">{blog.author.name}</span>
                  <div className="meta-details">
                    <span><Calendar size={14} /> {blog.publishedAt}</span>
                    <span><Clock size={14} /> {blog.readTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="meta-share">
                <span className="share-text"><Share2 size={16} /> Paylaş:</span>
                <button className="share-btn"><Linkedin size={18} /></button>
                <button className="share-btn"><Twitter size={18} /></button>
                <button className="share-btn"><Facebook size={18} /></button>
              </div>
            </div>
          </header>

          <figure className="blog-article-hero-image">
            <Image 
              src={blog.image}
              alt={blog.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </figure>

          <div className="blog-article-body">
            {/* 
              This is where a real Markdown or Rich Text component would be rendered. 
              For this static implementation, we'll placeholder some structural content.
            */}
            <p className="dropcap">{blog.content}</p>
            <p>
              TBDY 2018 (Türkiye Bina Deprem Yönetmeliği) kapsamında, betonarme ve çelik yapıların 
              performans değerlendirmesi üzerine yapılan çalışmalar son yıllarda büyük bir önem kazanmıştır.
              Mevcut veya yeni yapılacak binaların deprem güvenliğinin tahkiki, doğrudan yapı elemanlarının 
              doğrusal olmayan (non-lineer) davranışlarının modellenmesine dayanır.
            </p>
            
            <h2>Değerlendirme Süreçleri</h2>
            <p>
              Performans hedefleri (Kesintisiz Kullanım, Can Güvenliği, Göçmenin Önlenmesi) yapının kullanım amacı 
              ve deprem düzeyine göre farklılık göstermektedir. Bu bağlamda, yapısal mühendislerin yazılım sonuçlarını 
              doğru yorumlayıp fiziksel gerçeklikle bağdaştırmaları kritik bir yetkinliktir.
            </p>
            
            <blockquote>
              "Yapısal mühendislik sadece hesap yapmak değil, malzemenin doğasını anlamak ve yapıya 
              davranışını dikte etmektir."
            </blockquote>
            
            <p>
              Bu analizlerin en verimli şekilde gerçekleştirilmesi için DS Akademi olarak hazırladığımız 
              performans analiz eğitimlerinde kursiyerlerin bu felsefeyi benimsemelerini hedeflemekteyiz.
            </p>
          </div>
          
          <footer className="blog-article-footer">
            <div className="blog-tags">
              <span>Etiketler:</span>
              <Link href="#">TBDY 2018</Link>
              <Link href="#">Performans Analizi</Link>
              <Link href="#">Yapısal Tasarım</Link>
            </div>
          </footer>
        </article>

        {relatedPosts.length > 0 && (
          <section className="related-blogs-sec">
            <div className="related-blogs-header">
              <h3>İlginizi Çekebilecek Diğer Yazılar</h3>
              <Link href="/blog" className="see-all-link">
                Tümünü Gör <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="related-blog-grid">
              {relatedPosts.map(relBlog => (
                <article key={relBlog.id} className="related-blog-card">
                  <Link href={`/blog/${relBlog.slug}`} className="related-blog-img-link">
                    <div className="related-blog-img">
                      <Image 
                        src={relBlog.image} 
                        alt={relBlog.title} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                      />
                    </div>
                  </Link>
                  <div className="related-blog-content">
                    <span className="related-category">{relBlog.category}</span>
                    <Link href={`/blog/${relBlog.slug}`}>
                      <h4 className="related-title">{relBlog.title}</h4>
                    </Link>
                    <div className="related-meta">
                      <span><Calendar size={13} /> {relBlog.publishedAt}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
