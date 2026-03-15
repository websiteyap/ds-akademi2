"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTheme } from '@/components/ThemeProvider';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Settings,
  LogOut,
  GraduationCap,
  ChevronRight,
  X,
  Sun,
  Moon,
  Menu,
  PlusCircle,
  Users,
  Group,
  FileText,
  PenLine,
  ScrollText,
  Tag,
  UserCheck,
  BarChart2,
  Shield,
  FileStack,
  Wrench,
} from 'lucide-react';

// ─── Nav Definitions ────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const studentNav: NavSection[] = [
  {
    title: 'Menü',
    items: [
      { href: '/dashboard',              label: 'Genel Bakış',   icon: LayoutDashboard },
      { href: '/dashboard/kurslarim',    label: 'Kurslarım',     icon: BookOpen        },
      { href: '/dashboard/sertifikalar', label: 'Sertifikalarım', icon: Award           },
    ],
  },
  {
    title: 'Hesap',
    items: [
      { href: '/dashboard/profil',  label: 'Profilim', icon: User     },
      { href: '/dashboard/ayarlar', label: 'Ayarlar',  icon: Settings },
    ],
  },
];

const getInstructorNav = (canWriteBlog: boolean): NavSection[] => [
  {
    title: 'Kurslarım',
    items: [
      { href: '/dashboard/egitmen/kurslarim',      label: 'Tüm Kurslarım',     icon: BookOpen    },
      { href: '/dashboard/egitmen/kurs-olustur',   label: 'Yeni Kurs Oluştur', icon: PlusCircle  },
    ],
  },
  {
    title: 'Sınıf',
    items: [
      { href: '/dashboard/egitmen/ogrenciler', label: 'Öğrenciler', icon: Users },
      { href: '/dashboard/egitmen/gruplar',    label: 'Gruplar',    icon: Group },
    ],
  },
  {
    title: 'Materyaller',
    items: [
      { href: '/dashboard/egitmen/dokumanlar', label: 'Dökümanlarım', icon: FileText },
    ],
  },
  ...(canWriteBlog
    ? [{
        title: 'Blog',
        items: [
          { href: '/dashboard/egitmen/bloglarim', label: 'Bloglarım',  icon: ScrollText },
          { href: '/dashboard/egitmen/blog-yaz',  label: 'Blog Yaz',   icon: PenLine    },
        ],
      }]
    : []),
  {
    title: 'Hesap',
    items: [
      { href: '/dashboard/egitmen/profil',  label: 'Profil & Ayarlar', icon: User },
    ],
  },
];

const adminNav: NavSection[] = [
  {
    title: 'Kurslar',
    items: [
      { href: '/dashboard/admin/kurslar', label: 'Tüm Kurslar', icon: BookOpen },
    ],
  },
  {
    title: 'Kategoriler',
    items: [
      { href: '/dashboard/admin/kategoriler', label: 'Tüm Kategoriler', icon: Tag },
    ],
  },
  {
    title: 'Eğitmenler',
    items: [
      { href: '/dashboard/admin/egitmenler', label: 'Tüm Eğitmenler', icon: UserCheck },
    ],
  },
  {
    title: 'Kullanıcılar',
    items: [
      { href: '/dashboard/admin/kullanicilar', label: 'Tüm Kullanıcılar', icon: Users  },
      { href: '/dashboard/admin/roller',       label: 'Roller',            icon: Shield },
    ],
  },
  {
    title: 'Sayfalar',
    items: [
      { href: '/dashboard/admin/politika-sayfalari', label: 'Politika Sayfaları', icon: FileStack },
    ],
  },
  {
    title: 'Site',
    items: [
      { href: '/dashboard/admin/site-ayarlari', label: 'Site Ayarları', icon: Wrench },
    ],
  },
];

// ─── Helper: map role to nav sections ───────────────────────────

function getNavSections(role: string, canWriteBlog: boolean): NavSection[] {
  if (role === 'admin')      return adminNav;
  if (role === 'instructor') return getInstructorNav(canWriteBlog);
  return studentNav;
}

// ─── Props ───────────────────────────────────────────────────────

interface DashboardSidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  userRole?: string;
  canWriteBlog?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
}

// ─── Panel label helper ──────────────────────────────────────────

function getPanelLabel(role?: string) {
  if (role === 'admin')      return 'Yönetici Paneli';
  if (role === 'instructor') return 'Eğitmen Paneli';
  return 'Öğrenci Paneli';
}

// ─── Sidebar Content ─────────────────────────────────────────────

function SidebarContent({
  userName, userEmail, userImage, userRole, canWriteBlog = false, onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const sections = getNavSections(userRole ?? 'student', canWriteBlog);
  const panelLabel = getPanelLabel(userRole);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-[var(--border-color)]">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
          <Image
            src="/logo.png"
            alt="DS Akademi"
            width={38}
            height={38}
            className="rounded"
            style={{ objectFit: 'contain' }}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
              DS <span className="text-[var(--accent-color)]">AKADEMİ</span>
            </span>
            <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">
              {panelLabel}
            </span>
          </div>
        </Link>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Menüyü Kapat"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 sidebar-scrollbar">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--accent-color)] px-3 mb-1.5">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold
                        transition-all duration-150 group relative
                        ${isActive
                          ? 'bg-[var(--accent-color)] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        className={isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}
                      />
                      <span className="flex-1">{label}</span>
                      {isActive && <ChevronRight size={14} className="opacity-70" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* All courses shortcut (only for students) */}
        {(!userRole || userRole === 'student') && (
          <>
            <div className="border-t border-[var(--border-color)]" />
            <Link
              href="/kurslar"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent-color)] transition-all group"
            >
              <GraduationCap size={17} />
              <span>Tüm Kurslar</span>
            </Link>
          </>
        )}
      </nav>

      {/* User info + controls */}
      <div className="border-t border-[var(--border-color)] p-3 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
        </button>

        {/* User card */}
        <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[var(--bg-tertiary)] transition-colors">
          <div className="w-9 h-9 rounded-full bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/30 flex items-center justify-center shrink-0 overflow-hidden">
            {userImage ? (
              <Image src={userImage} alt={userName || 'Kullanıcı'} width={36} height={36} className="object-cover" />
            ) : (
              <span className="text-sm font-bold text-[var(--accent-color)]">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{userName || 'Kullanıcı'}</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">{userEmail}</p>
          </div>
          {userRole && userRole !== 'student' && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--accent-color)] text-white px-1.5 py-0.5 rounded shrink-0">
              {userRole === 'admin' ? 'Admin' : 'Eğitmen'}
            </span>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-all duration-150"
        >
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────

export default function DashboardSidebar(props: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 shrink-0 h-screen sticky top-0 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex-col transition-colors duration-300">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile hamburger trigger */}
      <button
        id="sidebar-mobile-trigger"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-sm"
        aria-label="Menüyü Aç"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 z-50 w-72 h-full
          bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent {...props} onClose={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
