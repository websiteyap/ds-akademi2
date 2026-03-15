"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import type { Faq } from '@/lib/types';

interface Props {
  faqs: Faq[];
}

export default function FAQSection({ faqs }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="faq-section">
      <div className="container faq-container">
        <div className="faq-header">
          <span className="faq-badge">
            <HelpCircle size={14} /> Sıkça Sorulan Sorular
          </span>
          <h2 className="faq-title">Aklınıza Takılanlar</h2>
          <p className="faq-subtitle">
            Eğitimlerimiz, katılım şartları ve sertifikasyon süreçleri hakkında en çok sorulan soruları sizin için derledik.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className={`faq-item ${openIdx === idx ? 'open' : ''}`}
              onClick={() => toggle(idx)}
            >
              <div className="faq-q">
                <h3>{faq.question}</h3>
                <span className="faq-icon">
                  <ChevronDown size={20} />
                </span>
              </div>
              <div className="faq-a">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/sss" className="primary-btn outline">
            Tüm Soruları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
