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
  Tag,
  Check,
} from "lucide-react";
import type { Course, CoursePackage } from "@/lib/types";


interface Props {
  course: Course;
  relatedCourses: Course[];
}

export default function CourseDetailClient({ course, relatedCourses }: Props) {

  const primaryInstructor = course.primary_instructor;
  const allInstructors = course.all_instructors ?? (primaryInstructor ? [primaryInstructor] : []);

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
            <span>{course.short_title}</span>
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
                <span className={`course-card-level level-${course.level.toLowerCase()}`}>
                  {course.level}
                </span>
                {course.is_new && <span className="course-card-new">YENİ</span>}
              </div>

              <h1 className="course-detail-title">{course.title}</h1>
              <p className="course-detail-desc">{course.description}</p>

              {/* Quick Meta */}
              <div className="course-detail-quick-meta">
                <div className="course-detail-meta-chip">
                  <User size={16} />
                  <span>
                    {allInstructors.map((i) => i.name).join(" & ")}
                  </span>
                </div>
                <div className="course-detail-meta-chip">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="course-detail-meta-chip">
                  <Layers size={16} />
                  <span>{course.category?.name}</span>
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
              {course.highlights && course.highlights.length > 0 && (
                <section className="course-detail-section">
                  <h2 className="course-detail-section-title">
                    <Target size={20} />
                    Bu Eğitimde Neler Öğreneceksiniz?
                  </h2>
                  <div className="course-detail-highlights-grid">
                    {course.highlights.map((h, i) => (
                      <div key={i} className="course-detail-highlight-item">
                        <CheckCircle2 size={18} className="course-detail-check" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Topics / Curriculum */}
              {course.topics && course.topics.length > 0 && (
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
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
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

              {/* Pricing Packages */}
              {course.packages && course.packages.length > 0 && (
                <section className="course-detail-section">
                  <h2 className="course-detail-section-title">
                    <Tag size={20} />
                    Fiyat Paketleri
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {course.packages.map((pkg: CoursePackage) => (
                      <div
                        key={pkg.id}
                        style={{
                          border: pkg.is_featured
                            ? "2px solid var(--accent-color)"
                            : "1px solid var(--border-color)",
                          borderRadius: "0.75rem",
                          padding: "1.5rem",
                          background: pkg.is_featured
                            ? "var(--accent-color)/5"
                            : "var(--bg-secondary)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {pkg.is_featured && (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              letterSpacing: "2px",
                              textTransform: "uppercase",
                              color: "var(--accent-color)",
                            }}
                          >
                            ⭐ Önerilen
                          </span>
                        )}
                        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
                          {pkg.name}
                        </h3>
                        {pkg.price !== null && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: "1.5rem",
                              fontWeight: 800,
                              color: "var(--accent-color)",
                            }}
                          >
                            {pkg.price.toLocaleString("tr-TR")} {pkg.currency}
                          </p>
                        )}
                        {pkg.description && (
                          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {pkg.description}
                          </p>
                        )}
                        {pkg.features && pkg.features.length > 0 && (
                          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {pkg.features.map((f, fi) => (
                              <li key={fi} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                                <Check size={14} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                        <button className="primary-btn" style={{ marginTop: "auto" }}>
                          Satın Al
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="course-detail-sidebar">
              {/* Instructor Card(s) */}
              <div className="course-detail-sidebar-card">
                <h3 className="course-detail-sidebar-title">
                  {allInstructors.length > 1 ? "Eğitmenler" : "Eğitmen"}
                </h3>
                {allInstructors.map((ins) => (
                  <Link
                    key={ins.id}
                    href={`/egitmenler/${ins.slug}`}
                    className="course-detail-instructor"
                    style={{ textDecoration: "none", display: "flex", marginBottom: "0.75rem" }}
                  >
                    <div className="course-detail-instructor-img-wrap">
                      <Image
                        src={ins.image}
                        alt={ins.name}
                        fill
                        className="course-detail-instructor-img"
                        sizes="64px"
                      />
                    </div>
                    <div className="course-detail-instructor-info">
                      <strong>{ins.name}</strong>
                      <span>{ins.title}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Course Info Card */}
              <div className="course-detail-sidebar-card">
                <h3 className="course-detail-sidebar-title">Kurs Bilgileri</h3>
                <div className="course-detail-info-rows">
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <Clock size={15} /> Süre
                    </span>
                    <span className="course-detail-info-value">{course.duration}</span>
                  </div>
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <Layers size={15} /> Kategori
                    </span>
                    <span className="course-detail-info-value">{course.category?.name}</span>
                  </div>
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <BarChart3 size={15} /> Seviye
                    </span>
                    <span className="course-detail-info-value">{course.level}</span>
                  </div>
                  <div className="course-detail-info-row">
                    <span className="course-detail-info-label">
                      <Award size={15} /> Sertifika
                    </span>
                    <span className="course-detail-info-value">Evet</span>
                  </div>
                  {course.topics && (
                    <div className="course-detail-info-row">
                      <span className="course-detail-info-label">
                        <BookOpen size={15} /> Konu Sayısı
                      </span>
                      <span className="course-detail-info-value">
                        {course.topics.length} Konu
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Card */}
              <div className="course-detail-sidebar-card course-detail-sidebar-cta">
                <h3>Hemen Başlayın</h3>
                <p>Kayıt olarak sertifikalı eğitim programına katılın.</p>
                <button className="primary-btn" style={{ width: "100%" }}>
                  Kayıt Ol
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="course-detail-related">
          <div className="container">
            <h2 className="course-detail-related-title">İlgili Eğitimler</h2>
            <div className="course-detail-related-grid">
              {relatedCourses.map((c) => (
                <Link href={`/kurslar/${c.slug}`} key={c.id} className="course-card">
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
                      {c.is_new && <span className="course-card-new">YENİ</span>}
                    </div>
                    <span className={`course-card-level level-${c.level.toLowerCase()}`}>
                      {c.level}
                    </span>
                  </div>
                  <div className="course-card-body">
                    <span className="course-card-category">{c.category?.name}</span>
                    <h3 className="course-card-title">{c.short_title}</h3>
                    <div className="course-card-meta">
                      <span className="course-card-meta-item">
                        <User size={14} />
                        {c.primary_instructor?.name}
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
