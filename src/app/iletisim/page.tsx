import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'İletişim | DS Akademi',
  description: 'DS Akademi ile iletişime geçin. Sorularınız, önerileriniz ve kurumsal eğitim talepleriniz için bize ulaşın.',
};

export default function ContactPage() {
  return (
    <main>
      {/* Hero Banner */}
      <section className="page-hero">
        <div className="hero-bg-elements">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="container page-hero-inner">
          <span className="page-hero-badge">İLETİŞİM</span>
          <h1 className="page-hero-title">Bizimle İletişime Geçin</h1>
          <p className="page-hero-desc">
            Sorularınız, önerileriniz veya kurumsal eğitim talepleriniz için bize ulaşın. 
            En kısa sürede size dönüş yapacağız.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-section">
        <div className="container contact-grid">
          
          {/* Contact Info Cards */}
          <div className="contact-info-side">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Phone size={22} />
              </div>
              <div className="contact-info-text">
                <h3>Telefon</h3>
                <p>0 (850) 123 45 67</p>
                <span>Hafta içi 09:00 – 18:00</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Mail size={22} />
              </div>
              <div className="contact-info-text">
                <h3>E-posta</h3>
                <p>info@dsakademi.com.tr</p>
                <span>24 saat içinde dönüş</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <MapPin size={22} />
              </div>
              <div className="contact-info-text">
                <h3>Adres</h3>
                <p>İTÜ Teknokent, Maslak</p>
                <span>Sarıyer / İstanbul</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Clock size={22} />
              </div>
              <div className="contact-info-text">
                <h3>Çalışma Saatleri</h3>
                <p>Pazartesi – Cuma</p>
                <span>09:00 – 18:00</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-side">
            <div className="contact-form-card">
              <div className="contact-form-header">
                <MessageCircle size={20} />
                <h2>Bize Yazın</h2>
              </div>
              <p className="contact-form-desc">
                Formu doldurarak bize mesaj gönderebilirsiniz. Tüm alanları eksiksiz doldurmaya özen gösterin.
              </p>

              <form className="contact-form" onSubmit={undefined}>
                <div className="contact-form-row">
                  <div className="contact-input-group">
                    <label htmlFor="contact-name">Ad Soyad</label>
                    <input type="text" id="contact-name" placeholder="Ahmet Yılmaz" required />
                  </div>
                  <div className="contact-input-group">
                    <label htmlFor="contact-email">E-posta</label>
                    <input type="email" id="contact-email" placeholder="ornek@email.com" required />
                  </div>
                </div>

                <div className="contact-input-group">
                  <label htmlFor="contact-subject">Konu</label>
                  <select id="contact-subject" required>
                    <option value="">Konu Seçin</option>
                    <option value="genel">Genel Bilgi</option>
                    <option value="kurs">Kurs Hakkında</option>
                    <option value="kurumsal">Kurumsal Eğitim Talebi</option>
                    <option value="teknik">Teknik Destek</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div className="contact-input-group">
                  <label htmlFor="contact-message">Mesajınız</label>
                  <textarea id="contact-message" rows={5} placeholder="Mesajınızı buraya yazın..." required></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  <Send size={16} />
                  Mesaj Gönder
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Map Embed Area */}
      <section className="contact-map-section">
        <div className="container">
          <div className="contact-map-wrapper">
            <div className="contact-map-header">
              <Building size={18} />
              <h3>Bizi Ziyaret Edin</h3>
            </div>
            <div className="contact-map-embed">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.8236546498644!2d29.01711597649073!3d41.10437687133394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab5bdd35419f1%3A0x7e8a8e8d0e5f1f0!2zxLBUw5wgVGVrbm9rZW50!5e0!3m2!1str!2str!4v1691000000000!5m2!1str!2str"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DS Akademi Konum"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
