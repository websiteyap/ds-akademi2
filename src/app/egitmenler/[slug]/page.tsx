import type { Metadata } from "next";
import { getAllInstructors, getInstructorBySlug, getCoursesByInstructor } from "@/lib/api";
import { notFound } from "next/navigation";
import InstructorDetailClient from "./InstructorDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const instructors = await getAllInstructors();
  return instructors.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const instructor = await getInstructorBySlug(slug);
  if (!instructor) return { title: "Eğitmen Bulunamadı | DS Akademi" };

  return {
    title: `${instructor.name} | DS Akademi`,
    description: (instructor.bio ?? "").substring(0, 150) + "...",
    keywords: [
      instructor.name,
      instructor.title,
      instructor.department ?? "",
      "yapısal mühendislik eğitmeni",
      "DS Akademi",
    ],
    openGraph: {
      title: `${instructor.name} | DS Akademi Eğitmen Kadrosu`,
      description: (instructor.bio ?? "").substring(0, 150) + "...",
      images: [{ url: instructor.image ?? "" }],
    },
  };
}

export default async function InstructorDetailPage({ params }: Props) {
  const { slug } = await params;
  const instructor = await getInstructorBySlug(slug);

  if (!instructor) notFound();

  // Fetch instructor courses SERVER-SIDE — never in the client component
  const instructorCourses = await getCoursesByInstructor(instructor!.id);

  return (
    <InstructorDetailClient
      instructor={instructor!}
      instructorCourses={instructorCourses}
    />
  );
}
