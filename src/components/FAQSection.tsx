"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: "Eğitimler online mı yoksa yüz yüze mi gerçekleşiyor?",
    a: "Eğitimlerimiz genel olarak online (canlı yayın) olarak gerçekleştirilmektedir. Ancak bazı özel yoğunlaştırılmış programlarda hibrit veya yüz yüze seçeneklerimiz de dönemsel olarak açılmaktadır. Kesin bilgi için ilgilendiğiniz kursun detay sayfasına bakabilirsiniz."
  },
  {
    q: "Kurs bitiminde sertifika alabiliyor muyum?",
    a: "Evet, tüm kurslarımızda devamsızlık sınırını aşmayan ve bitirme projesini başarıyla teslim eden katılımcılarımıza DS Akademi onaylı, akademik geçerliliği olan bir başarı sertifikası verilmektedir."
  },
  {
    q: "Canlı dersleri kaçırırsam tekrar izleyebilir miyim?",
    a: "Kesinlikle. Tüm canlı dersler yüksek kalitede kaydedilir ve eğitim süresi boyunca (ve eğitim bittikten sonraki 1 ay boyunca) katılımcıların erişimine açık tutulur."
  },
  {
    q: "Eğitimlerde hangi yönetmelik ve standartlar kullanılıyor?",
    a: "Tüm eğitimlerimiz Türkiye Bina Deprem Yönetmeliği (TBDY 2018), TS500, AISC 360-16, ASCE 41-17 gibi en güncel yerel ve uluslararası tasarım standartlarına tam uyumlu olarak işlenmektedir."
  },
  {
    q: "Kimler katılabilir? Temel seviye bilgisi şart mı?",
    a: "Kurslarımız inşaat mühendisliği öğrencilerine, yeni mezunlara ve kendini belirli bir alanda (Çelik, Ahşap, Performans Analizi vb.) geliştirmek isteyen deneyimli mühendislere yöneliktir. İlgili dersler için temel mühendislik mekaniği bilgisi beklenmektedir."
  }
];

export default function FAQSection() {
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
          <p className="faq-subtitle">Eğitimlerimiz, katılım şartları ve sertifikasyon süreçleri hakkında en çok sorulan soruları sizin için derledik.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${openIdx === idx ? 'open' : ''}`}
              onClick={() => toggle(idx)}
            >
              <div className="faq-q">
                <h3>{faq.q}</h3>
                <span className="faq-icon">
                  <ChevronDown size={20} />
                </span>
              </div>
              <div className="faq-a">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
