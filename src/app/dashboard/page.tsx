import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  Users,
  GraduationCap,
  Tag,
  ScrollText,
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { blogs as staticBlogs } from '@/data/blogs';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = session.user as { name?: string | null, role?: string };
  const isAdmin = user.role === 'admin';
  const firstName = user.name?.split(' ')[0] || 'Kullanıcı';

  // Fetch Admin Stats
  let adminStats = null;
  if (isAdmin) {
    const [
      { rows: courseRes },
      { rows: instructorRes },
      { rows: userRes },
      { rows: categoryRes },
    ] = await Promise.all([
      db.query("SELECT COUNT(*)::int as count FROM courses"),
      db.query("SELECT COUNT(*)::int as count FROM instructors"),
      db.query("SELECT COUNT(*)::int as count FROM users"),
      db.query("SELECT COUNT(*)::int as count FROM categories"),
    ]);

    adminStats = [
      { label: 'Kurs', value: courseRes[0]?.count || 0, icon: GraduationCap },
      { label: 'Eğitmen', value: instructorRes[0]?.count || 0, icon: Users },
      { label: 'Kullanıcı', value: userRes[0]?.count || 0, icon: Users },
      { label: 'Kategori', value: categoryRes[0]?.count || 0, icon: Tag },
      { label: 'Blog', value: staticBlogs.length, icon: ScrollText },
    ];
  }

  return (
    <div className="space-y-6 w-full">

      {isAdmin ? (
        /* Admin Stats Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {adminStats?.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="relative overflow-hidden group rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 transition-all duration-300 hover:border-[var(--accent-color)]/50"
            >
              <div className="relative z-10">
                <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-[var(--text-primary)] tabular-nums">{value}</p>
              </div>
              <Icon 
                size={80} 
                className="absolute -right-4 -bottom-4 text-[var(--accent-color)] opacity-10 group-hover:opacity-20 transition-opacity rotate-12" 
              />
            </div>
          ))}
        </div>
      ) : (
        /* Welcome banner (Students / Instructors) - Keep it simple as mock data is removed */
        <div className="rounded-lg bg-gradient-to-r from-[var(--accent-color)] to-blue-600 p-6 text-white text-center sm:text-left">
          <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-1">Hoş Geldiniz</p>
          <h2 className="text-2xl font-black mb-1">{firstName} 👋</h2>
          <p className="text-blue-100 text-sm">
            Kaldığınız yerden devam edin — bugün bir adım daha atın.
          </p>
          <Link
            href="/kurslar"
            className="
              mt-4 inline-flex items-center gap-2 text-sm font-bold
              bg-white/20 hover:bg-white/30 border border-white/30
              px-4 py-2 rounded transition-colors
            "
          >
            Tüm Kursları Keşfet <ArrowRight size={15} />
          </Link>
        </div>
      )}

    </div>
  );
}
