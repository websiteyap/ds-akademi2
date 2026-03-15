import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Çerez Politikası | DS Akademi',
  description: "DS Akademi'nin çerez kullanım politikası ve yönetimi hakkında bilgi alın.",
};

export default function CerezPolitikasi() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link href="/" className="legal-back">
          <ChevronLeft size={16} /> Anasayfaya Dön
        </Link>

        <div className="legal-header">
          <p className="legal-label">Son güncelleme: 15 Mart 2026</p>
          <h1 className="legal-title">Çerez Politikası</h1>
          <p className="legal-intro">
            Bu politika, DS Akademi platformunun çerez (cookie) kullanımına ilişkin bilgileri
            içermektedir. Çerezlerin neler olduğunu, hangi amaçlarla kullandığımızı ve nasıl
            yönetebileceğinizi açıklamaktadır.
          </p>
        </div>

        <div className="legal-body">

          <section className="legal-section">
            <h2>1. Çerez Nedir?</h2>
            <p>
              Çerezler, web siteleri tarafından tarayıcınıza yerleştirilen küçük metin dosyalarıdır.
              Ziyaretçileri tanımak, tercihlerini hatırlamak ve platformu geliştirmek amacıyla
              kullanılırlar. Çerezler cihazınıza zarar vermez ve kişisel dosyalarınıza erişim sağlamaz.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Kullandığımız Çerez Türleri</h2>

            <h3>Zorunlu Çerezler</h3>
            <p>
              Platformun temel işlevlerinin çalışması için gereklidir. Oturum açma, alışveriş sepeti
              ve güvenlik doğrulama gibi işlemler bu çerezlerle gerçekleştirilir. Bu çerezler devre
              dışı bırakılamaz; ancak kişisel bilgi toplamaz.
            </p>

            <h3>Performans ve Analitik Çerezleri</h3>
            <p>
              Ziyaretçilerin platformu nasıl kullandığını anlamamıza yardımcı olur. Sayfaların kaç kez
              ziyaret edildiği, hangi içeriklerin popüler olduğu gibi anonim istatistikler toplanır.
              Bu veriler yalnızca aggregate (toplu) biçimde kullanılır.
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Trafik analizi ve kullanıcı davranışı</li>
              <li><strong>Hotjar:</strong> Kullanıcı deneyimini iyileştirme</li>
            </ul>

            <h3>İşlevsel Çerezler</h3>
            <p>
              Tercihlerinizi (dil, tema, filtreleme ayarları) hatırlamak için kullanılır. Bu çerezler
              olmadan her ziyarette tercihlerinizi yeniden ayarlamanız gerekebilir.
            </p>

            <h3>Pazarlama ve Hedefleme Çerezleri</h3>
            <p>
              İlgi alanlarınıza yönelik içerik ve reklamlar sunmak amacıyla kullanılır. Yalnızca açık
              rızanızla aktif hale getirilir.
            </p>
            <ul>
              <li><strong>Meta Pixel:</strong> Facebook/Instagram reklam hedefleme</li>
              <li><strong>Google Ads:</strong> Arama ve görüntülü reklam yeniden hedefleme</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Çerez Süreleri</h2>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Çerez Türü</th>
                  <th>Süre</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Oturum çerezi</td>
                  <td>Tarayıcı kapanana kadar</td>
                  <td>Oturum yönetimi</td>
                </tr>
                <tr>
                  <td>Kalıcı çerez</td>
                  <td>1 ay – 2 yıl</td>
                  <td>Tercih ve kimlik hatırlama</td>
                </tr>
                <tr>
                  <td>Analitik çerez</td>
                  <td>13 ay</td>
                  <td>Anonim kullanım istatistikleri</td>
                </tr>
                <tr>
                  <td>Pazarlama çerezi</td>
                  <td>90 gün</td>
                  <td>Reklam hedefleme</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="legal-section">
            <h2>4. Çerezleri Yönetme</h2>
            <p>
              Çerez tercihlerinizi aşağıdaki yöntemlerle yönetebilirsiniz:
            </p>

            <h3>Tarayıcı Ayarları</h3>
            <p>
              Çoğu tarayıcı çerezleri otomatik olarak kabul eder; ancak bu ayarı değiştirebilirsiniz:
            </p>
            <ul>
              <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
              <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik</li>
              <li><strong>Safari:</strong> Tercihler → Gizlilik</li>
              <li><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
            </ul>
            <p>
              <strong>Not:</strong> Zorunlu çerezleri engellemek platformun bazı özelliklerinin
              çalışmamasına neden olabilir.
            </p>

            <h3>Üçüncü Taraf Araçları</h3>
            <ul>
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Devre Dışı Bırakma Eklentisi</a></li>
              <li>Meta: <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer">Facebook Gizlilik Merkezi</a></li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Politika Güncellemeleri</h2>
            <p>
              Bu Çerez Politikası zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında
              e-posta bildirimi veya platform içi duyuru ile bilgilendirme yapılacaktır. Güncel politika
              her zaman bu sayfada yayımlanacaktır.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. İletişim</h2>
            <p>
              Çerez kullanımı hakkında sorularınız için:{' '}
              <a href="mailto:kvkk@dsakademi.com.tr">kvkk@dsakademi.com.tr</a>
            </p>
          </section>

        </div>

        <div className="legal-footer-links">
          <Link href="/kullanim-kosullari">Kullanım Koşulları</Link>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/kvkk">KVKK Aydınlatma Metni</Link>
        </div>
      </div>
    </div>
  );
}
