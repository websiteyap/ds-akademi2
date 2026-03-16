"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, GraduationCap, ArrowRight } from 'lucide-react';
import type { Course } from '@/lib/types';

const AUTO_PLAY_INTERVAL = 5000;

interface Props {
  courses: Course[];
}

export default function HeroSlider({ courses }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === courses.length - 1 ? 0 : prev + 1));
    setProgress(0);
    setTimeout(() => setIsTransitioning(false), 650);
  }, [isTransitioning, courses.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev === 0 ? courses.length - 1 : prev - 1));
    setProgress(0);
    setTimeout(() => setIsTransitioning(false), 650);
  }, [isTransitioning, courses.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setProgress(0);
    setTimeout(() => setIsTransitioning(false), 650);
  }, [isTransitioning, currentIndex]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => { nextSlide(); }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Progress bar
  useEffect(() => {
    if (!isAutoPlaying) return;
    const tick = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / (AUTO_PLAY_INTERVAL / 50));
      });
    }, 50);
    return () => clearInterval(tick);
  }, [isAutoPlaying, currentIndex]);

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
    return "slide hidden-right";
  };

  if (!courses.length) return null;

  return (
    <section
      className="hero-slider-section"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Section Header */}
      <div className="container">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[3px] uppercase text-[var(--accent-color)]">
              <GraduationCap size={14} />
              KURSLARIMIZ
            </span>
            <h2 className="hero-slider-heading">Öne Çıkan <span className="text-gradient">Eğitimler</span></h2>
          </div>
          <Link href="/kurslar" className="hero-slider-view-all shrink-0">
            Tüm Kurslar
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Full-width Carousel */}
      <div className="hero-slider-container">
        <button className="arrow prev-arrow" onClick={prevSlide} aria-label="Önceki">
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
                src={course.image || '/logo.png'}
                alt={course.title || 'Course Image'}
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

        <button className="arrow next-arrow" onClick={nextSlide} aria-label="Sonraki">
          <ChevronRight size={64} strokeWidth={1.5} />
        </button>
      </div>

      {/* Bottom controls */}
      <div className="container">
        <div className="hero-slider-controls">
          <div className="hero-slider-dots">
            {courses.map((_, index) => (
              <button
                key={index}
                className={`hero-slider-dot ${index === currentIndex ? 'hero-slider-dot--active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Slayt ${index + 1}`}
              >
                {index === currentIndex && (
                  <span
                    className="hero-slider-dot-progress"
                    style={{ width: `${isAutoPlaying ? progress : 100}%` }}
                  />
                )}
              </button>
            ))}
          </div>
          <span className="hero-slider-counter">
            <strong>{String(currentIndex + 1).padStart(2, '0')}</strong>
            <span className="hero-slider-counter-sep">/</span>
            {String(courses.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
