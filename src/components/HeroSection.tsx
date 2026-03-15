"use client";

import React from 'react';
import { Play, ArrowRight, Star, BadgeCheck, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import HeroTrustSlider from './HeroTrustSlider';

const col1 = [
  { id: 1, name: "Doç. Dr. Onur Şeker", course: "Çelik Yapı Tasarımı", img: "/instructor-onur.png", slug: "onur-seker" },
  { id: 2, name: "Dr. Öğr. Üyesi Ülgen Mert", course: "Betonarme Eğitimi", img: "/instructor-ulgen.png", slug: "ulgen-mert" },
  { id: 3, name: "Doç. Dr. Onur Şeker", course: "Çelik Yapı Tasarımı", img: "/instructor-onur.png", slug: "onur-seker" }, 
];

const col2 = [
  { id: 4, name: "Ömer Asım Şişman", course: "Ahşap Tasarım", img: "/instructor-omer.png", slug: "omer-asim-sisman" },
  { id: 5, name: "Doç. Dr. Sevilay", course: "BIM Eğitimi", img: "/instructor-sevilay.png", slug: "sevilay-demirkesen-cakir" },
  { id: 6, name: "Çağatay Demirci", course: "Temel Ahşap", img: "/instructor-omer.png", slug: "cagatay-demirci" },
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
            <Link href="/kurslar" className="primary-btn" style={{ textDecoration: 'none' }}>
              Eğitimlere Göz At
              <ArrowRight size={18} />
            </Link>
            <Link href="/egitmenler" className="secondary-btn" style={{ textDecoration: 'none' }}>
              <span className="play-icon-wrapper">
                <GraduationCap size={16} />
              </span>
              Uzman Kadromuz
            </Link>
          </div>
          
          <HeroTrustSlider />
        </div>

        {/* RIGHT COLUMN: ASYMMETRIC SCROLLING CARDS */}
        <div className="hero-visuals-wrapper">
          <div className="hero-visuals">
            <div className="hero-scroll-track slow-scroll">
            {[...col1, ...col1, ...col1, ...col1].map((item, idx) => (
              <Link href={`/egitmenler/${item.slug}`} className="hero-instructor-card" key={`c1-${idx}`} style={{ textDecoration: 'none' }}>
                <BadgeCheck className="hero-card-badge" size={20} fill="var(--accent-color)" stroke="#fff" />
                <div className="hero-card-img-wrapper">
                  <Image src={item.img} alt={item.name} fill className="hero-card-img" />
                </div>
                <div className="hero-card-info">
                  <strong>{item.name}</strong>
                  <span>{item.course}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="hero-scroll-track fast-scroll">
            {[...col2, ...col2, ...col2, ...col2].map((item, idx) => (
              <Link href={`/egitmenler/${item.slug}`} className="hero-instructor-card" key={`c2-${idx}`} style={{ textDecoration: 'none' }}>
                <BadgeCheck className="hero-card-badge" size={20} fill="var(--accent-color)" stroke="#fff" />
                <div className="hero-card-img-wrapper">
                  <Image src={item.img} alt={item.name} fill className="hero-card-img" />
                </div>
                <div className="hero-card-info">
                  <strong>{item.name}</strong>
                  <span>{item.course}</span>
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>

      </div>
    </section>
  );
}
