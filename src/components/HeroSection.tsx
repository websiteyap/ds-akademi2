"use client";

import React from 'react';
import { Play, ArrowRight, Star, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

const col1 = [
  { id: 1, name: "Doç. Dr. Onur Şeker", course: "Çelik Yapı Tasarımı", img: "/instructor-onur.png" },
  { id: 2, name: "Dr. Öğr. Üyesi Ülgen Mert", course: "Betonarme Eğitimi", img: "/instructor-ulgen.png" },
  { id: 3, name: "Doç. Dr. Onur Şeker", course: "Çelik Yapı Tasarımı", img: "/instructor-onur.png" }, // duplicated for loop
];

const col2 = [
  { id: 4, name: "Ömer Asım Şişman", course: "Ahşap Tasarım", img: "/instructor-omer.png" },
  { id: 5, name: "Doç. Dr. Sevilay", course: "BIM Eğitimi", img: "/instructor-sevilay.png" },
  { id: 6, name: "Ömer Asım Şişman", course: "Ahşap Tasarım", img: "/instructor-omer.png" }, // duplicated for loop
];

export default function HeroSection() {
  return (
    <section className="hero-main-section">
      <div className="hero-bg-elements">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-grid"></div>
      </div>
      
      <div className="container hero-main-container">
        
        {/* LEFT COLUMN: TEXT & ACTIONS */}
        <div className="hero-main-content">
          <div className="hero-pill">
            <span className="hero-pill-badge">YENİ DÖNEM</span>
            <span className="hero-pill-text">Performansa Dayalı Tasarım Kayıtları Başladı</span>
            <ArrowRight size={14} />
          </div>
          
          <h1 className="hero-main-title">
            Geleceğin <span className="text-gradient">Yapısal Mühendisleriyle</span> Tanışın
          </h1>
          
          <p className="hero-main-desc">
            Türkiye'nin önde gelen akademisyenlerinden, güncel yönetmeliklere (TBDY 2018) uygun, teoriyi pratiğe dönüştüren eğitimler. Sertifikalı uzmanlığa hemen sahip olun.
          </p>
          
          <div className="hero-actions">
            <button className="primary-btn">
              Eğitimlere Göz At
              <ArrowRight size={18} />
            </button>
            <button className="secondary-btn">
              <span className="play-icon-wrapper">
                <Play size={16} fill="currentColor" />
              </span>
              Tanıtım Videosu
            </button>
          </div>
          
          <div className="hero-trust">
            <div className="hero-avatars">
              <div className="avatar-circle"></div>
              <div className="avatar-circle"></div>
              <div className="avatar-circle"></div>
              <div className="avatar-circle"></div>
            </div>
            <div className="hero-trust-text">
              <div className="stars">
                <Star size={14} fill="#FFB800" color="#FFB800" />
                <Star size={14} fill="#FFB800" color="#FFB800" />
                <Star size={14} fill="#FFB800" color="#FFB800" />
                <Star size={14} fill="#FFB800" color="#FFB800" />
                <Star size={14} fill="#FFB800" color="#FFB800" />
              </div>
              <span><strong>1,200+</strong> mühendis katıldı</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ASYMMETRIC SCROLLING CARDS */}
        <div className="hero-visuals">
          <div className="hero-scroll-track slow-scroll">
            {col1.map((item, idx) => (
              <div className="hero-instructor-card" key={`c1-${idx}`}>
                <BadgeCheck className="hero-card-badge" size={20} fill="var(--accent-color)" stroke="#fff" />
                <div className="hero-card-img-wrapper">
                  <Image src={item.img} alt={item.name} fill className="hero-card-img" />
                </div>
                <div className="hero-card-info">
                  <strong>{item.name}</strong>
                  <span>{item.course}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-scroll-track fast-scroll">
            {col2.map((item, idx) => (
              <div className="hero-instructor-card" key={`c2-${idx}`}>
                <BadgeCheck className="hero-card-badge" size={20} fill="var(--accent-color)" stroke="#fff" />
                <div className="hero-card-img-wrapper">
                  <Image src={item.img} alt={item.name} fill className="hero-card-img" />
                </div>
                <div className="hero-card-info">
                  <strong>{item.name}</strong>
                  <span>{item.course}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
