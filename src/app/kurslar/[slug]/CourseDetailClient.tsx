"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  User,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  GraduationCap,
  Layers,
  ArrowLeft,
  Calendar,
  Award,
  Target,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { type Course, courses } from "@/data/courses";

interface Props {
  course: Course;
}

export default function CourseDetailClient({ course }: Props) {
  // Related courses (same category, excluding current)
  const relatedCourses = courses
    .filter((c) => c.category === course.category && c.id !== course.id)
    .slice(0, 3);

  // If not enough related by category, add more from other categories
  const moreCourses =
    relatedCourses.length < 2
      ? courses
          .filter(
            (c) =>
              c.id !== course.id && !relatedCourses.find((r) => r.id === c.id)
          )
          .slice(0, 3 - relatedCourses.length)
      : [];

  const suggested = [...relatedCourses, ...moreCourses];

  return (
    <article className="course-detail-page">
      {/* Breadcrumb */}
      <div className="course-detail-breadcrumb-bar">
        <div className="container">
          <nav className="course-detail-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <ChevronRight size={14} />
            <Link href="/kurslar">Kurslar</Link>
            <ChevronRight size={14} />
            <span>{course.shortTitle}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="course-detail-hero">
        <div className="container">
          <div className="course-detail-hero-grid">
            {/* Left: Info */}
            <div className="course-detail-hero-info">
              <div className="course-detail-badges">
                <span className="course-detail-code">{course.code}</span>
                <span
                  className={`course-card-level level-${course.level.toLowerCase()}`}
                >
                  {course.level}
                </span>
                {course.isNew && (
                  <span className="course-card-new">YENİ</span>
                )}
              </div>

              <h1 className="course-detail-title">{course.title}</h1>
              <p className="course-detail-desc">{course.description}</p>

              {/* Quick Meta */}
              <div className="course-detail-quick-meta">
                <div className="course-detail-meta-chip">
                  <User size={16} />
                  <span>{course.instructor}</span>
                </div>
                <div className="course-detail-meta-chip">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="course-detail-meta-chip">
                  <Layers size={16} />
                  <span>{course.category}</span>
                </div>
                <div className="course-detail-meta-chip">
                  <BarChart3 size={16} />
                  <span>{course.level} Seviye</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="course-detail-cta">
                <button className="primary-btn">
                  <GraduationCap size={20} />
                  Hemen Kayıt Ol
                </button>
                <Link href="/iletisim" className="secondary-btn">
                  <Calendar size={18} />
                  Bilgi Al
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="course-detail-hero-img-wrap">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="course-detail-hero-img"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="course-detail-content">
        <div className="container">
          <div className="course-detail-content-grid">
            {/* Main Content */}
            <div className="course-detail-main">
              {/* Highlights */}
              <section className="course-detail-section">
                <h2 className="course-detail-section-title">
                  <Target size={20} />
                  Bu Eğitimde Neler Öğreneceksiniz?
                </h2>
                <div className="course-detail-highlights-grid">
                  {course.highlights.map((h, i) => (
                    <div key={i} className="course-detail-highlight-item">
                      <CheckCircle2
                        size={18}
                        className="course-detail-check"
                      />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Topics / Curriculum */}
              <section className="course-detail-section">
                <h2 className="course-detail-section-title">
                  <BookOpen size={20} />
                  Müfredat
                </h2>
                <ol className="course-detail-topics-list">
                  {course.topics.map((topic, i) => (
                    <li key={i} className="course-detail-topic-item">
                      <span className="course-detail-topic-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Prerequisites */}
              {course.prerequisites.length > 0 && (
                <section className="course-detail-section">
                  <h2 className="course-detail-section-title">
                    <AlertCircle size={20} />
                    Ön Koşullar
                  </h2>
                  <ul className="course-detail-prereq-list">
                    {course.prerequisites.map((p, i) => (
                      <li key={i} className="course-detail-prereq-item">
                        <ChevronRight size={16} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="course-detail-sidebar">
              {/* Instructor Card */}
              <div className="course-detail-sidebar-card">
                <h3 className="course-detail-sidebar-title">Eğitmen</h3>
                <div className="course-detail-instructor">
                  <div className="course-detail-instructor-img-wrap">
                    <Image
                      src={course.instructorImage}
                      alt={course.instructor}
                      fill
                      className="course-detail-instructor-img"
                      sizes="64px"
                    />
                  </div>
                  <div className="course-detail-instructor-info">
                    <strong>{course.instructor}</strong>
                    <span>{course.instructorTitle}</span>
                  </div>
                </div>
              </div>

              {/* Course Info Card */}
              <div className="course-detail-sidebar-card">
                <h3 className="course-detail-sidebar-title">Kurs Bilgileri</h3>
                <div className="course-detail-info-rows">
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <Clock size={15} /> Süre
                    </span>
                    <span className="course-detail-info-value">
                      {course.duration}
                    </span>
                  </div>
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <Layers size={15} /> Kategori
                    </span>
                    <span className="course-detail-info-value">
                      {course.category}
                    </span>
                  </div>
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <BarChart3 size={15} /> Seviye
                    </span>
                    <span className="course-detail-info-value">
                      {course.level}
                    </span>
                  </div>
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <Award size={15} /> Sertifika
                    </span>
                    <span className="course-detail-info-value">Evet</span>
                  </div>
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <BookOpen size={15} /> Konu Sayısı
                    </span>
                    <span className="course-detail-info-value">
                      {course.topics.length} Konu
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="course-detail-sidebar-card course-detail-sidebar-cta">
                <GraduationCap size={28} />
                <h3>Hemen Başlayın</h3>
                <p>
                  Kayıt olarak sertifikalı eğitim programına katılın.
                </p>
                <button className="primary-btn" style={{ width: "100%" }}>
                  Kayıt Ol
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      {suggested.length > 0 && (
        <section className="course-detail-related">
          <div className="container">
            <h2 className="course-detail-related-title">
              İlgili Eğitimler
            </h2>
            <div className="course-detail-related-grid">
              {suggested.map((c) => (
                <Link
                  href={`/kurslar/${c.slug}`}
                  key={c.id}
                  className="course-card"
                >
                  <div className="course-card-img-wrap">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      className="course-card-img"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="course-card-overlay" />
                    <div className="course-card-badges">
                      <span className="course-card-code">{c.code}</span>
                    </div>
                    <span
                      className={`course-card-level level-${c.level.toLowerCase()}`}
                    >
                      {c.level}
                    </span>
                  </div>
                  <div className="course-card-body">
                    <span className="course-card-category">{c.category}</span>
                    <h3 className="course-card-title">{c.shortTitle}</h3>
                    <div className="course-card-meta">
                      <span className="course-card-meta-item">
                        <User size={14} />
                        {c.instructor}
                      </span>
                      <span className="course-card-meta-item">
                        <Clock size={14} />
                        {c.duration}
                      </span>
                    </div>
                    <div className="course-card-footer">
                      <span className="course-card-cta">
                        Detayları Gör
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
