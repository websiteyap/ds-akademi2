import { getAllCategories, getAllCourses, getSiteSettings } from '@/lib/api';
import Footer from './Footer';

/**
 * Server component: fetches courses, categories, and site_settings from Supabase,
 * passes them to the client Footer for dynamic course/category/contact links.
 */
export default async function FooterWrapper() {
  const [courses, categories, settings] = await Promise.all([
    getAllCourses(),
    getAllCategories(),
    getSiteSettings(),
  ]);

  return <Footer courses={courses} categories={categories} settings={settings} />;
}

