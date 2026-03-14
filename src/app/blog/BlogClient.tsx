"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { blogs, blogCategories } from '@/data/blogs';
import Breadcrumb from '@/components/Breadcrumb';

export default function BlogClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Tümü' || blog.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="blog-page">
      {/* Header */}
      <section className="blog-header-sec">
        <Breadcrumb 
          items={[
            { label: 'Blog', href: '/blog' }
          ]} 
        />
        <div className="container">
          <div className="blog-header-content">
            <h1 className="blog-title">DS Akademi Blog</h1>
            <p className="blog-desc">
              Yapısal mühendislik dünyasındaki en güncel gelişmeler, uzman eğitmenlerimizden makaleler,
              kariyer tavsiyeleri ve akademik incelemeler.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="blog-content-sec">
        <div className="container">
          
          <div className="blog-filter-bar">
            {/* Category Filter */}
            <div className="blog-cats">
              {blogCategories.map(cat => (
                <button
                  key={cat}
                  className={`blog-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="blog-search">
              <Search size={18} className="blog-search-icon" />
              <input 
                type="text" 
                placeholder="Makalelerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredBlogs.length > 0 ? (
            <div className="blog-grid">
              {filteredBlogs.map(blog => (
                <article key={blog.id} className="blog-card">
                  <Link href={`/blog/${blog.slug}`} className="blog-card-img-link">
                    <div className="blog-card-img-wrapper">
                      <Image 
                        src={blog.image} 
                        alt={blog.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }} 
                      />
                    </div>
                    <span className="blog-card-category">{blog.category}</span>
                  </Link>
                  
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span><Calendar size={14} /> {blog.publishedAt}</span>
                      <span><User size={14} /> {blog.author.name}</span>
                    </div>
                    
                    <Link href={`/blog/${blog.slug}`} className="blog-card-title-link">
                      <h3 className="blog-card-title">{blog.title}</h3>
                    </Link>
                    
                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                    
                    <div className="blog-card-footer">
                      <Link href={`/blog/${blog.slug}`} className="blog-card-read-more">
                        Devamını Oku <ArrowRight size={16} />
                      </Link>
                      <span className="blog-card-read-time">{blog.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="blog-empty-state">
              <Search size={48} />
              <h3>Sonuç Bulunamadı</h3>
              <p>"{searchQuery}" araması için veya seçilen kategoride makale bulunamadı.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Tümü');
                }}
                style={{ marginTop: '1rem' }}
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
