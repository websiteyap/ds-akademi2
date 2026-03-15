import type { Metadata } from "next";
import { getAllCourses, getCourseBySlug, getRelatedCourses } from "@/lib/api";
import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Kurs Bulunamadı | DS Akademi" };

  return {
    title: `${course.title} | DS Akademi`,
    description: course.description,
    keywords: [
      course.title,
      course.category?.name ?? "",
      course.primary_instructor?.name ?? "",
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
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  // Fetch related courses SERVER-SIDE — never in the client component
  const relatedCourses = await getRelatedCourses(
    course!.category?.id ?? "",
    slug,
    3
  );

  return <CourseDetailClient course={course!} relatedCourses={relatedCourses} />;
}
