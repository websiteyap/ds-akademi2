export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: {
    name: string;
    image: string;
  };
  publishedAt: string;
  readTime: string;
}

export const blogCategories = [
  "Tümü",
  "Çelik Yapılar",
  "Betonarme",
  "Deprem Mühendisliği",
  "Mühendislik Kariyeri",
  "Sektörel Haberler"
];

export const blogs: BlogPost[] = [
  {
    id: "blog-1",
    slug: "tbdy-2018e-gore-celik-yapilarda-performans-degerlendirmesi",
    title: "TBDY 2018'e Göre Çelik Yapılarda Performans Değerlendirmesi İlkeleri",
    excerpt: "Çelik yapıların performansa dayalı tasarımı ve değerlendirilmesi süreçlerinde TBDY 2018 standartlarının getirdiği yenilikler ve dikkat edilmesi gereken hususlar.",
    content: "Çelik yapıların tasarlanması...",
    image: "/DS-101-TEMEL-ÇELİK-YAPI-TASARIMI-EĞİTİMİ.jpg",
    category: "Deprem Mühendisliği",
    author: {
      name: "Doç. Dr. Onur Şeker",
      image: "/instructor-onur.png"
    },
    publishedAt: "25 Ekim 2025",
    readTime: "6 dk okuma"
  },
  {
    id: "blog-2",
    slug: "yapisal-ahsap-tasarimin-gelecegi-ve-avantajlari",
    title: "Yapısal Ahşap Tasarımın Geleceği: Sürdürülebilirlik ve Avantajlar",
    excerpt: "Geleneksel yapı malzemelerine alternatif olarak yapısal ahşap malzemenin güncel mühendislik projelerindeki yeri, sürdürülebilirlik etkisi ve tasarım avantajları.",
    content: "Ahşap yapı malzemesi...",
    image: "/DS-102-TEMEL-BETONARME-YAPI-TASARIMI.jpg",
    category: "Çelik Yapılar",
    author: {
      name: "Dr. Ömer Asım Şişman",
      image: "/instructor-omer.png"
    },
    publishedAt: "12 Kasım 2025",
    readTime: "5 dk okuma"
  },
  {
    id: "blog-3",
    slug: "insaat-muhendisleri-icin-bim-bim-uzmani-olmak",
    title: "İnşaat Mühendisleri İçin BIM (Yapı Bilgi Modellemesi) Kılavuzu",
    excerpt: "BIM sistemlerinin inşaat mühendisliği kariyerindeki önemi, sahada sağladığı maliyet avantajları ve BIM uzmanı olmak için atılması gereken adımlar.",
    content: "BIM sistemleri son yıllarda...",
    image: "/DS-302-MEVCUT-BETONARME-YAPILARIN-DEĞERLENDİRİLMESİ-VE-PERFORMANS-ANALİZİ-EĞİTİMİ.jpg",
    category: "Mühendislik Kariyeri",
    author: {
      name: "Dr. Sevilay Demirkesen Çakır",
      image: "/instructor-sevilay.png"
    },
    publishedAt: "05 Aralık 2025",
    readTime: "8 dk okuma"
  },
  {
    id: "blog-4",
    slug: "betonarme-yapilarda-guclendirme-yaklasimlari",
    title: "Mevcut Betonarme Yapılarda Güçlendirme Yaklaşımları",
    excerpt: "Riskli betonarme binaların tespit süreçleri, bilgi düzeyleri, malzeme dayanımlarının hesabı ve etkili betonarme güçlendirme stratejileri.",
    content: "Betonarme güçlendirme...",
    image: "/DS-501-BİNA-BİLGİ-MODELLEME-(BIM)-TEORİK-VE-UYGULAMA-EĞİTİMİ.jpg",
    category: "Betonarme",
    author: {
      name: "Dr. Ülgen Mert",
      image: "/instructor-ulgen.png"
    },
    publishedAt: "18 Kasım 2025",
    readTime: "7 dk okuma"
  }
];

export const getBlogBySlug = (slug: string): BlogPost | undefined => {
  return blogs.find(blog => blog.slug === slug);
};
