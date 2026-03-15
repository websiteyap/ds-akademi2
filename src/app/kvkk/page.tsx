import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | DS Akademi',
  description: '6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında DS Akademi aydınlatma metni.',
};

export default function KVKKPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link href="/" className="legal-back">
          <ChevronLeft size={16} /> Anasayfaya Dön
        </Link>

        <div className="legal-header">
          <p className="legal-label">Son güncelleme: 15 Mart 2026</p>
          <h1 className="legal-title">KVKK Aydınlatma Metni</h1>
          <p className="legal-intro">
            6698 Sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi ve Aydınlatma
            Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ
            kapsamında hazırlanmıştır.
          </p>
        </div>

        <div className="legal-body">

          <section className="legal-section">
            <h2>1. Veri Sorumlusunun Kimliği</h2>
            <p>
              <strong>Ünvan:</strong> DS Akademi Eğitim ve Danışmanlık A.Ş.<br />
              <strong>Adres:</strong> İTÜ Teknokent, Maslak / İstanbul<br />
              <strong>E-posta:</strong> <a href="mailto:kvkk@dsakademi.com.tr">kvkk@dsakademi.com.tr</a><br />
              <strong>Telefon:</strong> <a href="tel:+908501234567">0 (850) 123 45 67</a>
            </p>
          </section>

          <section className="legal-section">
            <h2>2. İşlenen Kişisel Veriler ve Kategorileri</h2>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Kişisel Veri</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kimlik</td>
                  <td>Ad, soyad, T.C. kimlik numarası (fatura için)</td>
                </tr>
                <tr>
                  <td>İletişim</td>
                  <td>E-posta adresi, telefon numarası</td>
                </tr>
                <tr>
                  <td>Müşteri İşlem</td>
                  <td>Sipariş geçmişi, kurs kayıtları, sertifika bilgileri</td>
                </tr>
                <tr>
                  <td>Finans</td>
                  <td>Fatura bilgileri, ödeme yöntemi türü</td>
                </tr>
                <tr>
                  <td>İşlem Güvenliği</td>
                  <td>IP adresi, oturum kayıtları, log verileri</td>
                </tr>
                <tr>
                  <td>Pazarlama</td>
                  <td>Bülten tercihleri (yalnızca onay verilmişse)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="legal-section">
            <h2>3. Kişisel Veri İşlemenin Hukuki Dayanağı ve Amacı</h2>

            <h3>a) Sözleşmenin kurulması ve ifası (KVKK md. 5/2-c)</h3>
            <ul>
              <li>Üyelik işlemlerinin gerçekleştirilmesi</li>
              <li>Satın alınan kurs ve içeriklere erişim sağlanması</li>
              <li>Ödeme ve fatura işlemlerinin yürütülmesi</li>
              <li>Müşteri destek hizmetlerinin sunulması</li>
            </ul>

            <h3>b) Veri sorumlusunun meşru menfaati (KVKK md. 5/2-f)</h3>
            <ul>
              <li>Platform güvenliğinin sağlanması ve sahteciliğin önlenmesi</li>
              <li>Kullanım analizi ve hizmet kalitesinin iyileştirilmesi</li>
            </ul>

            <h3>c) Kanuni yükümlülük (KVKK md. 5/2-ç)</h3>
            <ul>
              <li>Vergi mevzuatı kapsamında fatura düzenlenmesi</li>
              <li>Yetkili kurum talepleri karşısında yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>

            <h3>d) Açık rıza (KVKK md. 5/1)</h3>
            <ul>
              <li>Pazarlama iletişimleri ve bülten aboneliği</li>
              <li>Kişiselleştirilmiş içerik ve reklam gösterimi</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Kişisel Verilerin Aktarıldığı Taraflar ve Aktarım Amacı</h2>
            <p>Kişisel verileriniz aşağıdaki taraflara aktarılabilir:</p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Alıcı</th>
                  <th>Amaç</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ödeme hizmet sağlayıcıları</td>
                  <td>Ödeme işlemlerinin güvenli şekilde gerçekleştirilmesi</td>
                </tr>
                <tr>
                  <td>Bulut altyapı sağlayıcıları</td>
                  <td>Platform ve veri depolama hizmetleri</td>
                </tr>
                <tr>
                  <td>E-posta hizmet sağlayıcıları</td>
                  <td>İşlem ve hizmet e-postalarının iletilmesi</td>
                </tr>
                <tr>
                  <td>Yetkili kamu kurum ve kuruluşları</td>
                  <td>Yasal yükümlülükler kapsamında talep halinde</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="legal-section">
            <h2>5. Kişisel Verilerin Toplanma Yöntemi</h2>
            <p>
              Kişisel verileriniz, platform üzerindeki kayıt formları, ödeme sayfaları, iletişim
              formları, canlı destek, e-posta yazışmaları ve otomatik teknik yöntemler (çerezler, log
              kayıtları) aracılığıyla toplanmaktadır.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. İlgili Kişi Hakları</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme</li>
              <li>Yapılan işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme</li>
              <li>Münhasıran otomatik sistemler vasıtasıyla ortaya çıkan sonuca itiraz etme</li>
              <li>Kanuna aykırı işleme sebebiyle zararın giderilmesini talep etme</li>
            </ul>
            <p>
              Başvurularınızı <a href="mailto:kvkk@dsakademi.com.tr">kvkk@dsakademi.com.tr</a> adresine
              iletebilir veya şirket adresimize ıslak imzalı dilekçe gönderebilirsiniz. Başvurularınız
              30 gün içinde sonuçlandırılacaktır.
            </p>
          </section>

        </div>

        <div className="legal-footer-links">
          <Link href="/kullanim-kosullari">Kullanım Koşulları</Link>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/cerez-politikasi">Çerez Politikası</Link>
        </div>
      </div>
    </div>
  );
}
