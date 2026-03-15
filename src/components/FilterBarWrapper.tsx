import { getAllCategories, getAllCourses } from '@/lib/api';
import FilterBar from './FilterBar';

/**
 * Server component: fetches categories from Supabase and passes to the
 * client FilterBar so the category dropdown always reflects the live DB.
 */
export default async function FilterBarWrapper() {
  const [categories, courses] = await Promise.all([
    getAllCategories(),
    getAllCourses(),
  ]);

  return <FilterBar categories={categories} courses={courses} />;
}
