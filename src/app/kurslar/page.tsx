import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Eğitim Programları | DS Akademi",
  description:
    "DS Akademi'nin TBDY 2018 standartlarında yapısal mühendislik eğitim programlarını keşfedin. Çelik yapı, betonarme, ahşap tasarım, performans analizi ve BIM kursları.",
  keywords: [
    "yapısal mühendislik eğitimi",
    "çelik yapı tasarımı kursu",
    "betonarme tasarım eğitimi",
    "TBDY 2018 eğitim",
    "depreme dayanıklı tasarım",
    "performansa dayalı tasarım",
    "BIM eğitimi",
    "DS Akademi kursları",
  ],
};

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Yükleniyor...</div>}>
      <CoursesClient />
    </Suspense>
  );
}
