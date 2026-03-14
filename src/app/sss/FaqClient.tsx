"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, MessageCircle, FileText } from 'lucide-react';
import { faqs, FAQCategory, FAQ } from '@/data/faqs';
import Breadcrumb from '@/components/Breadcrumb';

export default function FaqClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('genel');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter logic
  const filteredData = faqs.map(cat => {
    if (!searchQuery) {
      return cat;
    }
    
    const matchedFaqs = cat.faqs.filter(f => 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return { ...cat, faqs: matchedFaqs };
  }).filter(cat => cat.faqs.length > 0);

  const displayCategory = searchQuery ? filteredData[0]?.id : activeCategory;
  const currentCategoryData = filteredData.find(c => c.id === displayCategory);

  return (
    <main className="faq-page">
      {/* Header */}
      <section className="faq-header-sec">
        <Breadcrumb 
          items={[
            { label: 'Sıkça Sorulan Sorular', href: '/sss' }
          ]} 
        />
        <div className="container">
          <div className="faq-header-content">
            <h1 className="faq-title">Nasıl Yardımcı Olabiliriz?</h1>
            <p className="faq-desc">
              Eğitim programlarımız, ödeme süreçleri, sertifikasyon veya sisteme giriş ile 
              ilgili aklınıza takılan tüm soruların cevaplarını burada bulabilirsiniz.
            </p>
            <div className="faq-search-box">
              <Search className="faq-search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Örn: Sertifikalar ne zaman verilir?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="faq-search-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="faq-content-sec">
        <div className="container">
          <div className="faq-layout">
            
            {/* Sidebar Categories */}
            <aside className="faq-sidebar">
              <h3 className="faq-sidebar-title">Kategoriler</h3>
              <nav className="faq-cat-nav">
                {faqs.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      className={`faq-cat-btn ${(!searchQuery && activeCategory === cat.id) ? 'active' : ''}`}
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory(cat.id);
                      }}
                    >
                      <Icon size={18} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="faq-contact-card">
                <MessageCircle size={24} className="faq-contact-icon" />
                <h4>Aradığınızı Bulamadınız mı?</h4>
                <p>Destek ekibimizle iletişime geçebilirsiniz.</p>
                <Link href="/iletisim" className="faq-contact-link">
                  Bize Ulaşın
                </Link>
              </div>
            </aside>

            {/* Questions area */}
            <div className="faq-questions-area">
              {searchQuery && (
                <div className="faq-search-results-info">
                  "{searchQuery}" için sonuçlar gösteriliyor
                  <button onClick={() => setSearchQuery('')}>Temizle</button>
                </div>
              )}

              {currentCategoryData ? (
                <>
                  <div className="faq-cat-header">
                    <currentCategoryData.icon size={28} />
                    <h2>{currentCategoryData.name}</h2>
                  </div>

                  <div className="faq-accordion">
                    {currentCategoryData.faqs.map(faq => {
                      const isOpen = !!openItems[faq.id];
                      return (
                        <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                          <button 
                            className="faq-question-btn"
                            onClick={() => toggleItem(faq.id)}
                            aria-expanded={isOpen}
                          >
                            <span className="faq-question-text">{faq.question}</span>
                            <ChevronDown 
                              className="faq-chevron" 
                              size={20} 
                            />
                          </button>
                          <div 
                            className="faq-answer-wrapper"
                            style={{ 
                              maxHeight: isOpen ? '500px' : '0',
                              opacity: isOpen ? 1 : 0
                            }}
                          >
                            <div className="faq-answer-inner">
                              <p>{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="faq-empty-state">
                  <FileText size={48} />
                  <h3>Sonuç Bulunamadı</h3>
                  <p>Arama kriterinize uygun bir soru veya cevap bulamadık. Lütfen farklı anahtar kelimeler deneyin.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
