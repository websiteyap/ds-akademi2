"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, Youtube, ChevronRight, Send, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { Category, Course, SiteSettings } from '@/lib/types';

interface Props {
  courses: Course[];
  categories: Category[];
  settings: SiteSettings | null;
}

export default function Footer({ courses, categories, settings }: Props) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const hideFooterRoutes = ['/login', '/register'];
  if (hideFooterRoutes.includes(pathname) || pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-section" role="contentinfo" itemScope itemType="https://schema.org/Organization">

      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="container footer-newsletter-inner">
          <div className="footer-newsletter-text">
            <span className="footer-newsletter-badge">
              <Mail size={14} />
              BÜLTENİMİZE ABONE OLUN
            </span>
            <h3 className="footer-newsletter-title">Yapısal Mühendislik Dünyasından Haberdar Olun</h3>
            <p className="footer-newsletter-desc">
              Yeni eğitimler, erken kayıt indirimleri ve sektörel gelişmelerden ilk siz haberdar olun.
            </p>
          </div>
          <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="footer-newsletter-input-wrap">
              <Mail size={18} className="footer-newsletter-icon" />
              <input
                type="email"
                className="footer-newsletter-input"
                placeholder="E-posta adresinizi girin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="E-posta adresi"
              />
              <button type="submit" className="footer-newsletter-btn" aria-label="Abone ol">
                <Send size={18} />
                <span>Abone Ol</span>
              </button>
            </div>
            {subscribed && (
              <p className="footer-newsletter-success">✓ Başarıyla abone oldunuz! Teşekkürler.</p>
            )}
            <p className="footer-newsletter-privacy">
              Gizliliğinize saygı duyuyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container footer-container">

        {/* Kolon 1: Marka */}
        <div className="footer-col brand-col">
          <Link href="/" className="logo footer-logo" aria-label="DS Akademi Ana Sayfa">
            <Image src="/logo.png" alt="DS Akademi Logo" width={80} height={80} style={{ objectFit: 'contain' }} />
          </Link>
          <p className="footer-desc" itemProp="description">
            {settings?.footer_about ?? 'DS Akademi, Türkiye\'nin önde gelen üniversitelerinde aktif görev yapan akademisyenler tarafından kurulan yapısal mühendislik eğitim platformudur.'}
          </p>
          <div className="footer-socials">
            {(settings?.linkedin_url ?? 'https://linkedin.com') && (
              <a href={settings?.linkedin_url ?? 'https://linkedin.com'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon"><Linkedin size={18} /></a>
            )}
            {(settings?.instagram_url ?? 'https://instagram.com') && (
              <a href={settings?.instagram_url ?? 'https://instagram.com'} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon"><Instagram size={18} /></a>
            )}
            {(settings?.twitter_url ?? 'https://twitter.com') && (
              <a href={settings?.twitter_url ?? 'https://twitter.com'} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon"><Twitter size={18} /></a>
            )}
            {(settings?.youtube_url ?? 'https://youtube.com') && (
              <a href={settings?.youtube_url ?? 'https://youtube.com'} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon"><Youtube size={18} /></a>
            )}
          </div>
        </div>

        {/* Kolon 2: Eğitim Programları — DB'den kurslar */}
        <nav className="footer-col" aria-label="Eğitim Programları">
          <h4 className="footer-title">
            <BookOpen size={16} className="footer-title-icon" />
            Eğitim Programları
          </h4>
          <ul className="footer-links">
            {courses.map((course) => (
              <li key={course.slug}>
                <Link href={`/kurslar/${course.slug}`}>
                  <ChevronRight size={14} />
                  {course.short_title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kolon 3: Kategoriler — DB'den */}
        <nav className="footer-col" aria-label="Kategoriler">
          <h4 className="footer-title">
            <Building2 size={16} className="footer-title-icon" />
            Kategoriler
          </h4>
          <ul className="footer-links">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/kurslar?category=${encodeURIComponent(cat.name)}`}>
                  <ChevronRight size={14} />
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/hakkimizda"><ChevronRight size={14} /> Hakkımızda</Link>
            </li>
            <li>
              <Link href="/egitmenler"><ChevronRight size={14} /> Eğitmenlerimiz</Link>
            </li>
            <li>
              <Link href="/iletisim"><ChevronRight size={14} /> İletişim</Link>
            </li>
            <li>
              <Link href="/blog"><ChevronRight size={14} /> Blog</Link>
            </li>
          </ul>
        </nav>

        {/* Kolon 4: İletişim */}
        <div className="footer-col">
          <h4 className="footer-title">
            <GraduationCap size={16} className="footer-title-icon" />
            Bize Ulaşın
          </h4>
          <address className="footer-contact" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <div className="contact-item">
              <Phone size={16} />
              <a href={`tel:${(settings?.phone ?? '0 (850) 123 45 67').replace(/\s/g, '')}`} itemProp="telephone">{settings?.phone ?? '0 (850) 123 45 67'}</a>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <a href={`mailto:${settings?.email ?? 'info@dsakademi.com.tr'}`} itemProp="email">{settings?.email ?? 'info@dsakademi.com.tr'}</a>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span itemProp="streetAddress">{settings?.address_line1 ?? 'İTÜ Teknokent, Maslak / İstanbul'}{settings?.address_line2 ? `, ${settings.address_line2}` : ''}</span>
            </div>
          </address>

          {/* Güvenli Ödeme */}
          <div className="footer-payment" style={{ marginTop: '2.5rem' }}>
            <h5 className="footer-hours-title">Güvenli Ödeme</h5>
            <div className="payment-logos-wrap" style={{ marginTop: '0.5rem' }}>
              <Image
                src="/logo_band_white@1X.png"
                alt="Güvenli Ödeme"
                width={200} height={35}
                style={{ objectFit: 'contain' }}
                className="payment-logo dark-only"
              />
              <Image
                src="/logo_band_colored@1X.png"
                alt="Güvenli Ödeme"
                width={200} height={35}
                style={{ objectFit: 'contain' }}
                className="payment-logo light-only"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Footer Alt Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} DS Akademi. Tüm hakları saklıdır.</p>
          <nav className="footer-legal-links" aria-label="Yasal Bağlantılar">
            <Link href="/kullanim-kosullari">Kullanım Koşulları</Link>
            <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
            <Link href="/kvkk">KVKK Aydınlatma Metni</Link>
            <Link href="/cerez-politikasi">Çerez Politikası</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
