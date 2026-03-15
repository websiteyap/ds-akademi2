"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Target, BookOpen, Users, Award, ShieldCheck, Cpu, Clock, TrendingUp } from 'lucide-react';
import type { AboutSection, SiteSettings } from '@/lib/types';
import Breadcrumb from '@/components/Breadcrumb';

interface Props {
  sections: AboutSection[];
  settings: SiteSettings | null;
}

// Map icon name from DB → Lucide component
const iconMap: Record<string, React.ElementType> = {
  Target, BookOpen, Users, Award, ShieldCheck, Cpu, Clock, TrendingUp,
};

export default function AboutClient({ sections, settings }: Props) {
  const stats = sections.filter(s => s.section === 'stat');
  const missionParas = sections.filter(s => s.section === 'mission_paragraph');
  const values = sections.filter(s => s.section === 'value');

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
          <h1 className="page-hero-title">
            {settings?.tagline ?? 'Yapısal Mühendislikte Eğitimin Geleceği'}
          </h1>
          <p className="page-hero-desc">
            DS Akademi, Türkiye&apos;nin önde gelen akademisyenleriyle inşaat mühendislerine
            TBDY 2018 standartlarında performansa dayalı tasarım eğitimleri sunar.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      {stats.length > 0 && (
        <section className="about-stats-bar">
          <div className="container about-stats-grid">
            {stats.map((s) => {
              const Icon = (s.icon ? iconMap[s.icon] : null) ?? Clock;
              return (
                <div key={s.id} className="page-stat-item">
                  <div className="page-stat-icon">
                    <Icon size={26} strokeWidth={2.5} />
                  </div>
                  <div className="page-stat-info">
                    <strong>{s.title}</strong>
                    <span>{s.content}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Mission Section */}
      {missionParas.length > 0 && (
        <section className="about-mission-section">
          <div className="container about-mission-grid">
            <div className="about-mission-img">
              <Image
                src={settings?.site_logo ?? '/logo.png'}
                alt={settings?.site_name ?? 'DS Akademi'}
                width={200} height={200}
                style={{ objectFit: 'contain', opacity: 0.9 }}
              />
            </div>
            <div className="about-mission-text">
              <span className="page-hero-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>MİSYONUMUZ</span>
              {missionParas.map((p, i) => (
                i === 0 && p.title
                  ? <h2 key={p.id} className="about-mission-title">{p.title}</h2>
                  : null
              ))}
              {missionParas.map((p) => (
                <p key={p.id}>{p.content}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {values.length > 0 && (
        <section className="about-values-section">
          <div className="container">
            <div className="about-values-header">
              <span className="page-hero-badge">DEĞERLERİMİZ</span>
              <h2 className="about-values-title">Neden DS Akademi?</h2>
              <p className="about-values-desc">Eğitim anlayışımızı şekillendiren temel ilkelerimiz</p>
            </div>
            <div className="about-values-grid">
              {values.map((v) => {
                const Icon = (v.icon ? iconMap[v.icon] : null) ?? Target;
                return (
                  <div key={v.id} className="about-value-card">
                    <div className="about-value-icon">
                      <Icon size={24} />
                    </div>
                    <h3>{v.title}</h3>
                    <p>{v.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="container about-cta-inner">
          <h2>Kariyerinize Yön Vermeye Hazır Mısınız?</h2>
          <p>Türkiye&apos;nin en kapsamlı yapısal mühendislik eğitim platformuna katılın.</p>
          <div className="about-cta-buttons">
            <Link href="/kurslar" className="about-cta-primary">Eğitimleri Keşfet</Link>
            <Link href="/iletisim" className="about-cta-secondary">Bize Ulaşın</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
