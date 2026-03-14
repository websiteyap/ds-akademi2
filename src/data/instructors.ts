export interface Instructor {
  id: string;
  slug: string;
  name: string;
  title: string;
  department: string;
  image: string;
  bio: string;
  education: {
    degree: string;
    university: string;
    year: string;
  }[];
  experience: {
    role: string;
    institution: string;
    duration: string;
  }[];
  socials?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export const instructors: Instructor[] = [
  {
    id: "1",
    slug: "onur-seker",
    name: "Doç. Dr. Onur Şeker",
    title: "Doçent Doktor",
    department: "Çelik Yapı Tasarımı & Deprem Mühendisliği",
    image: "/instructor-onur.png",
    bio: "Doç. Dr. Onur Şeker, çelik yapıların sismik davranışı ve performansa dayalı tasarım konularında uzmanlaşmış bir akademisyendir. Yurtiçi ve yurtdışında birçok önemli projeye danışmanlık yapmış olup, TBDY 2018 yönetmeliğinin gelişim süreçlerine katkıda bulunmuştur.",
    education: [
      { degree: "Doktora, İnşaat Mühendisliği", university: "İstanbul Teknik Üniversitesi", year: "2015" },
      { degree: "Yüksek Lisans, İnşaat Mühendisliği", university: "İstanbul Teknik Üniversitesi", year: "2010" },
      { degree: "Lisans, İnşaat Mühendisliği", university: "Orta Doğu Teknik Üniversitesi", year: "2008" }
    ],
    experience: [
      { role: "Öğretim Üyesi", institution: "İTÜ İnşaat Fakültesi", duration: "2016 - Günümüz" },
      { role: "Araştırma Görevlisi", institution: "İTÜ İnşaat Fakültesi", duration: "2010 - 2016" }
    ],
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    }
  },
  {
    id: "2",
    slug: "ulgen-mert",
    name: "Dr. Öğr. Üyesi Ülgen Mert",
    title: "Dr. Öğretim Üyesi",
    department: "Betonarme Yapı & Mevcut Yapıların Değerlendirilmesi",
    image: "/instructor-ulgen.png",
    bio: "Dr. Öğr. Üyesi Ülgen Mert, mevcut betonarme yapıların deprem güvenliğinin belirlenmesi ve yenilikçi güçlendirme yöntemleri üzerine odaklanmaktadır. Teorik bilgisini pratik uygulamalarla harmanlayan Dr. Mert, yüzlerce yapısal güçlendirme projesinde baş mühendis olarak görev almıştır.",
    education: [
      { degree: "Doktora, İnşaat Mühendisliği", university: "Boğaziçi Üniversitesi", year: "2018" },
      { degree: "Yüksek Lisans, İnşaat Mühendisliği", university: "Boğaziçi Üniversitesi", year: "2012" },
      { degree: "Lisans, İnşaat Mühendisliği", university: "Yıldız Teknik Üniversitesi", year: "2009" }
    ],
    experience: [
      { role: "Dr. Öğretim Üyesi", institution: "YTÜ İnşaat Fakültesi", duration: "2019 - Günümüz" },
      { role: "Yapısal Tasarım Uzmanı", institution: "Özel Sektör", duration: "2012 - 2018" }
    ],
    socials: {
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "3",
    slug: "omer-asim-sisman",
    name: "Ömer Asım Şişman",
    title: "Mühendis & Eğitmen",
    department: "Ahşap Yapı Tasarımı",
    image: "/instructor-omer.png",
    bio: "Ömer Asım Şişman, sürdürülebilir mimari ve modern ahşap yapı sistemleri (CLT, GLT) üzerine yoğunlaşmıştır. Uluslararası arena dahil olmak üzere birçok büyük ölçekli ahşap yapı projesinin statik tasarımını gerçekleştirmiştir.",
    education: [
      { degree: "Yüksek Lisans, Ahşap Yapı Mühendisliği", university: "Technical University of Munich", year: "2019" },
      { degree: "Lisans, İnşaat Mühendisliği", university: "İstanbul Teknik Üniversitesi", year: "2016" }
    ],
    experience: [
      { role: "Kıdemli Tasarım Mühendisi", institution: "Wood Structures Inc.", duration: "2019 - Günümüz" },
      { role: "Proje Mühendisi", institution: "Green Building Studio", duration: "2016 - 2017" }
    ],
    socials: {
      linkedin: "https://linkedin.com",
      website: "https://dsakademi.com.tr"
    }
  },
  {
    id: "4",
    slug: "cagatay-demirci",
    name: "Çağatay Demirci",
    title: "Mühendis & Eğitmen",
    department: "Ahşap Yapı & Strüktürel Tasarım",
    image: "/instructor-cagatay.png",
    bio: "Çağatay Demirci, ahşap bağlantı detayları ve strüktürel tasarım alanında uzmandır. Özellikle hibrit yapı sistemleri ve karmaşık geometriye sahip taşıyıcı sistemlerin modellenmesi üzerine projeler geliştirmiştir.",
    education: [
      { degree: "Yüksek Lisans, İnşaat Mühendisliği", university: "Yıldız Teknik Üniversitesi", year: "2018" },
      { degree: "Lisans, İnşaat Mühendisliği", university: "Karadeniz Teknik Üniversitesi", year: "2014" }
    ],
    experience: [
      { role: "Strüktürel Tasarım Yöneticisi", institution: "Timber Design Group", duration: "2019 - Günümüz" },
      { role: "Saha Mühendisi", institution: "Yapı Merkezi", duration: "2014 - 2018" }
    ],
    socials: {
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "5",
    slug: "sevilay-demirkesen-cakir",
    name: "Doç. Dr. Sevilay Demirkesen Çakır",
    title: "Doçent Doktor",
    department: "Bina Bilgi Modelleme (BIM) & Proje Yönetimi",
    image: "/instructor-sevilay.png",
    bio: "Doç. Dr. Sevilay Demirkesen Çakır, inşaat sektöründe dijital dönüşüm, BIM süreçleri ve inşaat yönetimi alanlarında öncü araştırmalar yapmaktadır. Uluslararası dergilerde yayınlanmış pek çok makalesi bulunmakta olup danışmanlık faaliyetleri yürütmektedir.",
    education: [
      { degree: "Doktora, İnşaat Yönetimi", university: "Purdue University", year: "2016" },
      { degree: "Yüksek Lisans, İnşaat Yönetimi", university: "Orta Doğu Teknik Üniversitesi", year: "2011" },
      { degree: "Lisans, İnşaat Mühendisliği", university: "Orta Doğu Teknik Üniversitesi", year: "2009" }
    ],
    experience: [
      { role: "Öğretim Üyesi", institution: "İTÜ Mimarlık Fakültesi", duration: "2017 - Günümüz" },
      { role: "Araştırma Görevlisi", institution: "Purdue University", duration: "2012 - 2016" }
    ],
    socials: {
      linkedin: "https://linkedin.com",
      website: "https://dsakademi.com.tr"
    }
  }
];

export function getInstructorBySlug(slug: string): Instructor | undefined {
  return instructors.find(i => i.slug === slug);
}
