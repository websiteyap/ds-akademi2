// ─────────────────────────────────────────────────────────────
// DS Akademi — Shared Types (from Supabase content schema)
// ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;        // lucide-react icon name
  color: string;
  bg_gradient: string;
  sort_order: number;
  courseCount?: number; // computed
}

export interface Instructor {
  id: string;
  slug: string;
  name: string;
  title: string;
  department: string;
  image: string;
  bio: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  specialty?: string;
  sort_order: number;
  courseCount?: number; // computed
  education?: InstructorEducation[];
  experience?: InstructorExperience[];
}

export interface InstructorEducation {
  id: string;
  degree: string;
  university: string;
  year: string;
  sort_order: number;
}

export interface InstructorExperience {
  id: string;
  role: string;
  institution: string;
  duration: string;
  sort_order: number;
}

export interface CoursePackage {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  description?: string;
  features: string[];
  is_featured: boolean;
  sort_order: number;
}

export interface Course {
  id: string;
  slug: string;
  code: string;
  title: string;
  short_title: string;
  image: string;
  level: 'Temel' | 'Orta' | 'İleri';
  duration: string;
  week_count: number;
  description: string;
  is_new: boolean;
  sort_order: number;
  // joined
  category?: Pick<Category, 'id' | 'slug' | 'name'>;
  primary_instructor?: Pick<Instructor, 'id' | 'slug' | 'name' | 'title' | 'image'>;
  all_instructors?: Pick<Instructor, 'id' | 'slug' | 'name' | 'title' | 'image'>[];
  highlights?: string[];
  topics?: string[];
  prerequisites?: string[];
  packages?: CoursePackage[];
}
// ─────────────────────────────────────────────────────────────
// Site Ayarları
// ─────────────────────────────────────────────────────────────
export interface SiteSettings {
  id: string;
  site_name: string;
  site_logo: string;
  tagline?: string;
  footer_about?: string;
  phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  working_hours?: string;
  maps_embed_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  youtube_url?: string;
}

// ─────────────────────────────────────────────────────────────
// SSS
// ─────────────────────────────────────────────────────────────
export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface FaqCategory {
  id: string;
  slug: string;
  name: string;
  icon: string; // lucide icon name
  sort_order: number;
  faqs: Faq[];
}

// ─────────────────────────────────────────────────────────────
// Hakkımızda
// ─────────────────────────────────────────────────────────────
export interface AboutSection {
  id: string;
  section: 'stat' | 'mission_paragraph' | 'value';
  title?: string;
  content?: string;
  icon?: string; // lucide icon name
  sort_order: number;
}

// ─────────────────────────────────────────────────────────────
// Politika Sayfaları
// ─────────────────────────────────────────────────────────────
export interface PolicyPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────
// Dashboard Kullanıcı Yönetimi
// ─────────────────────────────────────────────────────────────
export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  is_blocked: boolean;
  can_write_blog: boolean;
  created_at: string;
  updated_at: string;
}
