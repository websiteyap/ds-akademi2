import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | DS Akademi',
  description: "DS Akademi'nin kişisel verilerinizi nasıl topladığını, kullandığını ve koruduğunu öğrenin.",
};

export default function GizlilikPolitikasi() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link href="/" className="legal-back">
          <ChevronLeft size={16} /> Anasayfaya Dön
        </Link>

        <div className="legal-header">
          <p className="legal-label">Son güncelleme: 15 Mart 2026</p>
          <h1 className="legal-title">Gizlilik Politikası</h1>
          <p className="legal-intro">
            DS Akademi olarak kişisel gizliliğinize önem veriyoruz. Bu politika, hangi kişisel
            verilerinizi topladığımızı, bu verileri nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
          </p>
        </div>

        <div className="legal-body">

          <section className="legal-section">
            <h2>1. Veri Sorumlusu</h2>
            <p>
              Kişisel verileriniz, 6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında
              <strong> DS Akademi Eğitim ve Danışmanlık A.Ş.</strong> tarafından işlenmektedir.
              Veri sorumlusu sıfatıyla iletişim bilgilerimiz şu şekildedir:
            </p>
            <address className="legal-contact">
              İTÜ Teknokent, Maslak / İstanbul<br />
              E-posta: <a href="mailto:kvkk@dsakademi.com.tr">kvkk@dsakademi.com.tr</a>
            </address>
          </section>

          <section className="legal-section">
            <h2>2. Toplanan Kişisel Veriler</h2>
            <p>Platformumuzu kullanmanız sürecinde aşağıdaki kişisel veriler toplanmaktadır:</p>
            <ul>
              <li><strong>Kimlik verileri:</strong> Ad, soyad, kullanıcı adı</li>
              <li><strong>İletişim verileri:</strong> E-posta adresi, telefon numarası</li>
              <li><strong>Finansal veriler:</strong> Ödeme yöntemi türü, son 4 hane (tam kart bilgisi saklanmaz)</li>
              <li><strong>Kullanım verileri:</strong> İzlenen dersler, tamamlanma oranları, platform tercihleri</li>
              <li><strong>Teknik veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgisi, çerez verileri</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Verilerin Kullanım Amaçları</h2>
            <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul>
              <li>Üyelik ve hesap yönetimi</li>
              <li>Satın alınan eğitimlere erişim sağlanması</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
              <li>Müşteri desteği ve teknik yardım</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Bülten ve hizmet bildirimleri (onay verilmişse)</li>
              <li>Platform güvenliği ve sahteciliğin önlenmesi</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Verilerin Paylaşımı</h2>
            <p>
              Kişisel verileriniz, aşağıdaki istisnalar dışında üçüncü şahıslarla paylaşılmaz:
            </p>
            <ul>
              <li><strong>Ödeme işlemcileri:</strong> Güvenli ödeme altyapısı sağlayıcıları (örn. iyzico)</li>
              <li><strong>Hizmet sağlayıcılar:</strong> Video barındırma, e-posta altyapısı, analitik araçları</li>
              <li><strong>Yasal zorunluluklar:</strong> Mahkeme kararı veya yetkili makam talebi</li>
            </ul>
            <p>
              Tüm üçüncü taraf hizmet sağlayıcılar, kişisel verilerinizi yalnızca DS Akademi adına
              işlemek üzere sözleşmeyle yükümlü tutulmaktadır.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Verilerin Saklanma Süresi</h2>
            <p>
              Kişisel verileriniz, hesabınız aktif olduğu sürece ve yasal gerekliliklerin izin verdiği
              ölçüde saklanır. Hesabınızı silmeniz durumunda verileriniz, yasal saklama sürelerinin
              dolmasının ardından (genellikle 3–10 yıl) kalıcı olarak silinir.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Güvenlik Önlemleri</h2>
            <p>
              Verilerinizi korumak için endüstri standardı güvenlik önlemleri uygulanmaktadır:
            </p>
            <ul>
              <li>SSL/TLS şifreleme ile veri iletimi</li>
              <li>PCI DSS uyumlu ödeme altyapısı</li>
              <li>Düzenli güvenlik denetimleri</li>
              <li>Erişim kontrolleri ve yetkilendirme yönetimi</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Haklarınız</h2>
            <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen verileriniz hakkında bilgi talep etme</li>
              <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
              <li>İşleme itiraz etme</li>
              <li>Verilerin taşınabilirliğini talep etme</li>
              <li>Otomatik işleme dayalı kararların gözden geçirilmesini isteme</li>
            </ul>
            <p>
              Haklarınızı kullanmak için <a href="mailto:kvkk@dsakademi.com.tr">kvkk@dsakademi.com.tr</a> adresine
              yazılı başvuruda bulunabilirsiniz.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Çerezler</h2>
            <p>
              Platformumuz, deneyiminizi kişiselleştirmek ve analitik veriler toplamak amacıyla çerez
              kullanmaktadır. Çerez kullanımına ilişkin detaylı bilgi için{' '}
              <Link href="/cerez-politikasi">Çerez Politikası</Link> sayfamızı inceleyiniz.
            </p>
          </section>

        </div>

        <div className="legal-footer-links">
          <Link href="/kullanim-kosullari">Kullanım Koşulları</Link>
          <Link href="/kvkk">KVKK Aydınlatma Metni</Link>
          <Link href="/cerez-politikasi">Çerez Politikası</Link>
        </div>
      </div>
    </div>
  );
}
