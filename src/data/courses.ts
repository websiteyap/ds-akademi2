export interface Course {
  id: number;
  slug: string;
  code: string;
  title: string;
  shortTitle: string;
  image: string;
  instructor: string;
  instructorImage: string;
  instructorTitle: string;
  category: string;
  level: "Temel" | "Orta" | "İleri";
  duration: string;
  weekCount: number;
  description: string;
  highlights: string[];
  topics: string[];
  prerequisites: string[];
  isNew?: boolean;
}

export const courses: Course[] = [
  {
    id: 1,
    slug: "temel-celik-yapi-tasarimi",
    code: "DS-101",
    title: "Temel Çelik Yapı Tasarımı Eğitimi",
    shortTitle: "Temel Çelik Yapı Tasarımı",
    image: "/DS-101-TEMEL-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    instructor: "Doç. Dr. Onur Şeker",
    instructorImage: "/instructor-onur.png",
    instructorTitle: "Doçent Doktor",
    category: "Çelik Yapı Tasarımı",
    level: "Temel",
    duration: "4 Hafta",
    weekCount: 4,
    description: "TBDY 2018 yönetmeliğine uygun temel çelik yapı tasarım prensiplerini öğrenin. Birleşim detayları, kesit seçimi ve stabilite analizleri gibi temel konularda akademik düzeyde bilgi edinin.",
    highlights: [
      "TBDY 2018'e uygun tasarım ilkeleri",
      "Çelik kesit seçimi ve optimizasyonu",
      "Birleşim detayları ve hesapları",
      "Pratik tasarım örnekleri",
    ],
    topics: [
      "Çelik malzeme özellikleri ve standartlar",
      "Kesit sınıflandırması",
      "Çekme ve basınç elemanları tasarımı",
      "Eğilme elemanları tasarımı",
      "Birleşim tasarımı (bulon ve kaynak)",
      "Stabilite kontrolleri",
      "Uygulama örnekleri",
    ],
    prerequisites: [
      "Temel yapı mekaniği bilgisi",
      "Mukavemet bilgisi",
    ],
    isNew: true,
  },
  {
    id: 2,
    slug: "temel-betonarme-yapi-tasarimi",
    code: "DS-102",
    title: "Temel Betonarme Yapı Tasarımı Eğitimi",
    shortTitle: "Temel Betonarme Yapı Tasarımı",
    image: "/DS-102-TEMEL-BETONARME-YAPI-TASARIMI.jpg",
    instructor: "Dr. Öğr. Üyesi Ülgen Mert",
    instructorImage: "/instructor-ulgen.png",
    instructorTitle: "Dr. Öğretim Üyesi",
    category: "Betonarme Yapı",
    level: "Temel",
    duration: "4 Hafta",
    weekCount: 4,
    description: "Betonarme yapı tasarımının temellerini TBDY 2018 standartlarına uygun olarak öğrenin. Kolon, kiriş ve döşeme tasarımı ile donatı detaylandırma konularında uzmanlaşın.",
    highlights: [
      "TBDY 2018 betonarme tasarım kuralları",
      "Kolon ve kiriş tasarımı",
      "Döşeme sistemleri analizi",
      "Donatı detaylandırma",
    ],
    topics: [
      "Betonarme malzeme özellikleri",
      "Eğilme teorisi ve eğilme tasarımı",
      "Kesme kuvveti tasarımı",
      "Kolon tasarımı",
      "Döşeme sistemleri",
      "Temel tasarımı",
      "Donatı detaylandırma kuralları",
    ],
    prerequisites: [
      "Temel yapı mekaniği bilgisi",
      "Mukavemet bilgisi",
    ],
  },
  {
    id: 3,
    slug: "depreme-dayanikli-celik-yapi-tasarimi",
    code: "DS-201",
    title: "Depreme Dayanıklı Çelik Yapı Tasarımı Eğitimi",
    shortTitle: "DD Çelik Yapı Tasarımı",
    image: "/DS-201-DEPREME-DAYANIKLI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    instructor: "Doç. Dr. Onur Şeker",
    instructorImage: "/instructor-onur.png",
    instructorTitle: "Doçent Doktor",
    category: "Çelik Yapı Tasarımı",
    level: "Orta",
    duration: "6 Hafta",
    weekCount: 6,
    description: "Çelik yapıların depreme dayanıklı tasarımını TBDY 2018 çerçevesinde öğrenin. Moment çerçeveleri, çaprazlı sistemler ve süneklik kavramlarını detaylı inceleyin.",
    highlights: [
      "Deprem yönetmeliği uygulamaları",
      "Moment çerçeve tasarımı",
      "Çaprazlı sistem tasarımı",
      "Süneklik sınıfları ve detaylandırma",
    ],
    topics: [
      "Deprem mühendisliği temel kavramları",
      "TBDY 2018 çelik yapı kuralları",
      "Moment aktaran çerçeveler",
      "Merkezi ve dışmerkez çaprazlı çerçeveler",
      "Süneklik düzeyleri",
      "Kapasite tasarımı ilkeleri",
      "Birleşim detayları (sismik)",
    ],
    prerequisites: [
      "DS-101 veya eşdeğeri",
      "Temel deprem mühendisliği bilgisi",
    ],
  },
  {
    id: 4,
    slug: "depreme-dayanikli-betonarme-yapi-tasarimi",
    code: "DS-202",
    title: "Depreme Dayanıklı Betonarme Yapı Tasarımı Eğitimi",
    shortTitle: "DD Betonarme Yapı Tasarımı",
    image: "/DS-202-DEPREME-DAYANIKLI-BETONARME-YAPI-TASARIMI-EĞİTİMİ.jpg",
    instructor: "Dr. Öğr. Üyesi Ülgen Mert",
    instructorImage: "/instructor-ulgen.png",
    instructorTitle: "Dr. Öğretim Üyesi",
    category: "Betonarme Yapı",
    level: "Orta",
    duration: "6 Hafta",
    weekCount: 6,
    description: "Betonarme yapıların depreme dayanıklı tasarım ilkelerini TBDY 2018 standartlarında öğrenin. Süneklik detayları, kapasite tasarımı ve performans hedefleri konularında uzmanlık kazanın.",
    highlights: [
      "TBDY 2018 betonarme sismik tasarım",
      "Süneklik detayları",
      "Kapasite tasarımı",
      "Perde duvar tasarımı",
    ],
    topics: [
      "Deprem etkisi altında betonarme davranış",
      "Süneklik kavramı ve detaylandırma",
      "Kolon-kiriş birleşim bölgesi",
      "Perde duvar tasarımı",
      "Kapasite tasarım ilkeleri",
      "Güçlendirme yaklaşımları",
      "Uygulama projeleri",
    ],
    prerequisites: [
      "DS-102 veya eşdeğeri",
      "Temel deprem mühendisliği bilgisi",
    ],
  },
  {
    id: 5,
    slug: "performansa-dayali-celik-yapi-tasarimi",
    code: "DS-301",
    title: "Performansa Dayalı Çelik Yapı Tasarımı Eğitimi",
    shortTitle: "PD Çelik Yapı Tasarımı",
    image: "/DS-301-PERFORMANSA-DAYALI-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    instructor: "Doç. Dr. Onur Şeker",
    instructorImage: "/instructor-onur.png",
    instructorTitle: "Doçent Doktor",
    category: "Performans Analizi",
    level: "İleri",
    duration: "8 Hafta",
    weekCount: 8,
    description: "Çelik yapılar için performansa dayalı tasarım yöntemlerini ileri düzeyde öğrenin. Doğrusal olmayan analiz, plastik mafsal modelleri ve hasar değerlendirmesi konularında derinleşin.",
    highlights: [
      "Performansa dayalı tasarım felsefesi",
      "Doğrusal olmayan analiz yöntemleri",
      "Plastik mafsal modelleri",
      "Hasar sınırları ve değerlendirme",
    ],
    topics: [
      "Performans hedefleri ve deprem tehlikesi",
      "Doğrusal olmayan statik (itme) analizi",
      "Doğrusal olmayan dinamik (zaman tanım alanı) analizi",
      "Plastik mafsal tanımlamaları",
      "Kabul kriterleri",
      "Sonuçların değerlendirilmesi",
      "Raporlama ve uygulama",
    ],
    prerequisites: [
      "DS-201 veya eşdeğeri",
      "İleri düzey yapısal analiz bilgisi",
    ],
  },
  {
    id: 6,
    slug: "mevcut-betonarme-degerlendirme-ve-performans-analizi",
    code: "DS-302",
    title: "Mevcut Betonarme Yapıların Değerlendirilmesi ve Performans Analizi Eğitimi",
    shortTitle: "Mevcut Betonarme Değerlendirme",
    image: "/DS-302-MEVCUT-BETONARME-YAPILARIN-DEĞERLENDİRİLMESİ-VE-PERFORMANS-ANALİZİ-EĞİTİMİ.jpg",
    instructor: "Dr. Öğr. Üyesi Ülgen Mert",
    instructorImage: "/instructor-ulgen.png",
    instructorTitle: "Dr. Öğretim Üyesi",
    category: "Performans Analizi",
    level: "İleri",
    duration: "8 Hafta",
    weekCount: 8,
    description: "Mevcut betonarme yapıların performans değerlendirmesini TBDY 2018 kapsamında öğrenin. Bilgi düzeyleri, mevcut malzeme dayanımları ve güçlendirme stratejileri konularında uzmanlaşın.",
    highlights: [
      "Mevcut yapı değerlendirme yöntemleri",
      "Bilgi düzeyleri ve malzeme tespiti",
      "Performans analizi prosedürleri",
      "Güçlendirme stratejileri",
    ],
    topics: [
      "Mevcut yapı bilgi düzeyleri",
      "Yerinde tespit ve malzeme deneyleri",
      "Mevcut taşıyıcı sistem modelleme",
      "Doğrusal ve doğrusal olmayan analiz",
      "Performans değerlendirmesi",
      "Güçlendirme yöntemleri",
      "Yıkım ve yeniden inşa kararı",
    ],
    prerequisites: [
      "DS-202 veya eşdeğeri",
      "İleri düzey betonarme bilgisi",
    ],
  },
  {
    id: 7,
    slug: "yapisal-ahsap-tasarim",
    code: "DS-401",
    title: "Yapısal Ahşap Tasarım Eğitimi",
    shortTitle: "Yapısal Ahşap Tasarım",
    image: "/DS-401-YAPISAL-AHŞAP-TASARIM-EĞİTİMİ.jpg",
    instructor: "Ömer Asım Şişman & Çağatay Demirci",
    instructorImage: "/instructor-omer.png",
    instructorTitle: "Mühendis & Eğitmen",
    category: "Ahşap Yapı",
    level: "Orta",
    duration: "4 Hafta",
    weekCount: 4,
    description: "Yapısal ahşap tasarımın temellerinden ileri uygulamalarına kadar kapsamlı bir eğitim. CLT, GLT gibi modern ahşap malzemeler ve birleşim detayları hakkında bilgi edinin.",
    highlights: [
      "Modern ahşap malzemeler (CLT, GLT)",
      "Ahşap birleşim tasarımı",
      "Yangın dayanımı hesapları",
      "Sürdürülebilir yapı tasarımı",
    ],
    topics: [
      "Ahşap malzeme özellikleri ve sınıfları",
      "Yapısal ahşap ürünler (CLT, GLT, LVL)",
      "Eğilme, çekme ve basınç elemanları",
      "Birleşim tasarımı",
      "Yangın tasarımı",
      "Deprem etkisi altında ahşap yapılar",
      "Proje uygulamaları",
    ],
    prerequisites: [
      "Temel yapı mekaniği bilgisi",
    ],
  },
  {
    id: 8,
    slug: "bina-bilgi-modelleme-bim",
    code: "DS-501",
    title: "Bina Bilgi Modelleme (BIM) Teorik ve Uygulama Eğitimi",
    shortTitle: "BIM Teorik ve Uygulama",
    image: "/DS-501-BİNA-BİLGİ-MODELLEME-(BIM)-TEORİK-VE-UYGULAMA-EĞİTİMİ.jpg",
    instructor: "Doç. Dr. Sevilay Demirkesen Çakır",
    instructorImage: "/instructor-sevilay.png",
    instructorTitle: "Doçent Doktor",
    category: "BIM",
    level: "Orta",
    duration: "6 Hafta",
    weekCount: 6,
    description: "Bina Bilgi Modelleme (BIM) süreçlerini teorik ve uygulamalı olarak öğrenin. BIM standartları, 3D modelleme, çakışma kontrolü ve proje yönetimi entegrasyonu konularında uzmanlaşın.",
    highlights: [
      "BIM standartları ve süreçleri",
      "3D yapısal modelleme",
      "Çakışma kontrolü (Clash Detection)",
      "Proje yönetimi entegrasyonu",
    ],
    topics: [
      "BIM kavramı ve olgunluk seviyeleri",
      "BIM standartları (ISO 19650)",
      "3D modelleme araçları",
      "Yapısal BIM modelleme",
      "Çakışma kontrolü ve koordinasyon",
      "4D/5D BIM uygulamaları",
      "BIM tabanlı proje yönetimi",
    ],
    prerequisites: [
      "Temel yapı mühendisliği bilgisi",
      "Bilgisayar kullanım becerisi",
    ],
  },
];

export const categories = [...new Set(courses.map(c => c.category))];
export const levels = ["Temel", "Orta", "İleri"] as const;

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}
