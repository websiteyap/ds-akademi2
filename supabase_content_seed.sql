-- ============================================================
-- DS Akademi — Content Seed Data
-- supabase_content_schema.sql çalıştırıldıktan SONRA çalıştırın.
-- ============================================================

-- ─── 1. KATEGORİLER ──────────────────────────────────────────
INSERT INTO categories (slug, name, description, icon, color, bg_gradient, sort_order) VALUES
('celik-yapi-tasarimi', 'Çelik Yapı Tasarımı',
 'TBDY 2018 standartlarında çelik yapı tasarımı, birleşim detayları, depreme dayanıklı çelik sistemler ve performansa dayalı tasarım eğitimleri.',
 'Columns3', '#3b82f6',
 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)', 1),

('betonarme-yapi', 'Betonarme Yapı',
 'Betonarme yapı tasarımı, kolon-kiriş-döşeme hesapları, depreme dayanıklı betonarme sistemler ve mevcut yapı değerlendirme eğitimleri.',
 'Building2', '#8b5cf6',
 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 100%)', 2),

('performans-analizi', 'Performans Analizi',
 'Performansa dayalı tasarım, doğrusal olmayan analiz yöntemleri, plastik mafsal modelleri ve mevcut yapı değerlendirme prosedürleri.',
 'BarChart3', '#f59e0b',
 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)', 3),

('ahsap-yapi', 'Ahşap Yapı',
 'Yapısal ahşap tasarım, CLT/GLT modern ahşap malzemeler, birleşim tasarımı, yangın dayanımı ve sürdürülebilir yapı tasarımı eğitimleri.',
 'TreePine', '#22c55e',
 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)', 4),

('bim', 'BIM',
 'Bina Bilgi Modelleme standartları, 3D yapısal modelleme, çakışma kontrolü, 4D/5D BIM uygulamaları ve proje yönetimi entegrasyonu.',
 'Box', '#ec4899',
 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(236,72,153,0.04) 100%)', 5);


-- ─── 2. EĞİTMENLER ───────────────────────────────────────────
INSERT INTO instructors (slug, name, title, department, image, bio, linkedin_url, twitter_url, specialty, sort_order) VALUES
('onur-seker',
 'Doç. Dr. Onur Şeker',
 'Doçent Doktor',
 'Çelik Yapı Tasarımı & Deprem Mühendisliği',
 '/instructor-onur.png',
 'Doç. Dr. Onur Şeker, çelik yapıların sismik davranışı ve performansa dayalı tasarım konularında uzmanlaşmış bir akademisyendir. Yurtiçi ve yurtdışında birçok önemli projeye danışmanlık yapmış olup, TBDY 2018 yönetmeliğinin gelişim süreçlerine katkıda bulunmuştur.',
 'https://linkedin.com', 'https://twitter.com',
 'Çelik Yapı Tasarımı & Performans Analizi', 1),

('ulgen-mert',
 'Dr. Öğr. Üyesi Ülgen Mert',
 'Dr. Öğretim Üyesi',
 'Betonarme Yapı & Mevcut Yapıların Değerlendirilmesi',
 '/instructor-ulgen.png',
 'Dr. Öğr. Üyesi Ülgen Mert, mevcut betonarme yapıların deprem güvenliğinin belirlenmesi ve yenilikçi güçlendirme yöntemleri üzerine odaklanmaktadır. Teorik bilgisini pratik uygulamalarla harmanlayan Dr. Mert, yüzlerce yapısal güçlendirme projesinde baş mühendis olarak görev almıştır.',
 'https://linkedin.com', NULL,
 'Betonarme Yapı & Performans Analizi', 2),

('omer-asim-sisman',
 'Ömer Asım Şişman',
 'Mühendis & Eğitmen',
 'Ahşap Yapı Tasarımı',
 '/instructor-omer.png',
 'Ömer Asım Şişman, sürdürülebilir mimari ve modern ahşap yapı sistemleri (CLT, GLT) üzerine yoğunlaşmıştır. Uluslararası arena dahil olmak üzere birçok büyük ölçekli ahşap yapı projesinin statik tasarımını gerçekleştirmiştir.',
 'https://linkedin.com', NULL,
 'Yapısal Ahşap Tasarım', 3),

('cagatay-demirci',
 'Çağatay Demirci',
 'Mühendis & Eğitmen',
 'Ahşap Yapı & Strüktürel Tasarım',
 '/instructor-cagatay.png',
 'Çağatay Demirci, ahşap bağlantı detayları ve strüktürel tasarım alanında uzmandır. Özellikle hibrit yapı sistemleri ve karmaşık geometriye sahip taşıyıcı sistemlerin modellenmesi üzerine projeler geliştirmiştir.',
 'https://linkedin.com', NULL,
 'Yapısal Ahşap Tasarım', 4),

('sevilay-demirkesen-cakir',
 'Doç. Dr. Sevilay Demirkesen Çakır',
 'Doçent Doktor',
 'Bina Bilgi Modelleme (BIM) & Proje Yönetimi',
 '/instructor-sevilay.png',
 'Doç. Dr. Sevilay Demirkesen Çakır, inşaat sektöründe dijital dönüşüm, BIM süreçleri ve inşaat yönetimi alanlarında öncü araştırmalar yapmaktadır. Uluslararası dergilerde yayınlanmış pek çok makalesi bulunmakta olup danışmanlık faaliyetleri yürütmektedir.',
 'https://linkedin.com', NULL,
 'Bina Bilgi Modelleme (BIM)', 5);


-- ─── 3. EĞİTİM GEÇMİŞİ ──────────────────────────────────────
-- Onur Şeker
INSERT INTO instructor_education (instructor_id, degree, university, year, sort_order)
SELECT id, unnest(ARRAY['Doktora, İnşaat Mühendisliği','Yüksek Lisans, İnşaat Mühendisliği','Lisans, İnşaat Mühendisliği']),
       unnest(ARRAY['İstanbul Teknik Üniversitesi','İstanbul Teknik Üniversitesi','Orta Doğu Teknik Üniversitesi']),
       unnest(ARRAY['2015','2010','2008']),
       unnest(ARRAY[1, 2, 3])
FROM instructors WHERE slug = 'onur-seker';

-- Ülgen Mert
INSERT INTO instructor_education (instructor_id, degree, university, year, sort_order)
SELECT id, unnest(ARRAY['Doktora, İnşaat Mühendisliği','Yüksek Lisans, İnşaat Mühendisliği','Lisans, İnşaat Mühendisliği']),
       unnest(ARRAY['Boğaziçi Üniversitesi','Boğaziçi Üniversitesi','Yıldız Teknik Üniversitesi']),
       unnest(ARRAY['2018','2012','2009']),
       unnest(ARRAY[1, 2, 3])
FROM instructors WHERE slug = 'ulgen-mert';

-- Ömer Asım Şişman
INSERT INTO instructor_education (instructor_id, degree, university, year, sort_order)
SELECT id, unnest(ARRAY['Yüksek Lisans, Ahşap Yapı Mühendisliği','Lisans, İnşaat Mühendisliği']),
       unnest(ARRAY['Technical University of Munich','İstanbul Teknik Üniversitesi']),
       unnest(ARRAY['2019','2016']),
       unnest(ARRAY[1, 2])
FROM instructors WHERE slug = 'omer-asim-sisman';

-- Çağatay Demirci
INSERT INTO instructor_education (instructor_id, degree, university, year, sort_order)
SELECT id, unnest(ARRAY['Yüksek Lisans, İnşaat Mühendisliği','Lisans, İnşaat Mühendisliği']),
       unnest(ARRAY['Yıldız Teknik Üniversitesi','Karadeniz Teknik Üniversitesi']),
       unnest(ARRAY['2018','2014']),
       unnest(ARRAY[1, 2])
FROM instructors WHERE slug = 'cagatay-demirci';

-- Sevilay Demirkesen Çakır
INSERT INTO instructor_education (instructor_id, degree, university, year, sort_order)
SELECT id, unnest(ARRAY['Doktora, İnşaat Yönetimi','Yüksek Lisans, İnşaat Yönetimi','Lisans, İnşaat Mühendisliği']),
       unnest(ARRAY['Purdue University','Orta Doğu Teknik Üniversitesi','Orta Doğu Teknik Üniversitesi']),
       unnest(ARRAY['2016','2011','2009']),
       unnest(ARRAY[1, 2, 3])
FROM instructors WHERE slug = 'sevilay-demirkesen-cakir';


-- ─── 4. İŞ DENEYİMİ ──────────────────────────────────────────
-- Onur Şeker
INSERT INTO instructor_experience (instructor_id, role, institution, duration, sort_order)
SELECT id, unnest(ARRAY['Öğretim Üyesi','Araştırma Görevlisi']),
       unnest(ARRAY['İTÜ İnşaat Fakültesi','İTÜ İnşaat Fakültesi']),
       unnest(ARRAY['2016 - Günümüz','2010 - 2016']),
       unnest(ARRAY[1, 2])
FROM instructors WHERE slug = 'onur-seker';

-- Ülgen Mert
INSERT INTO instructor_experience (instructor_id, role, institution, duration, sort_order)
SELECT id, unnest(ARRAY['Dr. Öğretim Üyesi','Yapısal Tasarım Uzmanı']),
       unnest(ARRAY['YTÜ İnşaat Fakültesi','Özel Sektör']),
       unnest(ARRAY['2019 - Günümüz','2012 - 2018']),
       unnest(ARRAY[1, 2])
FROM instructors WHERE slug = 'ulgen-mert';

-- Ömer Asım Şişman
INSERT INTO instructor_experience (instructor_id, role, institution, duration, sort_order)
SELECT id, unnest(ARRAY['Kıdemli Tasarım Mühendisi','Proje Mühendisi']),
       unnest(ARRAY['Wood Structures Inc.','Green Building Studio']),
       unnest(ARRAY['2019 - Günümüz','2016 - 2017']),
       unnest(ARRAY[1, 2])
FROM instructors WHERE slug = 'omer-asim-sisman';

-- Çağatay Demirci
INSERT INTO instructor_experience (instructor_id, role, institution, duration, sort_order)
SELECT id, unnest(ARRAY['Strüktürel Tasarım Yöneticisi','Saha Mühendisi']),
       unnest(ARRAY['Timber Design Group','Yapı Merkezi']),
       unnest(ARRAY['2019 - Günümüz','2014 - 2018']),
       unnest(ARRAY[1, 2])
FROM instructors WHERE slug = 'cagatay-demirci';

-- Sevilay Demirkesen Çakır
INSERT INTO instructor_experience (instructor_id, role, institution, duration, sort_order)
SELECT id, unnest(ARRAY['Öğretim Üyesi','Araştırma Görevlisi']),
       unnest(ARRAY['İTÜ Mimarlık Fakültesi','Purdue University']),
       unnest(ARRAY['2017 - Günümüz','2012 - 2016']),
       unnest(ARRAY[1, 2])
FROM instructors WHERE slug = 'sevilay-demirkesen-cakir';


-- ─── 5. KURSLAR ──────────────────────────────────────────────
INSERT INTO courses (slug, code, title, short_title, image, category_id, level, duration, week_count, description, is_new, sort_order)
SELECT
  'temel-celik-yapi-tasarimi', 'DS-101',
  'Temel Çelik Yapı Tasarımı Eğitimi', 'Temel Çelik Yapı Tasarımı',
  '/DS-101-TEMEL-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg',
  (SELECT id FROM categories WHERE slug = 'celik-yapi-tasarimi'),
  'Temel', '4 Hafta', 4,
  'TBDY 2018 yönetmeliğine uygun temel çelik yapı tasarım prensiplerini öğrenin. Birleşim detayları, kesit seçimi ve stabilite analizleri gibi temel konularda akademik düzeyde bilgi edinin.',
  true, 1;

INSERT INTO courses (slug, code, title, short_title, image, category_id, level, duration, week_count, description, is_new, sort_order)
SELECT
  'temel-betonarme-yapi-tasarimi', 'DS-102',
  'Temel Betonarme Yapı Tasarımı Eğitimi', 'Temel Betonarme Yapı Tasarımı',
  '/DS-102-TEMEL-BETONARME-YAPI-TASARIMI.jpg',
  (SELECT id FROM categories WHERE slug = 'betonarme-yapi'),
  'Temel', '4 Hafta', 4,
  'Betonarme yapı tasarımının temellerini TBDY 2018 standartlarına uygun olarak öğrenin. Kolon, kiriş ve döşeme tasarımı ile donatı detaylandırma konularında uzmanlaşın.',
  false, 2;

INSERT INTO courses (slug, code, title, short_title, image, category_id, level, duration, week_count, description, is_new, sort_order)
SELECT
  'depreme-dayanikli-celik-yapi-tasarimi', 'DS-201',
  'Depreme Dayanıklı Çelik Yapı Tasarımı Eğitimi', 'DD Çelik Yapı Tasarımı',
  '/DS-201-DEPREME-DAYANIKLI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg',
  (SELECT id FROM categories WHERE slug = 'celik-yapi-tasarimi'),
  'Orta', '6 Hafta', 6,
  'Çelik yapıların depreme dayanıklı tasarımını TBDY 2018 çerçevesinde öğrenin. Moment çerçeveleri, çaprazlı sistemler ve süneklik kavramlarını detaylı inceleyin.',
  false, 3;

INSERT INTO courses (slug, code, title, short_title, image, category_id, level, duration, week_count, description, is_new, sort_order)
SELECT
  'depreme-dayanikli-betonarme-yapi-tasarimi', 'DS-202',
  'Depreme Dayanıklı Betonarme Yapı Tasarımı Eğitimi', 'DD Betonarme Yapı Tasarımı',
  '/DS-202-DEPREME-DAYANIKLI-BETONARME-YAPI-TASARIMI-EĞİTİMİ.jpg',
  (SELECT id FROM categories WHERE slug = 'betonarme-yapi'),
  'Orta', '6 Hafta', 6,
  'Betonarme yapıların depreme dayanıklı tasarım ilkelerini TBDY 2018 standartlarında öğrenin. Süneklik detayları, kapasite tasarımı ve performans hedefleri konularında uzmanlık kazanın.',
  false, 4;

INSERT INTO courses (slug, code, title, short_title, image, category_id, level, duration, week_count, description, is_new, sort_order)
SELECT
  'performansa-dayali-celik-yapi-tasarimi', 'DS-301',
  'Performansa Dayalı Çelik Yapı Tasarımı Eğitimi', 'PD Çelik Yapı Tasarımı',
  '/DS-301-PERFORMANSA-DAYALI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg',
  (SELECT id FROM categories WHERE slug = 'performans-analizi'),
  'İleri', '8 Hafta', 8,
  'Çelik yapılar için performansa dayalı tasarım yöntemlerini ileri düzeyde öğrenin. Doğrusal olmayan analiz, plastik mafsal modelleri ve hasar değerlendirmesi konularında derinleşin.',
  false, 5;

INSERT INTO courses (slug, code, title, short_title, image, category_id, level, duration, week_count, description, is_new, sort_order)
SELECT
  'mevcut-betonarme-degerlendirme-ve-performans-analizi', 'DS-302',
  'Mevcut Betonarme Yapıların Değerlendirilmesi ve Performans Analizi Eğitimi',
  'Mevcut Betonarme Değerlendirme',
  '/DS-302-MEVCUT-BETONARME-YAPILARIN-DEĞERLENDİRİLMESİ-VE-PERFORMANS-ANALİZİ-EĞİTİMİ.jpg',
  (SELECT id FROM categories WHERE slug = 'performans-analizi'),
  'İleri', '8 Hafta', 8,
  'Mevcut betonarme yapıların performans değerlendirmesini TBDY 2018 kapsamında öğrenin. Bilgi düzeyleri, mevcut malzeme dayanımları ve güçlendirme stratejileri konularında uzmanlaşın.',
  false, 6;

INSERT INTO courses (slug, code, title, short_title, image, category_id, level, duration, week_count, description, is_new, sort_order)
SELECT
  'yapisal-ahsap-tasarim', 'DS-401',
  'Yapısal Ahşap Tasarım Eğitimi', 'Yapısal Ahşap Tasarım',
  '/DS-401-YAPISAL-AHŞAP-TASARIM-EĞİTİMİ.jpg',
  (SELECT id FROM categories WHERE slug = 'ahsap-yapi'),
  'Orta', '4 Hafta', 4,
  'Yapısal ahşap tasarımın temellerinden ileri uygulamalarına kadar kapsamlı bir eğitim. CLT, GLT gibi modern ahşap malzemeler ve birleşim detayları hakkında bilgi edinin.',
  false, 7;

INSERT INTO courses (slug, code, title, short_title, image, category_id, level, duration, week_count, description, is_new, sort_order)
SELECT
  'bina-bilgi-modelleme-bim', 'DS-501',
  'Bina Bilgi Modelleme (BIM) Teorik ve Uygulama Eğitimi',
  'BIM Teorik ve Uygulama',
  '/DS-501-BİNA-BİLGİ-MODELLEME-(BIM)-TEORİK-VE-UYGULAMA-EĞİTİMİ.jpg',
  (SELECT id FROM categories WHERE slug = 'bim'),
  'Orta', '6 Hafta', 6,
  'Bina Bilgi Modelleme (BIM) süreçlerini teorik ve uygulamalı olarak öğrenin. BIM standartları, 3D modelleme, çakışma kontrolü ve proje yönetimi entegrasyonu konularında uzmanlaşın.',
  false, 8;


-- ─── 6. KURS ↔ EĞİTMEN ──────────────────────────────────────
-- DS-101: Onur Şeker
INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, true
FROM courses c, instructors i
WHERE c.slug = 'temel-celik-yapi-tasarimi' AND i.slug = 'onur-seker';

-- DS-102: Ülgen Mert
INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, true
FROM courses c, instructors i
WHERE c.slug = 'temel-betonarme-yapi-tasarimi' AND i.slug = 'ulgen-mert';

-- DS-201: Onur Şeker
INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, true
FROM courses c, instructors i
WHERE c.slug = 'depreme-dayanikli-celik-yapi-tasarimi' AND i.slug = 'onur-seker';

-- DS-202: Ülgen Mert
INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, true
FROM courses c, instructors i
WHERE c.slug = 'depreme-dayanikli-betonarme-yapi-tasarimi' AND i.slug = 'ulgen-mert';

-- DS-301: Onur Şeker
INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, true
FROM courses c, instructors i
WHERE c.slug = 'performansa-dayali-celik-yapi-tasarimi' AND i.slug = 'onur-seker';

-- DS-302: Ülgen Mert
INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, true
FROM courses c, instructors i
WHERE c.slug = 'mevcut-betonarme-degerlendirme-ve-performans-analizi' AND i.slug = 'ulgen-mert';

-- DS-401: Ömer Asım Şişman (primary) + Çağatay Demirci
INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, true
FROM courses c, instructors i
WHERE c.slug = 'yapisal-ahsap-tasarim' AND i.slug = 'omer-asim-sisman';

INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, false
FROM courses c, instructors i
WHERE c.slug = 'yapisal-ahsap-tasarim' AND i.slug = 'cagatay-demirci';

-- DS-501: Sevilay Demirkesen Çakır
INSERT INTO course_instructors (course_id, instructor_id, is_primary)
SELECT c.id, i.id, true
FROM courses c, instructors i
WHERE c.slug = 'bina-bilgi-modelleme-bim' AND i.slug = 'sevilay-demirkesen-cakir';


-- ─── 7. ÖĞRENME ÇIKTILARI (HIGHLIGHTS) ───────────────────────
-- DS-101
INSERT INTO course_highlights (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'TBDY 2018''e uygun tasarım ilkeleri',
  'Çelik kesit seçimi ve optimizasyonu',
  'Birleşim detayları ve hesapları',
  'Pratik tasarım örnekleri'
]), unnest(ARRAY[1,2,3,4])
FROM courses c WHERE c.slug = 'temel-celik-yapi-tasarimi';

-- DS-102
INSERT INTO course_highlights (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'TBDY 2018 betonarme tasarım kuralları',
  'Kolon ve kiriş tasarımı',
  'Döşeme sistemleri analizi',
  'Donatı detaylandırma'
]), unnest(ARRAY[1,2,3,4])
FROM courses c WHERE c.slug = 'temel-betonarme-yapi-tasarimi';

-- DS-201
INSERT INTO course_highlights (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Deprem yönetmeliği uygulamaları',
  'Moment çerçeve tasarımı',
  'Çaprazlı sistem tasarımı',
  'Süneklik sınıfları ve detaylandırma'
]), unnest(ARRAY[1,2,3,4])
FROM courses c WHERE c.slug = 'depreme-dayanikli-celik-yapi-tasarimi';

-- DS-202
INSERT INTO course_highlights (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'TBDY 2018 betonarme sismik tasarım',
  'Süneklik detayları',
  'Kapasite tasarımı',
  'Perde duvar tasarımı'
]), unnest(ARRAY[1,2,3,4])
FROM courses c WHERE c.slug = 'depreme-dayanikli-betonarme-yapi-tasarimi';

-- DS-301
INSERT INTO course_highlights (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Performansa dayalı tasarım felsefesi',
  'Doğrusal olmayan analiz yöntemleri',
  'Plastik mafsal modelleri',
  'Hasar sınırları ve değerlendirme'
]), unnest(ARRAY[1,2,3,4])
FROM courses c WHERE c.slug = 'performansa-dayali-celik-yapi-tasarimi';

-- DS-302
INSERT INTO course_highlights (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Mevcut yapı değerlendirme yöntemleri',
  'Bilgi düzeyleri ve malzeme tespiti',
  'Performans analizi prosedürleri',
  'Güçlendirme stratejileri'
]), unnest(ARRAY[1,2,3,4])
FROM courses c WHERE c.slug = 'mevcut-betonarme-degerlendirme-ve-performans-analizi';

-- DS-401
INSERT INTO course_highlights (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Modern ahşap malzemeler (CLT, GLT)',
  'Ahşap birleşim tasarımı',
  'Yangın dayanımı hesapları',
  'Sürdürülebilir yapı tasarımı'
]), unnest(ARRAY[1,2,3,4])
FROM courses c WHERE c.slug = 'yapisal-ahsap-tasarim';

-- DS-501
INSERT INTO course_highlights (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'BIM standartları ve süreçleri',
  '3D yapısal modelleme',
  'Çakışma kontrolü (Clash Detection)',
  'Proje yönetimi entegrasyonu'
]), unnest(ARRAY[1,2,3,4])
FROM courses c WHERE c.slug = 'bina-bilgi-modelleme-bim';


-- ─── 8. MÜFREDAT KONULARI ─────────────────────────────────────
-- DS-101
INSERT INTO course_topics (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Çelik malzeme özellikleri ve standartlar',
  'Kesit sınıflandırması',
  'Çekme ve basınç elemanları tasarımı',
  'Eğilme elemanları tasarımı',
  'Birleşim tasarımı (bulon ve kaynak)',
  'Stabilite kontrolleri',
  'Uygulama örnekleri'
]), unnest(ARRAY[1,2,3,4,5,6,7])
FROM courses c WHERE c.slug = 'temel-celik-yapi-tasarimi';

-- DS-102
INSERT INTO course_topics (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Betonarme malzeme özellikleri',
  'Eğilme teorisi ve eğilme tasarımı',
  'Kesme kuvveti tasarımı',
  'Kolon tasarımı',
  'Döşeme sistemleri',
  'Temel tasarımı',
  'Donatı detaylandırma kuralları'
]), unnest(ARRAY[1,2,3,4,5,6,7])
FROM courses c WHERE c.slug = 'temel-betonarme-yapi-tasarimi';

-- DS-201
INSERT INTO course_topics (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Deprem mühendisliği temel kavramları',
  'TBDY 2018 çelik yapı kuralları',
  'Moment aktaran çerçeveler',
  'Merkezi ve dışmerkez çaprazlı çerçeveler',
  'Süneklik düzeyleri',
  'Kapasite tasarımı ilkeleri',
  'Birleşim detayları (sismik)'
]), unnest(ARRAY[1,2,3,4,5,6,7])
FROM courses c WHERE c.slug = 'depreme-dayanikli-celik-yapi-tasarimi';

-- DS-202
INSERT INTO course_topics (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Deprem etkisi altında betonarme davranış',
  'Süneklik kavramı ve detaylandırma',
  'Kolon-kiriş birleşim bölgesi',
  'Perde duvar tasarımı',
  'Kapasite tasarım ilkeleri',
  'Güçlendirme yaklaşımları',
  'Uygulama projeleri'
]), unnest(ARRAY[1,2,3,4,5,6,7])
FROM courses c WHERE c.slug = 'depreme-dayanikli-betonarme-yapi-tasarimi';

-- DS-301
INSERT INTO course_topics (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Performans hedefleri ve deprem tehlikesi',
  'Doğrusal olmayan statik (itme) analizi',
  'Doğrusal olmayan dinamik (zaman tanım alanı) analizi',
  'Plastik mafsal tanımlamaları',
  'Kabul kriterleri',
  'Sonuçların değerlendirilmesi',
  'Raporlama ve uygulama'
]), unnest(ARRAY[1,2,3,4,5,6,7])
FROM courses c WHERE c.slug = 'performansa-dayali-celik-yapi-tasarimi';

-- DS-302
INSERT INTO course_topics (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Mevcut yapı bilgi düzeyleri',
  'Yerinde tespit ve malzeme deneyleri',
  'Mevcut taşıyıcı sistem modelleme',
  'Doğrusal ve doğrusal olmayan analiz',
  'Performans değerlendirmesi',
  'Güçlendirme yöntemleri',
  'Yıkım ve yeniden inşa kararı'
]), unnest(ARRAY[1,2,3,4,5,6,7])
FROM courses c WHERE c.slug = 'mevcut-betonarme-degerlendirme-ve-performans-analizi';

-- DS-401
INSERT INTO course_topics (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'Ahşap malzeme özellikleri ve sınıfları',
  'Yapısal ahşap ürünler (CLT, GLT, LVL)',
  'Eğilme, çekme ve basınç elemanları',
  'Birleşim tasarımı',
  'Yangın tasarımı',
  'Deprem etkisi altında ahşap yapılar',
  'Proje uygulamaları'
]), unnest(ARRAY[1,2,3,4,5,6,7])
FROM courses c WHERE c.slug = 'yapisal-ahsap-tasarim';

-- DS-501
INSERT INTO course_topics (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY[
  'BIM kavramı ve olgunluk seviyeleri',
  'BIM standartları (ISO 19650)',
  '3D modelleme araçları',
  'Yapısal BIM modelleme',
  'Çakışma kontrolü ve koordinasyon',
  '4D/5D BIM uygulamaları',
  'BIM tabanlı proje yönetimi'
]), unnest(ARRAY[1,2,3,4,5,6,7])
FROM courses c WHERE c.slug = 'bina-bilgi-modelleme-bim';


-- ─── 9. ÖN KOŞULLAR ─────────────────────────────────────────
INSERT INTO course_prerequisites (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY['Temel yapı mekaniği bilgisi','Mukavemet bilgisi']),
       unnest(ARRAY[1,2])
FROM courses c WHERE c.slug = 'temel-celik-yapi-tasarimi';

INSERT INTO course_prerequisites (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY['Temel yapı mekaniği bilgisi','Mukavemet bilgisi']),
       unnest(ARRAY[1,2])
FROM courses c WHERE c.slug = 'temel-betonarme-yapi-tasarimi';

INSERT INTO course_prerequisites (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY['DS-101 veya eşdeğeri','Temel deprem mühendisliği bilgisi']),
       unnest(ARRAY[1,2])
FROM courses c WHERE c.slug = 'depreme-dayanikli-celik-yapi-tasarimi';

INSERT INTO course_prerequisites (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY['DS-102 veya eşdeğeri','Temel deprem mühendisliği bilgisi']),
       unnest(ARRAY[1,2])
FROM courses c WHERE c.slug = 'depreme-dayanikli-betonarme-yapi-tasarimi';

INSERT INTO course_prerequisites (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY['DS-201 veya eşdeğeri','İleri düzey yapısal analiz bilgisi']),
       unnest(ARRAY[1,2])
FROM courses c WHERE c.slug = 'performansa-dayali-celik-yapi-tasarimi';

INSERT INTO course_prerequisites (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY['DS-202 veya eşdeğeri','İleri düzey betonarme bilgisi']),
       unnest(ARRAY[1,2])
FROM courses c WHERE c.slug = 'mevcut-betonarme-degerlendirme-ve-performans-analizi';

INSERT INTO course_prerequisites (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY['Temel yapı mekaniği bilgisi']),
       unnest(ARRAY[1])
FROM courses c WHERE c.slug = 'yapisal-ahsap-tasarim';

INSERT INTO course_prerequisites (course_id, text, sort_order)
SELECT c.id, unnest(ARRAY['Temel yapı mühendisliği bilgisi','Bilgisayar kullanım becerisi']),
       unnest(ARRAY[1,2])
FROM courses c WHERE c.slug = 'bina-bilgi-modelleme-bim';


-- ─── 10. FİYAT PAKETLERİ (örnek — gerçek fiyatlar eklenecek) ─
-- Şimdilik boş. Fiyatlar belirlenince aşağıdaki format ile ekleyin:
-- INSERT INTO course_packages (course_id, name, price, currency, description, features, is_featured, sort_order)
-- SELECT id, 'Bireysel', 2990.00, 'TRY', 'Kişisel kullanım lisansı',
--        ARRAY['Tüm ders videoları', 'Canlı Q&A seansları', 'Sertifika'],
--        true, 1
-- FROM courses WHERE slug = 'temel-celik-yapi-tasarimi';
