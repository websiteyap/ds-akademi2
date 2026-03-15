"use client";

import React, { useState } from 'react';
import { Search, Grid, Layers } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { Category, Course } from '@/lib/types';

interface Props {
  categories: Category[];
  courses: Course[];
}

export default function FilterBar({ categories }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (level) params.set("level", level);
    router.push(`/kurslar?${params.toString()}`);
  };

  return (
    <div className="filter-bar-wrapper">
      <div className="container">
        <form className="filter-grid" onSubmit={handleSearch}>

          <div className="filter-input-group">
            <div className="filter-icon">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Kurs, Eğitmen ara..."
              className="filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-input-group">
            <div className="filter-icon">
              <Grid size={20} />
            </div>
            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-input-group desktop-only">
            <div className="filter-icon">
              <Layers size={20} />
            </div>
            <select
              className="filter-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="" disabled>Seviye Seçin</option>
              <option value="Temel">Temel</option>
              <option value="Orta">Orta</option>
              <option value="İleri">İleri</option>
            </select>
          </div>

          <button type="submit" className="search-btn">ARA</button>

        </form>
      </div>
    </div>
  );
}
