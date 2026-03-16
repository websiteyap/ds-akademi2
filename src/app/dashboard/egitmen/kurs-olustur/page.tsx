import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CourseBuilderPage from '@/components/course-builder/CourseBuilderPage';

export default async function InstructorCourseCreatePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = session.user as { role?: string };
  if (user.role !== 'instructor' && user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="w-full">
      <CourseBuilderPage userRole={user.role} />
    </div>
  );
}
