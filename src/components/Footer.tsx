import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-container">
        
        {/* Kolon 1: Logo & Hakkında */}
        <div className="footer-col brand-col">
          <div className="logo footer-logo">
            DS <span className="logo-accent">AKADEMİ</span>
          </div>
          <p className="footer-desc">
            Türkiye'nin önde gelen akademisyenleriyle, yeni nesil ve güvenli yapılar inşa etmek isteyen inşaat mühendisleri için TBDY 2018 standartlarında performonsa dayalı tasarım eğitimleri.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="LinkedIn" className="social-icon"><Linkedin size={18} /></a>
            <a href="#" aria-label="Instagram" className="social-icon"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter" className="social-icon"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Kolon 2: Hızlı Linkler */}
        <div className="footer-col">
          <h4 className="footer-title">Hızlı Erişim</h4>
          <ul className="footer-links">
            <li><Link href="#"><ChevronRight size={14}/> Hakkımızda</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Eğitmenlerimiz</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Sıkça Sorulan Sorular</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Referanslar</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Bize Ulaşın</Link></li>
          </ul>
        </div>

        {/* Kolon 3: Kurslar (SEO Uyumlu) */}
        <div className="footer-col">
          <h4 className="footer-title">Eğitim Programları</h4>
          <ul className="footer-links">
            <li><Link href="#"><ChevronRight size={14}/> Çelik Yapı Tasarımı</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Betonarme Tasarımı</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Yapısal Ahşap Tasarımı</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> Performansa Dayalı (DD) Analiz</Link></li>
            <li><Link href="#"><ChevronRight size={14}/> İleri Bina Bilgi Modelleme (BIM)</Link></li>
          </ul>
        </div>

        {/* Kolon 4: İletişim */}
        <div className="footer-col">
          <h4 className="footer-title">Bize Ulaşın</h4>
          <div className="footer-contact">
            <div className="contact-item">
              <Phone size={16} />
              <span>0 (850) 123 45 67</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>info@dsakademi.com.tr</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>İTÜ Teknokent, Maslak / İstanbul</span>
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} DS Akademi. Tüm hakları saklıdır.</p>
          <div className="footer-legal-links">
            <Link href="#">Kullanım Koşulları</Link>
            <Link href="#">Gizlilik Politikası</Link>
            <Link href="#">KVKK Aydınlatma Metni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
