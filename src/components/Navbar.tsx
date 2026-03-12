"use client";

import React, { useState } from 'react';
import { Search, User, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('Kurslar');
  const { theme, toggleTheme } = useTheme();

  const links = ['Kurslar', 'Kategoriler', 'Eğitmenler', 'Hakkımızda'];

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <div className="top-bar">
          <div className="logo">
            DS <span className="logo-accent">AKADEMİ</span>
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
            <button className="icon-btn" aria-label="Search">
              <Search size={24} />
            </button>
            <button className="icon-btn" aria-label="Login">
              <User size={24} />
            </button>
            <button className="icon-btn mobile-only" aria-label="Menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="nav-links container">
        {links.map((link) => (
          <div 
            key={link} 
            className={`nav-link ${activeTab === link ? 'active' : ''}`}
            onClick={() => setActiveTab(link)}
          >
            {link}
          </div>
        ))}
      </div>
    </header>
  );
}
