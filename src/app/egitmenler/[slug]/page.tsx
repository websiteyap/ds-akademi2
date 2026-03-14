import type { Metadata } from "next";
import { instructors, getInstructorBySlug } from "@/data/instructors";
import { notFound } from "next/navigation";
import InstructorDetailClient from "./InstructorDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return instructors.map((instructor) => ({
    slug: instructor.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);
  if (!instructor) return { title: "Eğitmen Bulunamadı | DS Akademi" };

  return {
    title: `${instructor.name} | DS Akademi`,
    description: instructor.bio.substring(0, 150) + '...',
    keywords: [
      instructor.name,
      instructor.title,
      instructor.department,
      "TBDY 2018",
      "yapısal mühendislik eğitmeni",
      "DS Akademi",
    ],
    openGraph: {
      title: `${instructor.name} | DS Akademi Eğitmen Kadrosu`,
      description: instructor.bio.substring(0, 150) + '...',
      images: [{ url: instructor.image }],
    },
  };
}

export default async function InstructorDetailPage({ params }: Props) {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);

  if (!instructor) {
    notFound();
  }

  return <InstructorDetailClient instructor={instructor} />;
}
