-- ============================================================
-- DS Akademi — Site Ayarları, SSS, Hakkımızda Seed Data
-- supabase_site_schema.sql çalıştırıldıktan SONRA çalıştırın.
-- ============================================================

-- ─── 1. SİTE AYARLARI ────────────────────────────────────────
INSERT INTO site_settings (
  site_name, site_logo, tagline,
  footer_about,
  phone, email, address_line1, address_line2,
  working_hours, maps_embed_url,
  linkedin_url, instagram_url, twitter_url, youtube_url
) VALUES (
  'DS Akademi',
  '/logo.png',
  'Yapısal Mühendislikte Eğitimin Geleceği',

  'DS Akademi, Türkiye''nin önde gelen üniversitelerinde aktif görev yapan akademisyenler tarafından kurulan yapısal mühendislik eğitim platformudur. TBDY 2018 standartlarında, performansa dayalı tasarım odaklı sertifikalı eğitimler sunmaktadır.',

  '0 (850) 123 45 67',
  'info@dsakademi.com.tr',
  'İTÜ Teknokent, Maslak',
  'Sarıyer / İstanbul',
  'Pazartesi – Cuma, 09:00 – 18:00',

  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.8236546498644!2d29.01711597649073!3d41.10437687133394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab5bdd35419f1%3A0x7e8a8e8d0e5f1f0!2zxLBUw5wgVGVrbm9rZW50!5e0!3m2!1str!2str!4v1691000000000!5m2!1str!2str',

  'https://linkedin.com',
  'https://instagram.com',
  'https://twitter.com',
  'https://youtube.com'
);


-- ─── 2. SSS KATEGORİLERİ ─────────────────────────────────────
INSERT INTO faq_categories (slug, name, icon, sort_order) VALUES
  ('genel',          'Genel Sorular',             'HelpCircle', 1),
  ('egitim-icerigi', 'Eğitim İçeriği & Program',  'PlayCircle', 2),
  ('odeme',          'Ödeme & Fatura',             'CreditCard', 3),
  ('sertifika',      'Sertifikalar',               'Award',      4),
  ('teknik',         'Teknik Destek',              'Settings',   5);


-- ─── 3. SSS SORULARI ─────────────────────────────────────────
-- Genel Sorular
INSERT INTO faqs (category_id, question, answer, sort_order)
SELECT id, unnest(ARRAY[
  'DS Akademi nedir ve kimler için uygundur?',
  'Eğitimler online mı yoksa yüz yüze mi?',
  'Eğitimleri satın aldıktan sonra ne kadar süreyle izleyebilirim?'
]), unnest(ARRAY[
  'DS Akademi, yapısal mühendislik alanında uzmanlaşmak isteyen inşaat mühendisleri ve mimarlar için hazırlanmış profesyonel bir eğitim platformudur. Hem yeni mezunlar hem de deneyimli profesyoneller için uygun seviyelerde (Temel, Orta, İleri) eğitimler sunmaktadır.',
  'Tüm eğitimlerimiz %100 online (video tabanlı) olarak sunulmaktadır. Kurslara kayıt olduğunuzda ders videolarına, ders notlarına ve uygulamalı örneklere 7/24 dilediğiniz zaman erişebilirsiniz.',
  'Satın aldığınız her eğitim paketi için ömür boyu erişim izni veriyoruz. Yönetmelikler değiştikçe güncellenen içeriklere ek ücret ödemeden ulaşabilirsiniz.'
]), unnest(ARRAY[1, 2, 3])
FROM faq_categories WHERE slug = 'genel';

-- Eğitim İçeriği & Program
INSERT INTO faqs (category_id, question, answer, sort_order)
SELECT id, unnest(ARRAY[
  'Eğitimler hangi yönetmeliklere (TBDY vb.) göre hazırlanıyor?',
  'Derslerde hangi statik analiz programları öğretiliyor?',
  'Ders esnasında eğitmene soru sorabiliyor muyuz?'
]), unnest(ARRAY[
  'Eğitimlerimiz başta TBDY 2018 (Türkiye Bina Deprem Yönetmeliği) olmak üzere ÇYTHYE 2016, ACI 318, AISC 360-16 ve Eurocode standartlarına uygun olarak en güncel normlarda hazırlanmaktadır.',
  'Teorik prensiplerin yanı sıra global ve yerel sektörde en çok kullanılan SAP2000, ETABS, SAFE ve Tekla Structures gibi yazılımlar üzerinden uygulamalı anlatımlar yapıyoruz. Amacımız programları değil, mühendislik yaklaşımlarını özgünleştirmektir.',
  'Evet. Ders sayfalarında yer alan ''Soru-Cevap'' bölümünden doğrudan eğitmene sorularınızı iletebilir, diğer kursiyerlerin sorduğu soruları ve yanıtları inceleyebilirsiniz.'
]), unnest(ARRAY[1, 2, 3])
FROM faq_categories WHERE slug = 'egitim-icerigi';

-- Ödeme & Fatura
INSERT INTO faqs (category_id, question, answer, sort_order)
SELECT id, unnest(ARRAY[
  'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
  'Kredi kartına taksit seçeneğiniz var mı?',
  'Firma (Kurumsal) faturası kesebiliyor musunuz?'
]), unnest(ARRAY[
  'Kredi kartı/Banka kartı (Tüm bankalar), Havale/EFT ve 3D Secure güvencesi ile taksitli ödeme yöntemlerini kullanarak güvenle eğitim satın alabilirsiniz. İyzico veya PayTR güvencesiyle çalışıyoruz.',
  'Evet, tüm Bonus, World, Maximum, CardFinans, Paraf ve Axess özellikli kredi kartlarına 12 aya varan taksit seçeneklerimiz mevcuttur. Ödeme ekranında kart bilgilerinizi girdiğinizde taksit oranlarını görüntüleyebilirsiniz.',
  'Elbette. Satın alma işlemi sırasında ''Kurumsal Fatura İstiyorum'' seçeneğini işaretleyerek vergi dairesi ve vergi/TC kimlik numaranızı girmeniz yeterlidir. E-Faturanız kayıtlı e-posta adresinize gönderilir.'
]), unnest(ARRAY[1, 2, 3])
FROM faq_categories WHERE slug = 'odeme';

-- Sertifikalar
INSERT INTO faqs (category_id, question, answer, sort_order)
SELECT id, unnest(ARRAY[
  'Eğitimi tamamladığımda sertifika verilecek mi?',
  'Bu sertifikalar nerelerde geçerlidir?'
]), unnest(ARRAY[
  'Evet. Kayıtlı olduğunuz tüm derslerin %100''ünü tamamladığınızda sistem tarafından adınıza özel olarak oluşturulmuş dijital sertifikanız PDF formatında otomatik olarak oluşturulur.',
  'Sertifikalarımız, uluslararası referans numarasına sahip olup (QR kod ile doğrulanabilir), CV''nize doğrudan ekleyebileceğiniz ve LinkedIn''de ''Lisanslar ve Sertifikalar'' bölümünde paylaşabileceğiniz geçerliliğe sahiptir.'
]), unnest(ARRAY[1, 2])
FROM faq_categories WHERE slug = 'sertifika';

-- Teknik Destek
INSERT INTO faqs (category_id, question, answer, sort_order)
SELECT id, unnest(ARRAY[
  'Videoları telefonumdan veya tabletimden izleyebilir miyim?',
  'Videoları bilgisayarıma indirebilir miyim?'
]), unnest(ARRAY[
  'Kesinlikle! DS Akademi tamamen mobil uyumlu (Responsive) olarak tasarlanmıştır. Tüm videoları bilgisayar, tablet veya cep telefonunuzdan kesintisiz HD kalitesinde izleyebilirsiniz.',
  'Telif hakları ve güvenlik politikalarımız gereği videolar bilgisayara indirilemez. Ancak sistemimize giriş yaparak videoları ömür boyu online olarak dilediğiniz zaman izleyebilirsiniz.'
]), unnest(ARRAY[1, 2])
FROM faq_categories WHERE slug = 'teknik';


-- ─── 4. HAKKIMIZDA BÖLÜMLERİ ─────────────────────────────────
-- İstatistikler (stat)
INSERT INTO about_sections (section, title, content, icon, sort_order) VALUES
  ('stat', '7/24', 'Sınırsız Erişim',   'Clock',     1),
  ('stat', '12',   'Eğitim Programı',   'BookOpen',  2),
  ('stat', '5',    'Uzman Eğitmen',     'Users',     3),
  ('stat', '%98',  'Memnuniyet Oranı',  'TrendingUp',4);

-- Misyon Paragrafları (mission_paragraph)
INSERT INTO about_sections (section, title, content, icon, sort_order) VALUES
  ('mission_paragraph', 'Mühendisliği Dönüştüren Eğitim',
   'DS Akademi olarak amacımız, yapısal mühendislik alanında teorik bilgiyi pratiğe dönüştüren, uluslararası standartlara uygun ve güncel eğitim programları sunmaktır.',
   NULL, 1),
  ('mission_paragraph', NULL,
   'Eğitimlerimiz; çelik yapı tasarımı, betonarme tasarımı, ahşap yapı tasarımı, performansa dayalı tasarım ve güçlendirme projeleri gibi geniş bir yelpazede, Türkiye''nin en yetkin akademisyenleri tarafından hazırlanmaktadır.',
   NULL, 2),
  ('mission_paragraph', NULL,
   'Her bir müfredatımız, gerçek dünya problemleri üzerinden kurgulanmış olup hesap uygulamaları, yazılım kullanımı ve proje çalışmalarıyla desteklenmektedir.',
   NULL, 3);

-- Değerler (value)
INSERT INTO about_sections (section, title, content, icon, sort_order) VALUES
  ('value', 'Akademik Kalite',
   'Tüm eğitimlerimiz alanında uzman akademisyenler tarafından, güncel bilimsel araştırmalar ve standartlar ışığında hazırlanmaktadır.',
   'Target', 1),
  ('value', 'Güvenilir İçerik',
   'TBDY 2018, Eurocode ve uluslararası standartlara uyumlu, sektör tarafından kabul görmüş içerikler sunuyoruz.',
   'ShieldCheck', 2),
  ('value', 'Uygulamalı Eğitim',
   'Teorik bilgiyi pratiğe dönüştüren, gerçek proje örnekleri ve hesap uygulamaları ile desteklenen müfredat.',
   'Cpu', 3),
  ('value', 'Sertifikalı Program',
   'Eğitimlerimizi başarıyla tamamlayan katılımcılara tanınmış sertifikalar ve kariyer desteği sağlıyoruz.',
   'Award', 4);
