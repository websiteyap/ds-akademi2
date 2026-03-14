import type { Metadata } from "next";
import { courses, getCourseBySlug } from "@/data/courses";
import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Kurs Bulunamadı | DS Akademi" };

  return {
    title: `${course.title} | DS Akademi`,
    description: course.description,
    keywords: [
      course.title,
      course.category,
      course.instructor,
      "TBDY 2018",
      "yapısal mühendislik eğitimi",
      "DS Akademi",
    ],
    openGraph: {
      title: `${course.title} | DS Akademi`,
      description: course.description,
      images: [{ url: course.image }],
    },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}
