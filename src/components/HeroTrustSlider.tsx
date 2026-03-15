"use client";

import React, { useState, useEffect } from 'react';
import { BadgeCheck, GraduationCap, Clock, Star } from 'lucide-react';

const slides = [
  { 
    id: 1, 
    text: "Akademik Düzeyde", 
    sub: "Eğitim İçerikleri", 
    icon: BadgeCheck 
  },
  { 
    id: 2, 
    text: "Akademisyenler ve", 
    sub: "Uzman Eğitmenler", 
    icon: GraduationCap 
  },
  { 
    id: 3, 
    text: "Ömür Boyu", 
    sub: "Erişim İmkanı", 
    icon: Clock 
  }
];

export default function HeroTrustSlider() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setIsVisible(true);
      }, 500); // Wait for fade out
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];
  const Icon = slide.icon;

  return (
    <div className="hero-trust">
      <div className="hero-avatars" style={{ 
        background: 'rgba(var(--accent-color-rgb, 0, 102, 255), 0.1)', 
        padding: '0.6rem', 
        borderRadius: '4px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: 'all 0.5s ease',
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        opacity: isVisible ? 1 : 0
      }}>
         <Icon size={26} color="var(--accent-color)" />
      </div>
      <div className="hero-trust-content" style={{ flex: 1 }}>
        <div style={{ 
          transition: 'all 0.5s ease',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(5px)',
          display: 'flex',
          flexDirection: 'inherit', // Controlled by CSS
          gap: 'inherit'             // Controlled by CSS
        }} className="hero-trust-animate-wrapper">
          <div className="hero-trust-label">
            <span><strong>{slide.text}</strong> {slide.sub}</span>
          </div>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#FFB800" color="#FFB800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
