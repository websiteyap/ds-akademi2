import { supabaseAdmin } from '@/lib/supabase';
import type { Category, Course, Instructor, SiteSettings, FaqCategory, Faq, AboutSection } from '@/lib/types';

// ─────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('getAllCategories error:', error);
    return [];
  }

  // Compute courseCount per category
  const { data: counts } = await supabaseAdmin
    .from('courses')
    .select('category_id')
    .eq('is_active', true);

  const countMap: Record<string, number> = {};
  (counts ?? []).forEach((c: { category_id: string | null }) => {
    if (c.category_id) countMap[c.category_id] = (countMap[c.category_id] ?? 0) + 1;
  });

  return (data ?? []).map((cat) => ({
    ...cat,
    courseCount: countMap[cat.id] ?? 0,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  // Compute courseCount
  const { count } = await supabaseAdmin
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', data.id)
    .eq('is_active', true);

  return { ...data, courseCount: count ?? 0 };
}

// ─────────────────────────────────────────────────────────────
// INSTRUCTORS
// ─────────────────────────────────────────────────────────────

export async function getAllInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabaseAdmin
    .from('instructors')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('getAllInstructors error:', error);
    return [];
  }

  // Compute courseCount per instructor
  const { data: ciRows } = await supabaseAdmin
    .from('course_instructors')
    .select('instructor_id');

  const ciMap: Record<string, number> = {};
  (ciRows ?? []).forEach((r: { instructor_id: string }) => {
    ciMap[r.instructor_id] = (ciMap[r.instructor_id] ?? 0) + 1;
  });

  return (data ?? []).map((ins) => ({
    ...ins,
    courseCount: ciMap[ins.id] ?? 0,
  }));
}

export async function getInstructorBySlug(slug: string): Promise<Instructor | null> {
  const { data, error } = await supabaseAdmin
    .from('instructors')
    .select(`
      *,
      instructor_education ( id, degree, university, year, sort_order ),
      instructor_experience ( id, role, institution, duration, sort_order )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  const education = [...(data.instructor_education ?? [])].sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );
  const experience = [...(data.instructor_experience ?? [])].sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  return { ...data, education, experience };
}

// ─────────────────────────────────────────────────────────────
// Instructor's courses (used in instructor detail page)
// ─────────────────────────────────────────────────────────────

export async function getCoursesByInstructor(instructorId: string): Promise<Course[]> {
  const { data, error } = await supabaseAdmin
    .from('course_instructors')
    .select(`
      courses (
        id, slug, code, title, short_title, image, level, duration, week_count, is_new, sort_order,
        categories ( id, slug, name )
      )
    `)
    .eq('instructor_id', instructorId);

  if (error) {
    console.error('getCoursesByInstructor error:', error);
    return [];
  }

  return (data ?? [])
    .map((row: { courses: unknown }) => {
      const c = row.courses as Record<string, unknown> | null;
      if (!c) return null;
      const cat = c.categories as Record<string, unknown> | null;
      return {
        ...c,
        category: cat ? { id: cat.id, slug: cat.slug, name: cat.name } : undefined,
      } as Course;
    })
    .filter(Boolean) as Course[];
}

// ─────────────────────────────────────────────────────────────
// COURSES
// ─────────────────────────────────────────────────────────────

export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select(`
      id, slug, code, title, short_title, image, level, duration, week_count, is_new, sort_order, description,
      categories ( id, slug, name ),
      course_instructors!inner (
        is_primary,
        instructors ( id, slug, name, title, image )
      )
    `)
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('getAllCourses error:', error);
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => {
    const cat = row.categories as Record<string, unknown> | null;
    const ciRows = (row.course_instructors as Array<{ is_primary: boolean; instructors: Record<string, unknown> }>) ?? [];
    const primary = ciRows.find((r) => r.is_primary)?.instructors ?? ciRows[0]?.instructors;

    return {
      id: row.id,
      slug: row.slug,
      code: row.code,
      title: row.title,
      short_title: row.short_title,
      image: row.image,
      level: row.level,
      duration: row.duration,
      week_count: row.week_count,
      is_new: row.is_new,
      sort_order: row.sort_order,
      description: row.description,
      category: cat ? { id: cat.id as string, slug: cat.slug as string, name: cat.name as string } : undefined,
      primary_instructor: primary ? {
        id: primary.id as string,
        slug: primary.slug as string,
        name: primary.name as string,
        title: primary.title as string,
        image: primary.image as string,
      } : undefined,
    } as Course;
  });
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select(`
      *,
      categories ( id, slug, name ),
      course_instructors (
        is_primary,
        instructors ( id, slug, name, title, image )
      ),
      course_highlights ( text, sort_order ),
      course_topics ( text, sort_order ),
      course_prerequisites ( text, sort_order ),
      course_packages ( id, name, price, currency, description, features, is_featured, sort_order )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  const d = data as Record<string, unknown>;
  const cat = d.categories as Record<string, unknown> | null;
  const ciRows = (d.course_instructors as Array<{ is_primary: boolean; instructors: Record<string, unknown> }>) ?? [];
  const allInstructors = ciRows.map((r) => ({
    id: r.instructors.id as string,
    slug: r.instructors.slug as string,
    name: r.instructors.name as string,
    title: r.instructors.title as string,
    image: r.instructors.image as string,
  }));
  const primary = ciRows.find((r) => r.is_primary)?.instructors ?? ciRows[0]?.instructors;

  const sortByOrder = <T extends { sort_order: number }>(arr: T[]) =>
    [...arr].sort((a, b) => a.sort_order - b.sort_order);

  const highlights = sortByOrder((d.course_highlights as Array<{ text: string; sort_order: number }>) ?? []).map((h) => h.text);
  const topics = sortByOrder((d.course_topics as Array<{ text: string; sort_order: number }>) ?? []).map((t) => t.text);
  const prerequisites = sortByOrder((d.course_prerequisites as Array<{ text: string; sort_order: number }>) ?? []).map((p) => p.text);
  const packages = sortByOrder((d.course_packages as Array<{ sort_order: number }>) ?? []);

  return {
    id: d.id as string,
    slug: d.slug as string,
    code: d.code as string,
    title: d.title as string,
    short_title: d.short_title as string,
    image: d.image as string,
    level: d.level as 'Temel' | 'Orta' | 'İleri',
    duration: d.duration as string,
    week_count: d.week_count as number,
    description: d.description as string,
    is_new: d.is_new as boolean,
    sort_order: d.sort_order as number,
    category: cat ? { id: cat.id as string, slug: cat.slug as string, name: cat.name as string } : undefined,
    primary_instructor: primary ? {
      id: primary.id as string,
      slug: primary.slug as string,
      name: primary.name as string,
      title: primary.title as string,
      image: primary.image as string,
    } : undefined,
    all_instructors: allInstructors,
    highlights,
    topics,
    prerequisites,
    packages: packages as import('./types').CoursePackage[],
  };
}

// ─────────────────────────────────────────────────────────────
// Related courses (same category, excluding given slug)
// ─────────────────────────────────────────────────────────────

export async function getRelatedCourses(categoryId: string, excludeSlug: string, limit = 3): Promise<Course[]> {
  const { data: sameCat } = await supabaseAdmin
    .from('courses')
    .select(`
      id, slug, code, title, short_title, image, level, duration, week_count, is_new,
      categories ( id, slug, name ),
      course_instructors ( is_primary, instructors ( id, slug, name, title, image ) )
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('slug', excludeSlug)
    .order('sort_order')
    .limit(limit);

  let results = mapCourseRows(sameCat ?? []);

  if (results.length < limit) {
    const need = limit - results.length;
    const existingSlugs = [excludeSlug, ...results.map((c) => c.slug)];
    const { data: otherCat } = await supabaseAdmin
      .from('courses')
      .select(`
        id, slug, code, title, short_title, image, level, duration, week_count, is_new,
        categories ( id, slug, name ),
        course_instructors ( is_primary, instructors ( id, slug, name, title, image ) )
      `)
      .eq('is_active', true)
      .not('slug', 'in', `(${existingSlugs.map((s) => `"${s}"`).join(',')})`)
      .order('sort_order')
      .limit(need);

    results = [...results, ...mapCourseRows(otherCat ?? [])];
  }

  return results;
}

function mapCourseRows(rows: Record<string, unknown>[]): Course[] {
  return rows.map((row) => {
    const cat = row.categories as Record<string, unknown> | null;
    const ciRows = (row.course_instructors as Array<{ is_primary: boolean; instructors: Record<string, unknown> }>) ?? [];
    const primary = ciRows.find((r) => r.is_primary)?.instructors ?? ciRows[0]?.instructors;
    return {
      id: row.id,
      slug: row.slug,
      code: row.code,
      title: row.title,
      short_title: row.short_title,
      image: row.image,
      level: row.level,
      duration: row.duration,
      week_count: row.week_count,
      is_new: row.is_new,
      sort_order: row.sort_order ?? 0,
      description: row.description as string ?? '',
      category: cat ? { id: cat.id as string, slug: cat.slug as string, name: cat.name as string } : undefined,
      primary_instructor: primary ? {
        id: primary.id as string,
        slug: primary.slug as string,
        name: primary.name as string,
        title: primary.title as string,
        image: primary.image as string,
      } : undefined,
    } as Course;
  });
}

// ─────────────────────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('getSiteSettings error:', error);
    return null;
  }
  return data;
}

// ─────────────────────────────────────────────────────────────
// SSS (FAQ)
// ─────────────────────────────────────────────────────────────

export async function getFaqCategories(): Promise<FaqCategory[]> {
  const { data, error } = await supabaseAdmin
    .from('faq_categories')
    .select(`
      id, slug, name, icon, sort_order,
      faqs ( id, question, answer, sort_order )
    `)
    .order('sort_order');

  if (error) {
    console.error('getFaqCategories error:', error);
    return [];
  }

  return (data ?? []).map((cat) => ({
    ...cat,
    faqs: [...(cat.faqs as Faq[])].sort((a, b) => a.sort_order - b.sort_order),
  })) as FaqCategory[];
}

// ─────────────────────────────────────────────────────────────
// HAKKIMIZDA
// ─────────────────────────────────────────────────────────────

export async function getAboutSections(): Promise<AboutSection[]> {
  const { data, error } = await supabaseAdmin
    .from('about_sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('getAboutSections error:', error);
    return [];
  }
  return (data ?? []) as AboutSection[];
}
