"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin, Layers, Clock, User } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: "DS-101 TEMEL ÇELİK YAPI TASARIMI",
    image: "/DS-101-TEMEL-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    instructor: "Doç. Dr. Onur Şeker",
    category: "Çelik Yapı Tasarımı",
    duration: "4 Hafta"
  },
  {
    id: 2,
    title: "DS-102 TEMEL BETONARME YAPI TASARIMI",
    image: "/DS-102-TEMEL-BETONARME-YAPI-TASARIMI.jpg",
    instructor: "Dr. Öğr. Üyesi Ülgen Mert",
    category: "Betonarme Yapı",
    duration: "4 Hafta"
  },
  {
    id: 3,
    title: "DS-201 DD ÇELİK YAPI TASARIMI",
    image: "/DS-201-DEPREME-DAYANIKLI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    instructor: "Doç. Dr. Onur Şeker",
    category: "Çelik Yapı Tasarımı",
    duration: "6 Hafta"
  },
  {
    id: 4,
    title: "DS-202 DD BETONARME YAPI TASARIMI",
    image: "/DS-202-DEPREME-DAYANIKLI-BETONARME-YAPI-TASARIMI-EĞİTİMİ.jpg",
    instructor: "Dr. Öğr. Üyesi Ülgen Mert",
    category: "Betonarme Yapı",
    duration: "6 Hafta"
  },
  {
    id: 5,
    title: "DS-301 PD ÇELİK YAPI TASARIMI",
    image: "/DS-301-PERFORMANSA-DAYALI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    instructor: "Doç. Dr. Onur Şeker",
    category: "Performans Analizi",
    duration: "8 Hafta"
  },
  {
    id: 6,
    title: "DS-302 MEVCUT BETONARME DEĞERLENDİRME",
    image: "/DS-302-MEVCUT-BETONARME-YAPILARIN-DEĞERLENDİRİLMESİ-VE-PERFORMANS-ANALİZİ-EĞİTİMİ.jpg",
    instructor: "Dr. Öğr. Üyesi Ülgen Mert",
    category: "Performans Analizi",
    duration: "8 Hafta"
  },
  {
    id: 7,
    title: "DS-401 YAPISAL AHŞAP TASARIM",
    image: "/DS-401-YAPISAL-AHŞAP-TASARIM-EĞİTİMİ.jpg",
    instructor: "Ömer Asım Şişman & Çağatay Demirci",
    category: "Ahşap Tasarımı",
    duration: "4 Hafta"
  },
  {
    id: 8,
    title: "DS-501 BIM TEORİK VE UYGULAMA",
    image: "/DS-501-BİNA-BİLGİ-MODELLEME-(BIM)-TEORİK-VE-UYGULAMA-EĞİTİMİ.jpg",
    instructor: "Doç. Dr. Sevilay Demirkesen Çakır",
    category: "BIM",
    duration: "6 Hafta"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex(prev => (prev === courses.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex(prev => (prev === 0 ? courses.length - 1 : prev - 1));

  const getSlideClass = (index: number) => {
    let diff = index - currentIndex;
    const half = courses.length / 2;
    
    if (diff < -half) diff += courses.length;
    if (diff > half) diff -= courses.length;

    if (diff === 0) return "slide active";
    if (diff === -1) return "slide prev";
    if (diff === 1) return "slide next";
    if (diff === -2) return "slide prev2";
    if (diff === 2) return "slide next2";
    
    if (diff < 0) return "slide hidden-left";
    else return "slide hidden-right";
  };

  return (
    <div className="hero-slider-container">
      <button className="arrow prev-arrow" onClick={prevSlide} aria-label="Previous">
        <ChevronLeft size={64} strokeWidth={1.5} />
      </button>

      {courses.map((course, index) => {
        const slideClass = getSlideClass(index);
        return (
          <div 
            key={course.id} 
            className={slideClass}
            onClick={() => {
              if (slideClass.includes('prev')) prevSlide();
              if (slideClass.includes('next')) nextSlide();
            }}
          >
            <Image 
              src={course.image} 
              alt={course.title} 
              fill 
              className="slide-image"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority={index === currentIndex || slideClass.includes('prev') || slideClass.includes('next')}
            />
            <div className="slide-content">
              <h2 className="slide-title">{course.title}</h2>
              
              <div className="slide-meta-row">
                <Layers size={16} className="icon-accent" /> <strong>{course.category}</strong>
              </div>
              
              <div className="slide-meta-bottom">
                <div className="date-time-box">
                  <span className="meta-item"><User size={14} /> Eğitimci: {course.instructor}</span>
                  <span className="meta-item"><Clock size={14} /> Süre: {course.duration}</span>
                </div>
                <button className="slide-btn">KURSA KATIL</button>
              </div>
            </div>
          </div>
        );
      })}

      <button className="arrow next-arrow" onClick={nextSlide} aria-label="Next">
        <ChevronRight size={64} strokeWidth={1.5} />
      </button>
    </div>
  );
}
