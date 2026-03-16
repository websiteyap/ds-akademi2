import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CourseBuilderPage from '@/components/course-builder/CourseBuilderPage';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCourseBuilderPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = session.user as { role?: string };
  if (user.role !== 'admin') redirect('/dashboard');

  const { id } = await params;

  return (
    <div className="w-full">
      <CourseBuilderPage courseId={id} userRole="admin" />
    </div>
  );
}
