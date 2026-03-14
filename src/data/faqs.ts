import { HelpCircle, CreditCard, PlayCircle, Award, Settings } from 'lucide-react';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: any; // Lucide icon reference
  faqs: FAQ[];
}

export const faqs: FAQCategory[] = [
  {
    id: "genel",
    name: "Genel Sorular",
    icon: HelpCircle,
    faqs: [
      {
        id: "g1",
        question: "DS Akademi nedir ve kimler için uygundur?",
        answer: "DS Akademi, yapısal mühendislik alanında uzmanlaşmak isteyen inşaat mühendisleri ve mimarlar için hazırlanmış profesyonel bir eğitim platformudur. Hem yeni mezunlar hem de deneyimli profesyoneller için uygun seviyelerde (Temel, Orta, İleri) eğitimler sunmaktadır."
      },
      {
        id: "g2",
        question: "Eğitimler online mı yoksa yüz yüze mi?",
        answer: "Tüm eğitimlerimiz %100 online (video tabanlı) olarak sunulmaktadır. Kurslara kayıt olduğunuzda ders videolarına, ders notlarına ve uygulamalı örneklere 7/24 dilediğiniz zaman erişebilirsiniz."
      },
      {
        id: "g3",
        question: "Eğitimleri satın aldıktan sonra ne kadar süreyle izleyebilirim?",
        answer: "Satın aldığınız her eğitim paketi için ömür boyu erişim izni veriyoruz. Yönetmelikler değiştikçe güncellenen içeriklere ek ücret ödemeden ulaşabilirsiniz."
      }
    ]
  },
  {
    id: "egitim-icerigi",
    name: "Eğitim İçeriği & Program",
    icon: PlayCircle,
    faqs: [
      {
        id: "e1",
        question: "Eğitimler hangi yönetmeliklere (TBDY vb.) göre hazırlanıyor?",
        answer: "Eğitimlerimiz başta TBDY 2018 (Türkiye Bina Deprem Yönetmeliği) olmak üzere ÇYTHYE 2016, ACI 318, AISC 360-16 ve Eurocode standartlarına uygun olarak en güncel normlarda hazırlanmaktadır."
      },
      {
        id: "e2",
        question: "Derslerde hangi statik analiz programları öğretiliyor?",
        answer: "Teorik prensiplerin yanı sıra global ve yerel sektörde en çok kullanılan SAP2000, ETABS, SAFE ve Tekla Structures gibi yazılımlar üzerinden uygulamalı anlatımlar yapıyoruz. Amacımız programları değil, mühendislik yaklaşımlarını ezberletmektir."
      },
      {
        id: "e3",
        question: "Ders esnasında eğitmene soru sorabiliyor muyuz?",
        answer: "Evet. Ders sayfalarında yer alan 'Soru-Cevap' bölümünden doğrudan eğitmene sorularınızı iletebilir, diğer kursiyerlerin sorduğu soruları ve yanıtları inceleyebilirsiniz."
      }
    ]
  },
  {
    id: "odeme",
    name: "Ödeme & Fatura",
    icon: CreditCard,
    faqs: [
      {
        id: "o1",
        question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        answer: "Kredi kartı/Banka kartı (Tüm bankalar), Havale/EFT ve 3D Secure güvencesi ile taksitli ödeme yöntemlerini kullanarak güvenle eğitim satın alabilirsiniz. İyzico veya PayTR güvencesiyle çalışıyoruz."
      },
      {
        id: "o2",
        question: "Kredi kartına taksit seçeneğiniz var mı?",
        answer: "Evet, tüm Bonus, World, Maximum, CardFinans, Paraf ve Axess özellikli kredi kartlarına 12 aya varan taksit seçeneklerimiz mevcuttur. Ödeme ekranında kart bilgilerinizi girdiğinizde taksit oranlarını görüntüleyebilirsiniz."
      },
      {
        id: "o3",
        question: "Firma (Kurumsal) faturası kesebiliyor musunuz?",
        answer: "Elbette. Satın alma işlemi sırasında 'Kurumsal Fatura İstiyorum' seçeneğini işaretleyerek vergi dairesi ve vergi/TC kimlik numaranızı girmeniz yeterlidir. E-Faturanız kayıtlı e-posta adresinize gönderilir."
      }
    ]
  },
  {
    id: "sertifika",
    name: "Sertifikalar",
    icon: Award,
    faqs: [
      {
        id: "s1",
        question: "Eğitimi tamamladığımda sertifika verilecek mi?",
        answer: "Evet. Kayıtlı olduğunuz tüm derslerin %100'ünü tamamladığınızda sistem tarafından adınıza özel olarak oluşturulmuş dijital sertifikanız PDF formatında otomatik olarak oluşturulur."
      },
      {
        id: "s2",
        question: "Bu sertifikalar nerelerde geçerlidir?",
        answer: "Sertifikalarımız, uluslararası referans numarasına sahip olup (QR kod ile doğrulanabilir), CV'nize doğrudan ekleyebileceğiniz ve LinkedIn'de 'Lisanslar ve Sertifikalar' bölümünde paylaşabileceğiniz geçerliliğe sahiptir."
      }
    ]
  },
  {
    id: "teknik",
    name: "Teknik Destek",
    icon: Settings,
    faqs: [
      {
        id: "t1",
        question: "Videoları telefonumdan veya tabletimden izleyebilir miyim?",
        answer: "Kesinlikle! DS Akademi tamamen mobil uyumlu (Responsive) olarak tasarlanmıştır. Tüm videoları bilgisayar, tablet veya cep telefonunuzdan kesintisiz HD kalitesinde izleyebilirsiniz."
      },
      {
        id: "t2",
        question: "Videoları bilgisayarıma indirebilir miyim?",
        answer: "Telif hakları ve güvenlik politikalarımız gereği videolar bilgisayara indirilemez. Ancak sistemimize giriş yaparak videoları ömür boyu online olarak dilediğiniz zaman izleyebilirsiniz."
      }
    ]
  }
];
