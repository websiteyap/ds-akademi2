"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Menu, X, Sun, Moon, ChevronDown, ChevronRight, Layers, BarChart3, Search, Grid, Linkedin, Instagram, Twitter } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import type { Category, Course, Instructor } from '@/lib/types';

interface NavbarProps {
  categories: Category[];
  courses: Course[];
  instructors: Instructor[];
}

export default function Navbar({ categories, courses, instructors }: NavbarProps) {
  const [activeTab, setActiveTab] = useState('Kurslar');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [mobSearch, setMobSearch] = useState("");
  const [mobCategory, setMobCategory] = useState("");
  const [mobLevel, setMobLevel] = useState("");

  // Dynamic mega menu groups derived from DB courses
  const megaCourses = useMemo(() => [
    {
      group: 'Çelik ve Ahşap Yapılar',
      items: courses.filter(c => {
        const cat = c.category?.name ?? '';
        return cat.includes('Çelik') || cat.includes('Ahşap');
      }),
    },
    {
      group: 'Betonarme ve Performans',
      items: courses.filter(c => {
        const cat = c.category?.name ?? '';
        return cat.includes('Betonarme') || cat.includes('Performans') || cat.includes('BIM');
      }),
    },
  ], [courses]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Hide navbar on auth pages and dashboard
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard')) {
    return null;
  }

  const menuItems = [
    { name: 'Kurslar', hasMegaMenu: true, href: '/kurslar' },
    { name: 'Kategoriler', hasMegaMenu: true, href: '/kategoriler' },
    { name: 'Eğitmenler', hasMegaMenu: true, href: '/egitmenler' },
    { name: 'Hakkımızda', hasMegaMenu: false, href: '/hakkimizda' },
    { name: 'İletişim', hasMegaMenu: false, href: '/iletisim' },
  ];

  const toggleMobileExpand = (name: string) => {
    setMobileExpanded(mobileExpanded === name ? null : name);
  };

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container">
          <div className="top-bar">
            
            <div className="nav-left-group">
              <Link href="/" className="logo">
                <img src="/logo.png" alt="DS Akademi Logo" style={{ height: '72px', width: 'auto' }} />
              </Link>
              
              {/* Desktop Nav */}
              <nav className="desktop-nav-menu">
                {menuItems.map((item) => (
                  <div 
                    key={item.name} 
                    className={`desktop-nav-link ${activeTab === item.name ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.name)}
                  >
                    {item.hasMegaMenu ? (
                      <span className="nav-link-text">
                        {item.name}
                        <ChevronDown size={14} className="nav-chevron" />
                      </span>
                    ) : (
                      <Link href={item.href} className="nav-link-text">
                        {item.name}
                      </Link>
                    )}
                    
                    {/* Mega Menu Dropdown */}
                    {item.hasMegaMenu && (
                      <div className={`mega-menu-dropdown ${item.name === 'Kurslar' ? 'mega-courses' : 'mega-simple'}`}>
                        
                        {item.name === 'Kurslar' && (
                          <div className="mega-courses-content">
                            {megaCourses.map((group) => (
                              <div key={group.group} className="mega-course-group">
                                <h4 className="mega-course-group-title">{group.group}</h4>
                                <ul className="mega-course-list">
                                  {group.items.map((course) => (
                                    <li key={course.slug} className="mega-course-item">
                                      <div className="mega-course-icon">
                                        <BarChart3 size={16} />
                                      </div>
                                      <div className="mega-course-info">
                                        <Link href={`/kurslar/${course.slug}`} className="mega-course-name-row" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setMobileExpanded(null)}>
                                          <strong>{course.short_title}</strong>
                                          {course.is_new && <span className="mega-course-badge">Yeni</span>}
                                        </Link>
                                        <div className="mega-course-meta">
                                          <span><Layers size={11} /> {course.level}</span>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {item.name === 'Kategoriler' && (
                          <ul className="mega-simple-list">
                            {categories.map((cat) => (
                              <li key={cat.slug}>
                                <Link 
                                  href={`/kurslar?category=${encodeURIComponent(cat.name)}`} 
                                  className="mega-simple-link"
                                >
                                  {cat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}

                        {item.name === 'Eğitmenler' && (
                          <ul className="mega-simple-list">
                            {instructors.map((ins) => (
                              <li key={ins.slug}>
                                <Link href={`/egitmenler/${ins.slug}`} className="mega-simple-link">
                                  {ins.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}

                      </div>
                    )}
                    
                  </div>
                ))}
              </nav>
            </div>
            
            <div className="top-actions">
              <button 
                className="icon-btn theme-toggle-btn" 
                aria-label="Tema Değiştir"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
              >
                {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
              </button>
              <Link href="/login" className="icon-btn desktop-only" aria-label="Login">
                <User size={24} />
              </Link>
              <button 
                className="icon-btn mobile-menu-trigger" 
                aria-label="Menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY + DRAWER */}
      <div className={`mob-overlay ${mobileOpen ? 'mob-overlay--open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`mob-drawer ${mobileOpen ? 'mob-drawer--open' : ''}`}>
        
        {/* Drawer Header */}
        <div className="mob-drawer-header">
          <img src="/logo.png" alt="DS Akademi" className="mob-drawer-logo" />
          <button className="mob-close-btn" onClick={() => setMobileOpen(false)} aria-label="Kapat">
            <X size={22} />
          </button>
        </div>

        {/* Search Bar */}
        <form 
          className="mob-search"
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams();
            if (mobSearch) params.set("search", mobSearch);
            if (mobCategory) params.set("category", mobCategory);
            if (mobLevel) params.set("level", mobLevel);
            setMobileOpen(false);
            router.push(`/kurslar?${params.toString()}`);
          }}
        >
          <div className="mob-search-field">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Kurs, Eğitmen ara..." 
              value={mobSearch}
              onChange={(e) => setMobSearch(e.target.value)}
            />
          </div>
          <div className="mob-filter-row">
            <div className="mob-filter-select-wrap">
              <Grid size={14} />
              <select value={mobCategory} onChange={(e) => setMobCategory(e.target.value)}>
                <option value="" disabled>Kategori</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="mob-filter-select-wrap">
              <Layers size={14} />
              <select value={mobLevel} onChange={(e) => setMobLevel(e.target.value)}>
                <option value="" disabled>Alan</option>
                <option value="Temel">Temel</option>
                <option value="Orta">Orta</option>
                <option value="İleri">İleri</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{ display: 'none' }}>Ara</button>
        </form>

        {/* Nav Links */}
        <nav className="mob-nav">
          {menuItems.map((item) => (
            <div key={item.name} className="mob-nav-group">
              {item.hasMegaMenu ? (
                <>
                  <button 
                    className="mob-nav-link" 
                    onClick={() => toggleMobileExpand(item.name)}
                  >
                    <span>{item.name}</span>
                    <ChevronDown 
                      size={16} 
                      style={{ 
                        transform: mobileExpanded === item.name ? 'rotate(180deg)' : 'rotate(0)', 
                        transition: 'transform 0.2s ease' 
                      }} 
                    />
                  </button>
                  {mobileExpanded === item.name && (
                    <div className="mob-submenu">
                      {item.name === 'Kurslar' && megaCourses.map((group) => (
                        <div key={group.group} className="mob-submenu-group">
                          {group.items.map((course) => (
                            <Link 
                              key={course.slug} 
                              href={`/kurslar/${course.slug}`} 
                              className="mob-submenu-link"
                              onClick={() => setMobileOpen(false)}
                            >
                              <span>{course.short_title}</span>
                              {course.is_new && <span className="mob-badge">Yeni</span>}
                            </Link>
                          ))}
                        </div>
                      ))}
                      {item.name === 'Kategoriler' && categories.map((cat) => (
                        <Link 
                          key={cat.slug} 
                          href={`/kurslar?category=${encodeURIComponent(cat.name)}`} 
                          className="mob-submenu-link"
                          onClick={() => setMobileOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                      {item.name === 'Eğitmenler' && instructors.map((ins) => (
                        <Link 
                          key={ins.slug} 
                          href={`/egitmenler/${ins.slug}`} 
                          className="mob-submenu-link"
                          onClick={() => setMobileOpen(false)}
                        >
                          {ins.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  href={item.href} 
                  className="mob-nav-link" 
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{item.name}</span>
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="mob-auth">
          <Link href="/login" className="mob-auth-btn mob-auth-login" onClick={() => setMobileOpen(false)}>
            Giriş Yap
          </Link>
          <Link href="/register" className="mob-auth-btn mob-auth-register" onClick={() => setMobileOpen(false)}>
            Kayıt Ol
          </Link>
        </div>

        {/* Footer: Social + Theme */}
        <div className="mob-drawer-footer">
          <div className="mob-socials">
            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
          </div>
          <button className="mob-theme-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
          </button>
        </div>

      </div>
    </>
  );
}
