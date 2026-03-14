"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, Youtube, ChevronRight, Send, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const hideFooterRoutes = ['/login', '/register'];
  if (hideFooterRoutes.includes(pathname)) {
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
        
        {/* Kolon 1: Marka & Hakkında */}
        <div className="footer-col brand-col">
          <Link href="/" className="logo footer-logo" aria-label="DS Akademi Ana Sayfa">
            <Image src="/logo.png" alt="DS Akademi Logo" width={80} height={80} style={{ objectFit: 'contain' }} />
          </Link>
          <p className="footer-desc" itemProp="description">
            DS Akademi, Türkiye'nin önde gelen üniversitelerinde aktif görev yapan akademisyenler tarafından kurulan yapısal mühendislik eğitim platformudur. TBDY 2018 standartlarında, performansa dayalı tasarım odaklı sertifikalı eğitimler sunmaktadır.
          </p>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon"><Linkedin size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon"><Instagram size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon"><Twitter size={18} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon"><Youtube size={18} /></a>
          </div>
        </div>

        {/* Kolon 2: Eğitim Programları (SEO) */}
        <nav className="footer-col" aria-label="Eğitim Programları">
          <h4 className="footer-title">
            <BookOpen size={16} className="footer-title-icon" />
            Eğitim Programları
          </h4>
          <ul className="footer-links">
            <li><Link href="#"><ChevronRight size={14}/> Temel Çelik Yapı Tasarımı</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Temel Betonarme Yapı Tasarımı</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Depreme Dayanıklı Çelik Tasarım</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Depreme Dayanıklı Betonarme Tasarım</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Performansa Dayalı Yapı Analizi</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Yapısal Ahşap Tasarım</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Bina Bilgi Modelleme (BIM)</Link></li>
          </ul>
        </nav>

        {/* Kolon 3: Kurumsal */}
        <nav className="footer-col" aria-label="Kurumsal">
          <h4 className="footer-title">
            <Building2 size={16} className="footer-title-icon" />
            Kurumsal
          </h4>
          <ul className="footer-links">
            <li><Link href="/hakkimizda"><ChevronRight size={14}/> Hakkımızda</Link></li>
            <li><Link href="/#instructors"><ChevronRight size={14}/> Eğitmenlerimiz</Link></li>
            <li><Link href="/#faq"><ChevronRight size={14}/> Sıkça Sorulan Sorular</Link></li>
            <li><Link href="/iletisim"><ChevronRight size={14}/> İletişim</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Kariyer</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Blog</Link></li>
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
              <a href="tel:+908501234567" itemProp="telephone">0 (850) 123 45 67</a>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <a href="mailto:info@dsakademi.com.tr" itemProp="email">info@dsakademi.com.tr</a>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span itemProp="streetAddress">İTÜ Teknokent, Maslak / İstanbul</span>
            </div>
          </address>

          {/* Çalışma Saatleri */}
          <div className="footer-hours">
            <h5 className="footer-hours-title">Çalışma Saatleri</h5>
            <p>Pazartesi - Cuma: 09:00 - 18:00</p>
            <p>Cumartesi: 10:00 - 14:00</p>
          </div>
        </div>

      </div>

      {/* Footer Alt Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} DS Akademi. Tüm hakları saklıdır.</p>
          <nav className="footer-legal-links" aria-label="Yasal Bağlantılar">
            <Link href="#">Kullanım Koşulları</Link>
            <Link href="#">Gizlilik Politikası</Link>
            <Link href="#">KVKK Aydınlatma Metni</Link>
            <Link href="#">Çerez Politikası</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
