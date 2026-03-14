import type { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Eğitim Kategorileri | DS Akademi",
  description:
    "DS Akademi'nin yapısal mühendislik eğitim kategorilerini keşfedin. Çelik yapı, betonarme, ahşap tasarım, performans analizi ve BIM alanlarında uzman eğitimler.",
  keywords: [
    "yapısal mühendislik kategorileri",
    "çelik yapı tasarımı",
    "betonarme eğitimi",
    "performans analizi",
    "BIM eğitimi",
    "ahşap yapı tasarımı",
    "DS Akademi kategoriler",
  ],
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
