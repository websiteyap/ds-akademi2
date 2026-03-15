import { getAllCategories, getAllCourses, getAllInstructors } from '@/lib/api';
import Navbar from './Navbar';

/**
 * Server component: fetches all nav data from Supabase, then renders the
 * client Navbar with the data as props. This way the navbar always reflects
 * the live DB, not the static mock files.
 */
export default async function NavbarWrapper() {
  const [categories, courses, instructors] = await Promise.all([
    getAllCategories(),
    getAllCourses(),
    getAllInstructors(),
  ]);

  return (
    <Navbar
      categories={categories}
      courses={courses}
      instructors={instructors}
    />
  );
}
