import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Target, BookOpen, Users, Award, ShieldCheck, Cpu, Clock, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hakkımızda | DS Akademi',
  description: 'DS Akademi, Türkiye\'nin önde gelen akademisyenleriyle yapısal mühendislik alanında performansa dayalı tasarım eğitimleri sunar.',
};

const stats = [
  { num: '7/24', label: 'Sınırsız Erişim', icon: Clock },
  { num: '12', label: 'Eğitim Programı', icon: BookOpen },
  { num: '5', label: 'Uzman Eğitmen', icon: Users },
  { num: '%98', label: 'Memnuniyet Oranı', icon: TrendingUp },
];

const values = [
  {
    icon: Target,
    title: 'Akademik Kalite',
    desc: 'Tüm eğitimlerimiz alanında uzman akademisyenler tarafından, güncel bilimsel araştırmalar ve standartlar ışığında hazırlanmaktadır.',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenilir İçerik',
    desc: 'TBDY 2018, Eurocode ve uluslararası standartlara uyumlu, sektör tarafından kabul görmüş içerikler sunuyoruz.',
  },
  {
    icon: Cpu,
    title: 'Uygulamalı Eğitim',
    desc: 'Teorik bilgiyi pratiğe dönüştüren, gerçek proje örnekleri ve hesap uygulamaları ile desteklenen müfredat.',
  },
  {
    icon: Award,
    title: 'Sertifikalı Program',
    desc: 'Eğitimlerimizi başarıyla tamamlayan katılımcılara tanınmış sertifikalar ve kariyer desteği sağlıyoruz.',
  },
];
import Breadcrumb from '@/components/Breadcrumb';

export default function AboutPage() {
  return (
    <main>
      <Breadcrumb items={[{ label: 'Hakkımızda' }]} />
      {/* Hero Banner */}
      <section className="page-hero">
        <div className="hero-bg-elements">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="container page-hero-inner">
          <span className="page-hero-badge">HAKKIMIZDA</span>
          <h1 className="page-hero-title">Yapısal Mühendislikte Eğitimin Geleceği</h1>
          <p className="page-hero-desc">
            DS Akademi, Türkiye'nin önde gelen akademisyenleriyle inşaat mühendislerine 
            TBDY 2018 standartlarında performansa dayalı tasarım eğitimleri sunar.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="about-stats-bar">
        <div className="container about-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="page-stat-item">
              <div className="page-stat-icon">
                <s.icon size={26} strokeWidth={2.5} />
              </div>
              <div className="page-stat-info">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission-section">
        <div className="container about-mission-grid">
          <div className="about-mission-img">
            <Image 
              src="/logo.png" 
              alt="DS Akademi" 
              width={200} 
              height={200} 
              style={{ objectFit: 'contain', opacity: 0.9 }} 
            />
          </div>
          <div className="about-mission-text">
            <span className="page-hero-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>MİSYONUMUZ</span>
            <h2 className="about-mission-title">Mühendisliği Dönüştüren Eğitim</h2>
            <p>
              DS Akademi olarak amacımız, yapısal mühendislik alanında teorik bilgiyi pratiğe dönüştüren, 
              uluslararası standartlara uygun ve güncel eğitim programları sunmaktır.
            </p>
            <p>
              Eğitimlerimiz; çelik yapı tasarımı, betonarme tasarımı, ahşap yapı tasarımı, 
              performansa dayalı tasarım ve güçlendirme projeleri gibi geniş bir yelpazede, 
              Türkiye'nin en yetkin akademisyenleri tarafından hazırlanmaktadır.
            </p>
            <p>
              Her bir müfredatımız, gerçek dünya problemleri üzerinden kurgulanmış olup 
              hesap uygulamaları, yazılım kullanımı ve proje çalışmalarıyla desteklenmektedir.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values-section">
        <div className="container">
          <div className="about-values-header">
            <span className="page-hero-badge">DEĞERLERİMİZ</span>
            <h2 className="about-values-title">Neden DS Akademi?</h2>
            <p className="about-values-desc">
              Eğitim anlayışımızı şekillendiren temel ilkelerimiz
            </p>
          </div>

          <div className="about-values-grid">
            {values.map((v, i) => (
              <div key={i} className="about-value-card">
                <div className="about-value-icon">
                  <v.icon size={24} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="container about-cta-inner">
          <h2>Kariyerinize Yön Vermeye Hazır Mısınız?</h2>
          <p>Türkiye'nin en kapsamlı yapısal mühendislik eğitim platformuna katılın.</p>
          <div className="about-cta-buttons">
            <Link href="/kurslar" className="about-cta-primary">Eğitimleri Keşfet</Link>
            <Link href="/iletisim" className="about-cta-secondary">Bize Ulaşın</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
