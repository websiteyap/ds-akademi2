import HeroSection from '@/components/HeroSection';
import HeroSlider from '@/components/HeroSlider';
import Instructors from '@/components/Instructors';
import AboutSection from '@/components/AboutSection';
import BlogSection from '@/components/BlogSection';
import FAQSection from '@/components/FAQSection';
import { getAllCourses, getAllInstructors, getFaqCategories } from '@/lib/api';

export default async function Home() {
  const [courses, instructors, faqCategories] = await Promise.all([
    getAllCourses(),
    getAllInstructors(),
    getFaqCategories(),
  ]);

  // Ana sayfada ilk 5 soruyu göster (tüm kategorilerden flat liste)
  const homeFaqs = faqCategories
    .flatMap(cat => cat.faqs)
    .slice(0, 5);

  return (
    <main>
      <HeroSection />
      <HeroSlider courses={courses} />
      <AboutSection />
      <Instructors instructors={instructors} />
      <FAQSection faqs={homeFaqs} />
      <BlogSection />
    </main>
  );
}

