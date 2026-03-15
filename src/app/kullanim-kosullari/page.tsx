import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | DS Akademi',
  description: 'DS Akademi platform kullanım koşulları ve şartlar hakkında bilgi alın.',
};

export default function KullanimKosullari() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link href="/" className="legal-back">
          <ChevronLeft size={16} /> Anasayfaya Dön
        </Link>

        <div className="legal-header">
          <p className="legal-label">Son güncelleme: 15 Mart 2026</p>
          <h1 className="legal-title">Kullanım Koşulları</h1>
          <p className="legal-intro">
            Bu sayfada DS Akademi platformunu kullanımınıza ilişkin koşullar ve yükümlülükler açıklanmaktadır.
            Platformumuzu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
          </p>
        </div>

        <div className="legal-body">

          <section className="legal-section">
            <h2>1. Taraflar ve Kapsam</h2>
            <p>
              Bu Kullanım Koşulları, DS Akademi Eğitim ve Danışmanlık A.Ş. ("DS Akademi") ile
              platforma kayıt olan veya herhangi bir şekilde kullanan gerçek ya da tüzel kişiler
              ("Kullanıcı") arasında akdedilmiş bir sözleşme niteliği taşımaktadır.
            </p>
            <p>
              Platform; video eğitimler, belgeler, canlı dersler ve diğer dijital içeriklerden oluşan
              çevrimiçi bir yapısal mühendislik eğitim ortamıdır. Kullanıcı, platforma erişimle birlikte
              bu koşulların tamamını okuduğunu ve kabul ettiğini beyan etmiş olur.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Üyelik ve Hesap Güvenliği</h2>
            <p>
              Platforma kayıt olabilmek için 18 yaşını doldurmuş olmak ya da yasal temsilci onayına
              sahip olmak gerekmektedir. Kullanıcı, hesabına ilişkin kullanıcı adı ve şifrenin
              gizliliğini korumaktan münferiden sorumludur.
            </p>
            <ul>
              <li>Hesap bilgileri başkalarıyla paylaşılamaz.</li>
              <li>Yetkisiz erişim tespitinde derhal DS Akademi'ye bildirim yapılmalıdır.</li>
              <li>Gerçeğe aykırı bilgi verilerek oluşturulan hesaplar askıya alınabilir.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. İçerik Kullanım Hakkı</h2>
            <p>
              DS Akademi, satın alınan veya aboneliğe dahil edilen eğitimlere kişisel, ticari olmayan
              ve devredilemez bir erişim hakkı tanımaktadır. Bu hak kapsamında kullanıcı;
            </p>
            <ul>
              <li>İçerikleri yalnızca kendi öğrenme amaçlı izleyebilir.</li>
              <li>İçerikleri indirip çoğaltamaz, dağıtamaz veya üçüncü şahıslarla paylaşamaz.</li>
              <li>İçerikleri ticari amaçla kullanamaz, satamaz veya lisanslayamaz.</li>
              <li>Eğitim materyallerini başka platformlara yükleyemez.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Ödeme ve İade Politikası</h2>
            <p>
              Tüm ödemeler, satın alma anında belirtilen tutar üzerinden gerçekleştirilir. Fiyatlara
              KDV dahildir. Ödeme işlemleri, PCI DSS uyumlu güvenli ödeme altyapısı üzerinden
              gerçekleştirilmektedir.
            </p>
            <p>
              Kursa erişimin başladığı tarihten itibaren <strong>14 gün içinde</strong>, eğitimin
              %20'sinden fazlasını izlememişseniz tam iade talebinde bulunabilirsiniz. İade talepleri
              <a href="mailto:iade@dsakademi.com.tr"> iade@dsakademi.com.tr</a> adresine iletilmelidir.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Yasaklı Kullanımlar</h2>
            <p>Kullanıcılar aşağıdaki eylemleri gerçekleştirmekten kaçınmakla yükümlüdür:</p>
            <ul>
              <li>Sisteme zarar verici yazılım, virüs veya kötü niyetli kod yüklemek</li>
              <li>Diğer kullanıcıların erişimini engelleyecek eylemler gerçekleştirmek</li>
              <li>Platformdaki içeriklerin telif hakkını ihlal etmek</li>
              <li>Sahte değerlendirme veya yorum bırakmak</li>
              <li>Platform güvenlik mekanizmalarını aşmaya çalışmak</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Fikri Mülkiyet</h2>
            <p>
              Platform üzerindeki tüm içerikler, görseller, videolar, metinler, markalar ve tasarımlar
              DS Akademi'nin ya da lisans verenlerinin fikri mülkiyeti altındadır ve 5846 Sayılı Fikir
              ve Sanat Eserleri Kanunu kapsamında koruma altındadır.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Sorumluluk Sınırlaması</h2>
            <p>
              DS Akademi, eğitim içeriklerinin doğruluğu için azami özeni göstermekle birlikte,
              içeriklerin belirli bir amaç için uygunluğuna ya da eksiksizliğine dair garanti vermez.
              Kullanıcı, edineceği bilgileri uygularken gerekli mesleki değerlendirmeyi yapmakla
              sorumludur.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Değişiklikler</h2>
            <p>
              DS Akademi, bu koşulları önceden haber vermeksizin değiştirme hakkını saklı tutar.
              Güncel koşullar her zaman bu sayfada yayınlanacaktır. Platforma son girişinizden sonra
              yapılan değişiklikler için e-posta ile bilgilendirme yapılacaktır.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Uygulanacak Hukuk ve Yetki</h2>
            <p>
              Bu sözleşme Türk Hukuku'na tabidir. Uyuşmazlıkların çözümünde İstanbul Merkez
              Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. İletişim</h2>
            <p>
              Bu Kullanım Koşulları ile ilgili sorularınız için:
            </p>
            <address className="legal-contact">
              <strong>DS Akademi Eğitim ve Danışmanlık A.Ş.</strong><br />
              İTÜ Teknokent, Maslak / İstanbul<br />
              E-posta: <a href="mailto:info@dsakademi.com.tr">info@dsakademi.com.tr</a><br />
              Telefon: <a href="tel:+908501234567">0 (850) 123 45 67</a>
            </address>
          </section>

        </div>

        <div className="legal-footer-links">
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/kvkk">KVKK Aydınlatma Metni</Link>
          <Link href="/cerez-politikasi">Çerez Politikası</Link>
        </div>
      </div>
    </div>
  );
}
