"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { courses } from '@/data/courses';

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
              <div className="slide-meta-bottom">
                {slideClass === 'slide active' ? (
                  <Link href={`/kurslar/${course.slug}`} className="slide-btn" style={{ textDecoration: 'none' }}>
                    KURSA KATIL
                  </Link>
                ) : (
                  <button className="slide-btn">KURSA KATIL</button>
                )}
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
