import { db } from '@/lib/db';
import type { Category, Course, CourseSection, CourseLesson, Instructor, SiteSettings, FaqCategory, Faq, AboutSection } from '@/lib/types';

// Helper for type casting database rows
function asCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) || '',
    icon: (row.icon as string) || 'BookOpen',
    color: (row.color as string) || '#3b82f6',
    bg_gradient: (row.bg_gradient as string) || '',
    sort_order: row.sort_order as number,
  };
}

function asInstructor(row: Record<string, unknown>): Instructor {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    title: row.title as string,
    department: (row.department as string) || '',
    image: (row.image as string) || '',
    bio: (row.bio as string) || '',
    linkedin_url: (row.linkedin_url as string) || '',
    twitter_url: (row.twitter_url as string) || '',
    website_url: (row.website_url as string) || '',
    specialty: (row.specialty as string) || '',
    sort_order: (row.sort_order as number) || 0,
  };
}

// ─────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const { rows: categories } = await db.query('SELECT * FROM categories ORDER BY sort_order');

  const { rows: counts } = await db.query(
    "SELECT category_id, COUNT(*)::int as count FROM courses WHERE is_active = true GROUP BY category_id"
  );

  const countMap: Record<string, number> = {};
  counts.forEach((c: { category_id: string; count: number }) => {
    if (c.category_id) countMap[c.category_id] = c.count;
  });

  return categories.map((cat: Record<string, unknown>) => ({
    ...asCategory(cat),
    courseCount: countMap[cat.id as string] ?? 0,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { rows } = await db.query('SELECT * FROM categories WHERE slug = $1 LIMIT 1', [slug]);
  if (rows.length === 0) return null;

  const cat = rows[0];

  const { rows: countRows } = await db.query(
    "SELECT COUNT(*)::int as count FROM courses WHERE category_id = $1 AND is_active = true",
    [cat.id]
  );

  return { ...asCategory(cat), courseCount: countRows[0]?.count ?? 0 };
}

// ─────────────────────────────────────────────────────────────
// INSTRUCTORS
// ─────────────────────────────────────────────────────────────

export async function getAllInstructors(): Promise<Instructor[]> {
  const { rows: instructors } = await db.query(
    'SELECT * FROM instructors WHERE is_active = true ORDER BY sort_order'
  );

  const { rows: ciRows } = await db.query(
    'SELECT instructor_id, COUNT(*)::int as count FROM course_instructors GROUP BY instructor_id'
  );

  const ciMap: Record<string, number> = {};
  ciRows.forEach((r: { instructor_id: string; count: number }) => {
    ciMap[r.instructor_id] = r.count;
  });

  return instructors.map((ins: Record<string, unknown>) => ({
    ...asInstructor(ins),
    courseCount: ciMap[ins.id as string] ?? 0,
  }));
}

export async function getInstructorBySlug(slug: string): Promise<Instructor | null> {
  const { rows } = await db.query('SELECT * FROM instructors WHERE slug = $1 LIMIT 1', [slug]);
  if (rows.length === 0) return null;

  const instructor = rows[0];

  const { rows: education } = await db.query(
    'SELECT id, degree, university, year, sort_order FROM instructor_education WHERE instructor_id = $1 ORDER BY sort_order',
    [instructor.id]
  );

  const { rows: experience } = await db.query(
    'SELECT id, role, institution, duration, sort_order FROM instructor_experience WHERE instructor_id = $1 ORDER BY sort_order',
    [instructor.id]
  );

  return { ...asInstructor(instructor), education, experience };
}

// ─────────────────────────────────────────────────────────────
// Instructor's courses
// ─────────────────────────────────────────────────────────────

export async function getCoursesByInstructor(instructorId: string): Promise<Course[]> {
  const { rows } = await db.query(
    `SELECT c.id, c.slug, c.code, c.title, c.short_title, c.image, c.level, c.duration, c.week_count, c.is_new, c.sort_order, c.description,
            cat.id as cat_id, cat.slug as cat_slug, cat.name as cat_name
     FROM course_instructors ci
     JOIN courses c ON c.id = ci.course_id
     LEFT JOIN categories cat ON cat.id = c.category_id
     WHERE ci.instructor_id = $1`,
    [instructorId]
  );

  return rows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    slug: row.slug as string,
    code: row.code as string,
    title: row.title as string,
    short_title: row.short_title as string,
    image: (row.image as string) || '',
    level: row.level as 'Temel' | 'Orta' | 'İleri',
    duration: row.duration as string,
    week_count: row.week_count as number,
    description: (row.description as string) || '',
    is_new: row.is_new as boolean,
    sort_order: row.sort_order as number,
    category: row.cat_id ? { id: row.cat_id as string, slug: row.cat_slug as string, name: row.cat_name as string } : undefined,
  }));
}

// ─────────────────────────────────────────────────────────────
// COURSES
// ─────────────────────────────────────────────────────────────

export async function getAllCourses(): Promise<Course[]> {
  const { rows: courses } = await db.query(
    `SELECT c.id, c.slug, c.code, c.title, c.short_title, c.image, c.level, c.duration, c.week_count, c.is_new, c.sort_order, c.description,
            cat.id as cat_id, cat.slug as cat_slug, cat.name as cat_name
     FROM courses c
     LEFT JOIN categories cat ON cat.id = c.category_id
     WHERE c.is_active = true
     ORDER BY c.sort_order`
  );

  const courseIds = courses.map((c: Record<string, unknown>) => c.id);
  if (courseIds.length === 0) return [];

  const { rows: ciRows } = await db.query(
    `SELECT ci.course_id, ci.is_primary, i.id, i.slug, i.name, i.title, i.image
     FROM course_instructors ci
     JOIN instructors i ON i.id = ci.instructor_id
     WHERE ci.course_id = ANY($1)`,
    [courseIds]
  );

  const ciMap = new Map<string, Array<{ is_primary: boolean; id: string; slug: string; name: string; title: string; image: string }>>();
  for (const row of ciRows) {
    if (!ciMap.has(row.course_id)) ciMap.set(row.course_id, []);
    ciMap.get(row.course_id)!.push(row);
  }

  return courses.map((row: Record<string, unknown>) => {
    const instructors = ciMap.get(row.id as string) ?? [];
    const primary = instructors.find((r) => r.is_primary) ?? instructors[0];

    return {
      id: row.id as string,
      slug: row.slug as string,
      code: row.code as string,
      title: row.title as string,
      short_title: row.short_title as string,
      image: (row.image as string) || '',
      level: row.level as 'Temel' | 'Orta' | 'İleri',
      duration: row.duration as string,
      week_count: row.week_count as number,
      description: (row.description as string) || '',
      is_new: row.is_new as boolean,
      sort_order: row.sort_order as number,
      category: row.cat_id ? { id: row.cat_id as string, slug: row.cat_slug as string, name: row.cat_name as string, description: '', icon: '', color: '', bg_gradient: '', sort_order: 0 } : undefined,
      primary_instructor: primary ? {
        id: primary.id,
        slug: primary.slug,
        name: primary.name,
        title: primary.title,
        image: primary.image || '',
      } : undefined,
    };
  });
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const { rows } = await db.query(
    `SELECT c.*, cat.id as cat_id, cat.slug as cat_slug, cat.name as cat_name
     FROM courses c
     LEFT JOIN categories cat ON cat.id = c.category_id
     WHERE c.slug = $1 LIMIT 1`,
    [slug]
  );

  if (rows.length === 0) return null;
  const d = rows[0];
  const courseId = d.id;

  const { rows: ciRows } = await db.query(
    `SELECT ci.is_primary, i.id, i.slug, i.name, i.title, i.image
     FROM course_instructors ci
     JOIN instructors i ON i.id = ci.instructor_id
     WHERE ci.course_id = $1`,
    [courseId]
  );

  const allInstructors = ciRows.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    title: r.title as string,
    image: (r.image as string) || '',
  }));
  const primaryRow = ciRows.find((r: Record<string, unknown>) => r.is_primary) ?? ciRows[0];

  const [hlRes, topRes, preRes, pkgRes] = await Promise.all([
    db.query('SELECT text, sort_order FROM course_highlights WHERE course_id = $1 ORDER BY sort_order', [courseId]),
    db.query('SELECT text, sort_order FROM course_topics WHERE course_id = $1 ORDER BY sort_order', [courseId]),
    db.query('SELECT text, sort_order FROM course_prerequisites WHERE course_id = $1 ORDER BY sort_order', [courseId]),
    db.query('SELECT * FROM course_packages WHERE course_id = $1 ORDER BY sort_order', [courseId]),
  ]);

  const highlights = hlRes.rows.map((h: { text: string }) => h.text);
  const topics = topRes.rows.map((t: { text: string }) => t.text);
  const prerequisites = preRes.rows.map((p: { text: string }) => p.text);
  const packages = pkgRes.rows.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    currency: p.currency,
    description: p.description,
    features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
    is_featured: p.is_featured,
    sort_order: p.sort_order,
  }));

  // LMS Müfredat
  let sections: CourseSection[] = [];
  const { rows: sectionsData } = await db.query(
    'SELECT id, title, description, sort_order FROM course_sections WHERE course_id = $1 ORDER BY sort_order',
    [courseId]
  );

  if (sectionsData.length > 0) {
    const sectionIds = sectionsData.map((s: { id: string }) => s.id);

    const { rows: lessonsData } = await db.query(
      `SELECT id, section_id, title, content_type, duration_min, is_free, sort_order
       FROM course_lessons WHERE section_id = ANY($1) ORDER BY sort_order`,
      [sectionIds]
    );

    const lessonMap = new Map<string, CourseLesson[]>();
    for (const lesson of lessonsData) {
      if (!lessonMap.has(lesson.section_id)) lessonMap.set(lesson.section_id, []);
      lessonMap.get(lesson.section_id)!.push({
        id: lesson.id as string,
        title: lesson.title as string,
        content_type: lesson.content_type as 'video' | 'text' | 'quiz',
        duration_min: lesson.duration_min as number | null,
        is_free: lesson.is_free as boolean,
        sort_order: lesson.sort_order as number,
      });
    }

    sections = sectionsData.map((s: { id: string; title: string; description?: string; sort_order: number }) => ({
      id: s.id as string,
      title: s.title as string,
      description: s.description as string,
      sort_order: s.sort_order as number,
      lessons: lessonMap.get(s.id) ?? [],
    }));
  }

  return {
    id: d.id as string,
    slug: d.slug as string,
    code: d.code as string,
    title: d.title as string,
    short_title: d.short_title as string,
    image: (d.image as string) || '',
    level: d.level as 'Temel' | 'Orta' | 'İleri',
    duration: d.duration as string,
    week_count: d.week_count as number,
    description: (d.description as string) || '',
    is_new: d.is_new as boolean,
    sort_order: d.sort_order as number,
    category: d.cat_id ? { id: d.cat_id as string, slug: d.cat_slug as string, name: d.cat_name as string } : undefined,
    primary_instructor: primaryRow ? {
      id: primaryRow.id as string,
      slug: primaryRow.slug as string,
      name: primaryRow.name as string,
      title: primaryRow.title as string,
      image: (primaryRow.image as string) || '',
    } : undefined,
    all_instructors: allInstructors,
    highlights,
    topics,
    prerequisites,
    packages,
    sections,
  };
}

// ─────────────────────────────────────────────────────────────
// Related courses
// ─────────────────────────────────────────────────────────────

export async function getRelatedCourses(categoryId: string, excludeSlug: string, limit = 3): Promise<Course[]> {
  const { rows: sameCat } = await db.query(
    `SELECT c.id, c.slug, c.code, c.title, c.short_title, c.image, c.level, c.duration, c.week_count, c.is_new, c.sort_order, c.description,
            cat.id as cat_id, cat.slug as cat_slug, cat.name as cat_name
     FROM courses c
     LEFT JOIN categories cat ON cat.id = c.category_id
     WHERE c.category_id = $1 AND c.is_active = true AND c.slug != $2
     ORDER BY c.sort_order LIMIT $3`,
    [categoryId, excludeSlug, limit]
  );

  let results = await attachInstructors(sameCat);

  if (results.length < limit) {
    const need = limit - results.length;
    const existingSlugs = [excludeSlug, ...results.map((c) => c.slug)];
    const { rows: otherCat } = await db.query(
      `SELECT c.id, c.slug, c.code, c.title, c.short_title, c.image, c.level, c.duration, c.week_count, c.is_new, c.sort_order, c.description,
              cat.id as cat_id, cat.slug as cat_slug, cat.name as cat_name
       FROM courses c
       LEFT JOIN categories cat ON cat.id = c.category_id
       WHERE c.is_active = true AND c.slug != ALL($1)
       ORDER BY c.sort_order LIMIT $2`,
      [existingSlugs, need]
    );
    results = [...results, ...await attachInstructors(otherCat)];
  }

  return results;
}

// Helper
async function attachInstructors(courseRows: Record<string, unknown>[]): Promise<Course[]> {
  if (courseRows.length === 0) return [];

  const courseIds = courseRows.map((r) => r.id);
  const { rows: ciRows } = await db.query(
    `SELECT ci.course_id, ci.is_primary, i.id, i.slug, i.name, i.title, i.image
     FROM course_instructors ci
     JOIN instructors i ON i.id = ci.instructor_id
     WHERE ci.course_id = ANY($1)`,
    [courseIds]
  );

  const ciMap = new Map<string, Array<Record<string, unknown>>>();
  for (const row of ciRows) {
    if (!ciMap.has(row.course_id as string)) ciMap.set(row.course_id as string, []);
    ciMap.get(row.course_id as string)!.push(row);
  }

  return courseRows.map((row) => {
    const instructors = ciMap.get(row.id as string) ?? [];
    const primary = instructors.find((r) => r.is_primary) ?? instructors[0];
    return {
      id: row.id as string,
      slug: row.slug as string,
      code: row.code as string,
      title: row.title as string,
      short_title: row.short_title as string,
      image: (row.image as string) || '',
      level: row.level as 'Temel' | 'Orta' | 'İleri',
      duration: row.duration as string,
      week_count: row.week_count as number,
      description: (row.description as string) ?? '',
      is_new: row.is_new as boolean,
      sort_order: row.sort_order as number ?? 0,
      category: row.cat_id ? { id: row.cat_id as string, slug: row.cat_slug as string, name: row.cat_name as string } : undefined,
      primary_instructor: primary ? {
        id: primary.id as string,
        slug: primary.slug as string,
        name: primary.name as string,
        title: primary.title as string,
        image: primary.image as string || '',
      } : undefined,
    };
  });
}

// ─────────────────────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { rows } = await db.query('SELECT * FROM site_settings LIMIT 1');
  if (rows.length === 0) return null;
  
  return {
    id: rows[0].id as string,
    site_name: rows[0].site_name as string,
    site_logo: rows[0].site_logo as string,
    tagline: rows[0].tagline as string,
    footer_about: rows[0].footer_about as string,
    phone: rows[0].phone as string,
    email: rows[0].email as string,
    address_line1: rows[0].address_line1 as string,
    address_line2: rows[0].address_line2 as string,
    working_hours: rows[0].working_hours as string,
    maps_embed_url: rows[0].maps_embed_url as string,
    linkedin_url: rows[0].linkedin_url as string,
    instagram_url: rows[0].instagram_url as string,
    twitter_url: rows[0].twitter_url as string,
    youtube_url: rows[0].youtube_url as string,
  };
}

// ─────────────────────────────────────────────────────────────
// SSS (FAQ)
// ─────────────────────────────────────────────────────────────

export async function getFaqCategories(): Promise<FaqCategory[]> {
  const { rows: categories } = await db.query(
    'SELECT id, slug, name, icon, sort_order FROM faq_categories ORDER BY sort_order'
  );

  if (categories.length === 0) return [];

  const catIds = categories.map((c: { id: string }) => c.id);
  const { rows: faqs } = await db.query(
    'SELECT id, faq_category_id, question, answer, sort_order FROM faqs WHERE faq_category_id = ANY($1) ORDER BY sort_order',
    [catIds]
  );

  const faqMap = new Map<string, Faq[]>();
  for (const faq of faqs) {
    if (!faqMap.has(faq.faq_category_id as string)) faqMap.set(faq.faq_category_id as string, []);
    faqMap.get(faq.faq_category_id as string)!.push({
      id: faq.id as string,
      question: faq.question as string,
      answer: faq.answer as string,
      sort_order: faq.sort_order as number,
    });
  }

  return categories.map((cat: Record<string, unknown>) => ({
    id: cat.id as string,
    slug: cat.slug as string,
    name: cat.name as string,
    icon: (cat.icon as string) || 'HelpCircle',
    sort_order: cat.sort_order as number,
    faqs: faqMap.get(cat.id as string) ?? [],
  }));
}

// ─────────────────────────────────────────────────────────────
// HAKKIMIZDA
// ─────────────────────────────────────────────────────────────

export async function getAboutSections(): Promise<AboutSection[]> {
  const { rows } = await db.query(
    'SELECT * FROM about_sections WHERE is_active = true ORDER BY sort_order'
  );
  return rows.map((r: any) => ({
    id: r.id,
    section: r.section,
    title: r.title,
    content: r.content,
    icon: r.icon,
    sort_order: r.sort_order,
  }));
}
