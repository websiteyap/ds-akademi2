"use client";

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.body.setAttribute('data-page', '404');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <div className="notfound-page">
      {/* Background glow effects matching the hero section */}
      <div className="hero-bg-elements">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="notfound-content">
        {/* Animated 404 number */}
        <div className="notfound-number">
          <span className="notfound-4">4</span>
          <span className="notfound-0">0</span>
          <span className="notfound-4-end">4</span>
        </div>

        <h1 className="notfound-title">Sayfa Bulunamadı</h1>
        <p className="notfound-desc">
          Aradığınız sayfa taşınmış, kaldırılmış veya hiç var olmamış olabilir.
          <br />
          Endişelenmeyin, sizi doğru yere yönlendirelim.
        </p>

        <div className="notfound-actions">
          <Link href="/" className="notfound-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Ana Sayfaya Dön
          </Link>
          <Link href="/kurslar" className="notfound-btn-secondary">
            Kursları Keşfet
          </Link>
        </div>

        {/* Blueprint-style decoration lines */}
        <div className="notfound-blueprint">
          <div className="bp-line bp-line-1"></div>
          <div className="bp-line bp-line-2"></div>
          <div className="bp-corner bp-corner-tl"></div>
          <div className="bp-corner bp-corner-tr"></div>
          <div className="bp-corner bp-corner-bl"></div>
          <div className="bp-corner bp-corner-br"></div>
        </div>
      </div>
    </div>
  );
}
