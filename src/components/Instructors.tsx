"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import type { Instructor } from '@/lib/types';

interface Props {
  instructors: Instructor[];
}

export default function Instructors({ instructors }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  if (!instructors.length) return null;

  return (
    <section className="ins-section">
      <div className="container">
        <div className="ins-top-row">
          <div className="ins-left">
            <span className="ins-badge">EĞİTMENLER</span>
            <h2 className="ins-heading">Alanında Uzman Kadromuz</h2>
          </div>
          <div className="ins-nav-arrows">
            <button className="ins-arrow-btn" onClick={() => scroll('left')} aria-label="Scroll left">
              <ChevronLeft size={20} />
            </button>
            <button className="ins-arrow-btn" onClick={() => scroll('right')} aria-label="Scroll right">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="ins-track" ref={scrollRef}>
          {instructors.map((ins) => (
            <Link href={`/egitmenler/${ins.slug}`} key={ins.id} className="ins-card" style={{ textDecoration: 'none' }}>
              <div className="ins-img-area">
                <Image
                  src={ins.image ?? ''}
                  alt={ins.name}
                  fill
                  className="ins-photo"
                  sizes="280px"
                />
                <div className="ins-img-overlay" />
              </div>

              <div className="ins-card-bottom">
                <h3 className="ins-name">{ins.name}</h3>
                <span className="ins-role">{ins.title}</span>
                <p className="ins-spec">{ins.specialty ?? ins.department}</p>
                {ins.courseCount !== undefined && (
                  <div className="ins-course-count">
                    <BookOpen size={14} />
                    <span>{ins.courseCount} Kurs</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
