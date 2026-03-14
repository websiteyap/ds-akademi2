"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const instructors = [
  {
    id: 1,
    name: "Doç. Dr. Onur Şeker",
    image: "/instructor-onur.png",
    title: "Doçent Doktor",
    specialty: "Çelik Yapı Tasarımı & Performans Analizi",
    courseCount: 3,
    slug: "onur-seker"
  },
  {
    id: 2,
    name: "Dr. Öğr. Üyesi Ülgen Mert",
    image: "/instructor-ulgen.png",
    title: "Dr. Öğretim Üyesi",
    specialty: "Betonarme Yapı & Performans Analizi",
    courseCount: 3,
    slug: "ulgen-mert"
  },
  {
    id: 3,
    name: "Ömer Asım Şişman",
    image: "/instructor-omer.png",
    title: "Mühendis & Eğitmen",
    specialty: "Yapısal Ahşap Tasarım",
    courseCount: 1,
    slug: "omer-asim-sisman"
  },
  {
    id: 4,
    name: "Çağatay Demirci",
    image: "/instructor-cagatay.png",
    title: "Mühendis & Eğitmen",
    specialty: "Yapısal Ahşap Tasarım",
    courseCount: 1,
    slug: "cagatay-demirci"
  },
  {
    id: 5,
    name: "Doç. Dr. Sevilay Demirkesen Çakır",
    image: "/instructor-sevilay.png",
    title: "Doçent Doktor",
    specialty: "Bina Bilgi Modelleme (BIM)",
    courseCount: 1,
    slug: "sevilay-demirkesen-cakir"
  },
];

export default function Instructors() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

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
                  src={ins.image}
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
                <p className="ins-spec">{ins.specialty}</p>
                <div className="ins-course-count">
                  <BookOpen size={14} />
                  <span>{ins.courseCount} Kurs</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
