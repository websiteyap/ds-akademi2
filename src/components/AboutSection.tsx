"use client";

import React from 'react';
import { GraduationCap, Award, ShieldCheck, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: "Akademik Kadro",
    desc: "Doçent ve Doktor unvanlı üniversite öğretim üyeleri",
  },
  {
    icon: Award,
    title: "Sertifikalı Eğitim",
    desc: "Akademik geçerliliği olan kurs bitirme sertifikası",
  },
  {
    icon: ShieldCheck,
    title: "Güncel Standartlar",
    desc: "TBDY 2018 ve güncel mühendislik yönetmeliklerine uygun",
  },
  {
    icon: TrendingUp,
    title: "Uygulamalı Öğrenme",
    desc: "Gerçek proje örnekleri ile pratik mühendislik deneyimi",
  },
];

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="container">
        {/* 2-Column Layout */}
        <div className="about-content-grid">
          
          {/* Left Column: Text */}
          <div className="about-header">
            <span className="about-simple-tag">Neden DS Akademi?</span>
            <h2 className="about-title">
              Akademisyenlerden <span className="about-accent">Mühendislik Eğitimi</span>
            </h2>
            <p className="about-subtitle">
              Eğitmenlerimizin tamamı Türkiye'nin önde gelen üniversitelerinde aktif görev yapan 
              <strong> Doçent ve Doktor</strong> unvanlı akademisyenlerden oluşmaktadır. 
              Bilimsel temelli, akademik standartlarda eğitim sunuyoruz.
            </p>
          </div>

          {/* Right Column: 4 Features Grid */}
          <div className="about-strip">
            {features.map((f, i) => (
              <div key={i} className="about-strip-item">
                <div className="about-strip-icon">
                  <f.icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="about-strip-title">{f.title}</h3>
                  <p className="about-strip-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Stats Bar */}
        <div className="about-stat-bar">
          <div className="about-stat-item">
            <span className="about-stat-num">5+</span>
            <span className="about-stat-text">Akademisyen Eğitmen</span>
          </div>
          <div className="about-stat-divider" />
          <div className="about-stat-item">
            <span className="about-stat-num">8</span>
            <span className="about-stat-text">Profesyonel Kurs</span>
          </div>
          <div className="about-stat-divider" />
          <div className="about-stat-item">
            <span className="about-stat-num">100%</span>
            <span className="about-stat-text">Akademik Kadro</span>
          </div>
          <div className="about-stat-divider" />
          <div className="about-stat-item">
            <span className="about-stat-num">4-8</span>
            <span className="about-stat-text">Haftalık Programlar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
