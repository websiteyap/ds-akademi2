import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

// Static placeholder data — replace with Supabase queries when DB is connected
const stats = [
  { label: 'Kayıtlı Kurs', value: '3', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Sertifika', value: '1', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Tamamlama', value: '%45', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Öğrenme Saati', value: '18 sa', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const enrollments = [
  {
    id: 1,
    title: 'Temel Betonarme Yapı Tasarımı',
    instructor: 'Dr. Öğr. Üyesi Ülgen Mert',
    progress: 65,
    lastAccessed: '2 gün önce',
    status: 'devam',
    slug: 'temel-betonarme-yapi-tasarimi',
  },
  {
    id: 2,
    title: 'Depreme Dayanıklı Çelik Yapı Tasarımı',
    instructor: 'Doç. Dr. Onur Şeker',
    progress: 30,
    lastAccessed: '1 hafta önce',
    status: 'devam',
    slug: 'depreme-dayanikli-celik-yapi-tasarimi',
  },
  {
    id: 3,
    title: 'Performansa Dayalı Yapı Analizi',
    instructor: 'Doç. Dr. Onur Şeker',
    progress: 100,
    lastAccessed: '3 hafta önce',
    status: 'tamamlandi',
    slug: 'performansa-dayali-yapi-analizi',
  },
];

const recentActivity = [
  { icon: CheckCircle2, color: 'text-emerald-500', text: '"Moment-Eğrilik İlişkisi" dersi tamamlandı', time: '2 gün önce' },
  { icon: PlayCircle, color: 'text-blue-500', text: '"TBDY 2018 Kiriş Tasarımı" dersine başlandı', time: '3 gün önce' },
  { icon: Award, color: 'text-amber-500', text: 'Performansa Dayalı Yapı Analizi sertifikası alındı', time: '3 hafta önce' },
  { icon: AlertCircle, color: 'text-[var(--accent-color)]', text: 'Çelik Yapı Tasarımı kursuna kayıt olundu', time: '1 ay önce' },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = session.user as { name?: string | null };
  const firstName = user.name?.split(' ')[0] || 'Kullanıcı';

  return (
    <div className="space-y-6 w-full">

      {/* Welcome banner */}
      <div className="rounded-lg bg-gradient-to-r from-[var(--accent-color)] to-blue-600 p-6 text-white">
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--text-primary)] leading-tight">{value}</p>
              <p className="text-xs text-[var(--text-secondary)] font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid: courses + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* My courses (2/3 width) */}
        <div className="lg:col-span-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
            <h3 className="font-bold text-[var(--text-primary)]">Kurslarım</h3>
            <Link
              href="/dashboard/kurslarim"
              className="text-xs font-semibold text-[var(--accent-color)] flex items-center gap-1 hover:gap-2 transition-all"
            >
              Tümünü Gör <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {enrollments.map((course) => (
              <div key={course.id} className="px-5 py-4 hover:bg-[var(--bg-tertiary)] transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/kurslar/${course.slug}`}
                      className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors line-clamp-1"
                    >
                      {course.title}
                    </Link>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{course.instructor}</p>
                  </div>
                  <span className={`
                    shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded
                    ${course.status === 'tamamlandi'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]'
                    }
                  `}>
                    {course.status === 'tamamlandi' ? 'Tamamlandı' : 'Devam Ediyor'}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        course.progress === 100 ? 'bg-emerald-500' : 'bg-[var(--accent-color)]'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-secondary)] tabular-nums w-8 text-right">
                    {course.progress}%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5">Son erişim: {course.lastAccessed}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity (1/3 width) */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-color)]">
            <h3 className="font-bold text-[var(--text-primary)]">Son Aktiviteler</h3>
          </div>
          <ul className="divide-y divide-[var(--border-color)]">
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={i} className="flex items-start gap-3 px-4 py-3.5">
                  <Icon size={16} className={`${item.color} mt-0.5 shrink-0`} />
                  <div>
                    <p className="text-xs text-[var(--text-primary)] leading-snug font-medium">{item.text}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">{item.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
}
