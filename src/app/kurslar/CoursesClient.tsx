"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Search,
  Grid,
  Layers,
  Clock,
  User,
  BookOpen,
  ChevronRight,
  SlidersHorizontal,
  X,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { Course } from "@/lib/types";

interface Props {
  courses: Course[];
  categoryNames: string[];
  levels: string[];
}

export default function CoursesClient({ courses, categoryNames, levels }: Props) {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (searchParams.has("search")) setSearchQuery(searchParams.get("search") || "");
    if (searchParams.has("category")) setSelectedCategory(searchParams.get("category") || "");
    if (searchParams.has("level")) setSelectedLevel(searchParams.get("level") || "");
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const instructorName = course.primary_instructor?.name ?? "";
      const categoryName = course.category?.name ?? "";

      const matchSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        !selectedCategory || categoryName === selectedCategory;

      const matchLevel = !selectedLevel || course.level === selectedLevel;

      return matchSearch && matchCategory && matchLevel;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLevel("");
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedLevel;

  return (
    <section className="courses-page">
      <Breadcrumb items={[{ label: "Kurslar" }]} />
      {/* Page Header */}
      <div className="courses-page-header">
        <div className="container">
          <div className="courses-header-content">
            <span className="courses-header-badge">
              <GraduationCap size={14} />
              EĞİTİM PROGRAMLARI
            </span>
            <h1 className="courses-header-title">
              Tüm <span className="text-gradient">Kurslarımız</span>
            </h1>
            <p className="courses-header-desc">
              TBDY 2018 standartlarında, akademisyenler tarafından hazırlanmış{" "}
              {courses.length} profesyonel yapısal mühendislik eğitimi
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filter & Search Bar */}
        <div className="courses-toolbar">
          <div className="courses-search-wrap">
            <Search size={18} className="courses-search-icon" />
            <input
              type="text"
              className="courses-search-input"
              placeholder="Kurs adı, eğitmen veya kod ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="courses-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Aramayı temizle"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="courses-filters-desktop">
            <div className="courses-filter-select-wrap">
              <Grid size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="courses-filter-select"
              >
                <option value="">Tüm Kategoriler</option>
                {categoryNames.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="courses-filter-select-wrap">
              <Layers size={16} />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="courses-filter-select"
              >
                <option value="">Tüm Seviyeler</option>
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="courses-filter-mobile-btn"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal size={18} />
            Filtrele
          </button>
        </div>

        {/* Mobile Filters */}
        {mobileFilterOpen && (
          <div className="courses-filters-mobile">
            <div className="courses-filter-select-wrap">
              <Grid size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="courses-filter-select"
              >
                <option value="">Tüm Kategoriler</option>
                {categoryNames.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="courses-filter-select-wrap">
              <Layers size={16} />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="courses-filter-select"
              >
                <option value="">Tüm Seviyeler</option>
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filters + Results Count */}
        <div className="courses-status-bar">
          <span className="courses-result-count">
            <BookOpen size={16} />
            <strong>{filteredCourses.length}</strong> kurs bulundu
          </span>
          {hasActiveFilters && (
            <button className="courses-clear-btn" onClick={clearFilters}>
              <X size={14} />
              Filtreleri Temizle
            </button>
          )}
        </div>

        {/* Course Grid */}
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <Link href={`/kurslar/${course.slug}`} key={course.id} className="course-card">
              <div className="course-card-img-wrap">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="course-card-img"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="course-card-overlay" />
                <div className="course-card-badges">
                  <span className="course-card-code">{course.code}</span>
                  {course.is_new && <span className="course-card-new">YENİ</span>}
                </div>
                <span className={`course-card-level level-${course.level.toLowerCase()}`}>
                  {course.level}
                </span>
              </div>

              <div className="course-card-body">
                <span className="course-card-category">{course.category?.name}</span>
                <h3 className="course-card-title">{course.short_title}</h3>

                <div className="course-card-meta">
                  <span className="course-card-meta-item">
                    <User size={14} />
                    {course.primary_instructor?.name}
                  </span>
                  <span className="course-card-meta-item">
                    <Clock size={14} />
                    {course.duration}
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

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="courses-empty">
            <BarChart3 size={48} />
            <h3>Sonuç Bulunamadı</h3>
            <p>Arama kriterlerinize uygun kurs bulunamadı. Filtreleri değiştirmeyi deneyin.</p>
            <button className="courses-clear-btn" onClick={clearFilters}>
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
