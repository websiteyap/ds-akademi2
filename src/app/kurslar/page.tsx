import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllCourses, getAllCategories } from "@/lib/api";
import CoursesClient from "./CoursesClient";

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

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getAllCourses(),
    getAllCategories(),
  ]);

  const categoryNames = [...new Set(courses.map((c) => c.category?.name).filter(Boolean))] as string[];
  const levels = ["Temel", "Orta", "İleri"] as const;

  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Yükleniyor...</div>}>
      <CoursesClient
        courses={courses}
        categoryNames={categoryNames}
        levels={[...levels]}
      />
    </Suspense>
  );
}
