"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Columns3, Building2, BarChart3, TreePine, Box,
  Search, X, Grid, ChevronRight, BookOpen, Users,
  Layers, GraduationCap, ArrowRight, Clock, User,
} from "lucide-react";
import type { Category, Course } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  Columns3, Building2, BarChart3, TreePine, Box,
};

interface Props {
  categories: Category[];
  courses: Course[];
  totalInstructors: number;
}

export default function CategoriesClient({ categories, courses, totalInstructors }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  return (
    <section className="categories-page">
      <Breadcrumb items={[{ label: "Kategoriler" }]} />

      {/* Page Header */}
      <div className="categories-page-header">
        <div className="container">
          <div className="categories-header-content">
            <span className="categories-header-badge">
              <Grid size={14} />
              EĞİTİM KATEGORİLERİ
            </span>
            <h1 className="categories-header-title">
              Eğitim <span className="text-gradient">Kategorilerimiz</span>
            </h1>
            <p className="categories-header-desc">
              Yapısal mühendislik alanında uzmanlaşmış {categories.length}{" "}
              farklı kategoride, {courses.length} profesyonel eğitim programı
            </p>
          </div>

          {/* Stats Strip */}
          <div className="categories-stats-strip">
            <div className="categories-stat-item">
              <GraduationCap size={20} />
              <div>
                <strong>{courses.length}</strong>
                <span>Toplam Kurs</span>
              </div>
            </div>
            <div className="categories-stat-item">
              <Grid size={20} />
              <div>
                <strong>{categories.length}</strong>
                <span>Kategori</span>
              </div>
            </div>
            <div className="categories-stat-item">
              <Users size={20} />
              <div>
                <strong>{totalInstructors}</strong>
                <span>Uzman Eğitmen</span>
              </div>
            </div>
            <div className="categories-stat-item">
              <Layers size={20} />
              <div>
                <strong>3</strong>
                <span>Seviye</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Search Bar */}
        <div className="categories-toolbar">
          <div className="categories-search-wrap">
            <Search size={18} className="categories-search-icon" />
            <input
              type="text"
              className="categories-search-input"
              placeholder="Kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="categories-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Aramayı temizle"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <span className="categories-result-count">
            <BookOpen size={16} />
            <strong>{filteredCategories.length}</strong> kategori
          </span>
        </div>

        {/* Category Cards Grid */}
        <div className="categories-grid">
          {filteredCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || Grid;
            const categoryCourses = courses.filter(
              (c) => c.category?.name === category.name
            );
            const categoryInstructors = new Set(
              categoryCourses.map((c) => c.primary_instructor?.id).filter(Boolean)
            );
            const categoryLevels = [...new Set(categoryCourses.map((c) => c.level))];

            return (
              <div key={category.slug} className="category-card">
                {/* Card Header with gradient */}
                <div
                  className="category-card-header"
                  style={{ background: category.bg_gradient ?? "" }}
                >
                  <div
                    className="category-card-icon"
                    style={{
                      background: category.color,
                      boxShadow: `0 4px 20px ${category.color}40`,
                    }}
                  >
                    <IconComponent size={24} color="#fff" />
                  </div>
                  <div className="category-card-header-info">
                    <h2 className="category-card-name">{category.name}</h2>
                    <div className="category-card-stats">
                      <span className="category-card-stat">
                        <BookOpen size={13} />
                        {category.courseCount} Kurs
                      </span>
                      <span className="category-card-stat">
                        <Users size={13} />
                        {categoryInstructors.size} Eğitmen
                      </span>
                    </div>
                  </div>
                  {/* Level badges */}
                  <div className="category-card-levels">
                    {categoryLevels.map((lvl) => (
                      <span
                        key={lvl}
                        className={`category-level-badge level-${lvl.toLowerCase()}`}
                      >
                        {lvl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Body */}
                <div className="category-card-body">
                  <p className="category-card-desc">{category.description}</p>

                  {/* Course preview list */}
                  <div className="category-course-list">
                    <h4 className="category-course-list-title">
                      <GraduationCap size={14} />
                      Bu Kategorideki Kurslar
                    </h4>
                    {categoryCourses.map((course) => (
                      <Link
                        href={`/kurslar/${course.slug}`}
                        key={course.id}
                        className="category-course-preview"
                      >
                        <div className="category-course-preview-img">
                          <Image
                            src={course.image}
                            alt={course.short_title}
                            fill
                            sizes="60px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="category-course-preview-info">
                          <span className="category-course-preview-code">
                            {course.code}
                          </span>
                          <strong>{course.short_title}</strong>
                          <div className="category-course-preview-meta">
                            <span>
                              <User size={11} />
                              {course.primary_instructor?.name}
                            </span>
                            <span>
                              <Clock size={11} />
                              {course.duration}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="category-course-preview-arrow" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="category-card-footer">
                  <Link
                    href={`/kurslar?category=${encodeURIComponent(category.name)}`}
                    className="category-card-cta"
                    style={{ "--cat-color": category.color } as React.CSSProperties}
                  >
                    <span>Tüm Kursları Gör</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="categories-empty">
            <Search size={48} />
            <h3>Sonuç Bulunamadı</h3>
            <p>Arama kriterlerinize uygun kategori bulunamadı. Farklı kelimeler deneyin.</p>
            <button className="courses-clear-btn" onClick={() => setSearchQuery("")}>
              Aramayı Temizle
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
