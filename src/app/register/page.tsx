"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-page', 'auth');
    return () => { document.body.removeAttribute('data-page'); };
  }, []);

  return (
    <div className="auth-page-container">
      {/* Background glow effects matching the hero section */}
      <div className="hero-bg-elements">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="auth-card">
        {/* Logo inside card */}
        <Link href="/" className="auth-logo">
          <Image src="/logo.png" alt="DS Akademi Logo" width={96} height={96} className="auth-logo-img" />
        </Link>

        <div className="auth-header">
          <h1 className="auth-title">Hesap Oluştur</h1>
          <p className="auth-subtitle">DS Akademi'ye katılarak kariyerinize yön verin</p>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="name">Ad Soyad</label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={18} />
              <input 
                type="text" 
                id="name" 
                className="auth-input" 
                placeholder="Örn: Ahmet Yılmaz" 
                required 
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="email">E-posta Adresi</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input 
                type="email" 
                id="email" 
                className="auth-input" 
                placeholder="ornek@email.com" 
                required 
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="password">Şifre</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="auth-input" 
                placeholder="En az 8 karakter" 
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="checkbox-group">
              <input type="checkbox" required />
              <span className="checkbox-label" style={{ fontSize: '0.8rem' }}>
                <Link href="#" className="forgot-link">Kullanıcı Sözleşmesi</Link>'ni okudum ve kabul ediyorum.
              </span>
            </label>
          </div>

          <button type="submit" className="auth-submit-btn">
            Kayıt Ol
          </button>
        </form>

        <div className="auth-divider">
          <span>VEYA</span>
        </div>

        <button type="button" className="social-login-btn">
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google ile Kayıt Ol
        </button>

        <div className="auth-footer">
          Zaten hesabınız var mı? 
          <Link href="/login" className="auth-footer-link">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
}
