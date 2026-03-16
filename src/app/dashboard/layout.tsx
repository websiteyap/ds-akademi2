import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import InactivityGuard from '@/components/dashboard/InactivityGuard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user as {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };

  // Fetch blog permission for instructors
  let canWriteBlog = false;
  if (user.role === 'instructor' && user.id) {
    const { rows } = await db.query(
      'SELECT can_write_blog FROM users WHERE id = $1 LIMIT 1',
      [user.id]
    );
    canWriteBlog = rows[0]?.can_write_blog ?? false;
  }

  const panelLabel =
    user.role === 'admin'      ? 'Yönetici Paneli' :
    user.role === 'instructor' ? 'Eğitmen Paneli'  :
    'Öğrenci Paneli';

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-color)]">
      {/* Sidebar — handles its own desktop/mobile states */}
      <DashboardSidebar
        userName={user.name}
        userEmail={user.email}
        userImage={user.image}
        userRole={user.role}
        canWriteBlog={canWriteBlog}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="shrink-0 h-14 px-4 lg:px-6 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          {/* Left: spacer for mobile hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile spacer for the fixed hamburger button */}
            <div className="w-8 lg:hidden" />
            <h1 className="text-sm font-bold text-[var(--text-primary)]">
              DS Akademi{' '}
              <span className="hidden sm:inline text-[var(--text-secondary)] font-normal">
                / {panelLabel}
              </span>
            </h1>
          </div>

          {/* Right: user greeting */}
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline text-xs text-[var(--text-secondary)]">
              Hoş geldiniz,{' '}
              <strong className="text-[var(--text-primary)]">
                {user.name?.split(' ')[0]}
              </strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/30 flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--accent-color)]">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable content — full width, no max-width restriction */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>

      </div>

      {/* 1-hour inactivity guard (client component) */}
      <InactivityGuard />
    </div>
  );
}
