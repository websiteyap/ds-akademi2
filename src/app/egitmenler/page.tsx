import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { instructors } from '@/data/instructors';
import Breadcrumb from '@/components/Breadcrumb';
import { Award, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Akademik Kadromuz | DS Akademi',
  description: 'DS Akademi\'nin alanında uzman akademisyen ve mühendis kadrosu ile tanışın. TBDY 2018 standartlarında yapısal mühendislik eğitimlerinin öncü isimleri.',
};

export default function InstructorsPage() {
  return (
    <main className="instructors-index-page">
      <Breadcrumb items={[{ label: 'Eğitmenler' }]} />
      
      <section className="page-hero">
        <div className="hero-bg-elements">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="container page-hero-inner">
          <span className="page-hero-badge">AKADEMİK KADRO</span>
          <h1 className="page-hero-title">Uzmanlarla Geleceği İnşa Edin</h1>
          <p className="page-hero-desc">
            Sektörün ve akademinin önde gelen isimlerinden oluşan eğitim kadromuzla tanışın.
          </p>
        </div>
      </section>

      <section className="instructors-list-section">
        <div className="container">
          <div className="instructors-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '4rem 0'
          }}>
            {instructors.map(instructor => (
              <Link key={instructor.id} href={`/egitmenler/${instructor.slug}`} className="instructor-index-card">
                <div className="instructor-index-img-wrap">
                  <Image 
                    src={instructor.image} 
                    alt={instructor.name} 
                    fill 
                    className="instructor-index-img" 
                    sizes="(max-width: 768px) 100vw, 300px" 
                  />
                  <div className="instructor-index-overlay">
                     <span>Profili Görüntüle <ChevronRight size={16} /></span>
                  </div>
                </div>
                <div className="instructor-index-body">
                  <div className="instructor-index-title-wrap">
                     <Award size={18} />
                     <span>{instructor.title}</span>
                  </div>
                  <h3>{instructor.name}</h3>
                  <p>{instructor.department}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
