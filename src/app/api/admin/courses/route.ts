import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// ─── GET: Kurslar veya tek kurs detayı ───────────────────────────
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // Tek kurs detayı (sub-collections dahil)
  if (id) {
    const [hlRes, topRes, preRes, pkgRes] = await Promise.all([
      db.query('SELECT text FROM course_highlights WHERE course_id = $1 ORDER BY sort_order', [id]),
      db.query('SELECT text FROM course_topics WHERE course_id = $1 ORDER BY sort_order', [id]),
      db.query('SELECT text FROM course_prerequisites WHERE course_id = $1 ORDER BY sort_order', [id]),
      db.query('SELECT * FROM course_packages WHERE course_id = $1 ORDER BY sort_order', [id]),
    ]);
    return NextResponse.json({
      highlights: hlRes.rows.map((r: { text: string }) => r.text),
      topics: topRes.rows.map((r: { text: string }) => r.text),
      prerequisites: preRes.rows.map((r: { text: string }) => r.text),
      packages: pkgRes.rows.map((p: Record<string, unknown>) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        currency: p.currency ?? 'TRY',
        description: p.description ?? '',
        features: p.features ?? [],
        is_featured: p.is_featured ?? false,
        sort_order: p.sort_order ?? 0,
      })),
    });
  }

  // Tüm kurslar listesi
  const user = session.user as { role?: string };
  if (user.role !== 'admin' && user.role !== 'instructor') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { rows: courses } = await db.query(
    `SELECT c.id, c.slug, c.code, c.title, c.short_title, c.image, c.level, c.duration, c.week_count,
            c.description, c.is_new, c.is_active, c.sort_order, c.created_at, c.updated_at, c.category_id,
            cat.id as cat_id, cat.slug as cat_slug, cat.name as cat_name
     FROM courses c
     LEFT JOIN categories cat ON cat.id = c.category_id
     ORDER BY c.sort_order`
  );

  // Get instructors for all courses
  const courseIds = courses.map((c: Record<string, unknown>) => c.id);
  let ciMap = new Map<string, Array<Record<string, unknown>>>();

  if (courseIds.length > 0) {
    const { rows: ciRows } = await db.query(
      `SELECT ci.course_id, ci.is_primary, i.id, i.slug, i.name, i.title
       FROM course_instructors ci
       JOIN instructors i ON i.id = ci.instructor_id
       WHERE ci.course_id = ANY($1)`,
      [courseIds]
    );
    for (const row of ciRows) {
      if (!ciMap.has(row.course_id)) ciMap.set(row.course_id, []);
      ciMap.get(row.course_id)!.push(row);
    }
  }

  const result = courses.map((c: Record<string, unknown>) => ({
    id: c.id, slug: c.slug, code: c.code, title: c.title, short_title: c.short_title,
    image: c.image, level: c.level, duration: c.duration, week_count: c.week_count,
    description: c.description, is_new: c.is_new, is_active: c.is_active,
    sort_order: c.sort_order, created_at: c.created_at, updated_at: c.updated_at,
    category_id: c.category_id,
    categories: c.cat_id ? { id: c.cat_id, slug: c.cat_slug, name: c.cat_name } : null,
    course_instructors: (ciMap.get(c.id as string) ?? []).map((ci) => ({
      is_primary: ci.is_primary,
      instructors: { id: ci.id, slug: ci.slug, name: ci.name, title: ci.title },
    })),
  }));

  return NextResponse.json(result);
}

// ─── POST: Yeni kurs (sub-collections dahil) ─────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const body = await req.json();
  const { title, short_title, code, slug, category_id, level, duration, week_count, description, image, is_new, is_active, sort_order, instructor_id, highlights, topics, prerequisites, packages } = body;

  if (!title || !code || !slug) {
    return NextResponse.json({ error: 'Başlık, kod ve slug zorunludur.' }, { status: 400 });
  }

  const { rows } = await db.query(
    `INSERT INTO courses (title, short_title, code, slug, category_id, level, duration, week_count, description, image, is_new, is_active, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
    [title, short_title || title, code, slug, category_id || null, level || 'Temel', duration || '4 Hafta', week_count || 4, description || '', image || null, is_new ?? false, is_active ?? true, sort_order ?? 0]
  );

  const courseId = rows[0]?.id;
  if (!courseId) return NextResponse.json({ error: 'Kurs oluşturulamadı.' }, { status: 500 });

  // Sub-collections
  await saveSubCollections(courseId, instructor_id, highlights, topics, prerequisites, packages);

  return NextResponse.json({ id: courseId, message: 'Kurs oluşturuldu.' }, { status: 201 });
}

// ─── PUT: Kurs güncelle (sub-collections dahil) ──────────────────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = session.user as { role?: string };
  if (user.role !== 'admin' && user.role !== 'instructor') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const body = await req.json();
  const { id, instructor_id, highlights, topics, prerequisites, packages, ...courseUpdates } = body;

  if (!id) return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });

  // Remove non-course fields
  delete courseUpdates.categories;
  delete courseUpdates.course_instructors;

  const keys = Object.keys(courseUpdates);
  if (keys.length > 0) {
    const setClauses = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...keys.map((k) => courseUpdates[k])];
    await db.query(`UPDATE courses SET ${setClauses} WHERE id = $1`, values);
  }

  // Sub-collections
  await saveSubCollections(id, instructor_id, highlights, topics, prerequisites, packages);

  return NextResponse.json({ message: 'Kurs güncellendi.' });
}

// ─── DELETE: Kurs sil ────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });

  // Cascade delete sub-collections first
  await Promise.all([
    db.query('DELETE FROM course_highlights WHERE course_id = $1', [id]),
    db.query('DELETE FROM course_topics WHERE course_id = $1', [id]),
    db.query('DELETE FROM course_prerequisites WHERE course_id = $1', [id]),
    db.query('DELETE FROM course_packages WHERE course_id = $1', [id]),
    db.query('DELETE FROM course_instructors WHERE course_id = $1', [id]),
  ]);

  await db.query('DELETE FROM courses WHERE id = $1', [id]);

  return NextResponse.json({ message: 'Kurs silindi.' });
}

// ─── Helper: Sub-collections kaydet ──────────────────────────────
async function saveSubCollections(
  courseId: string,
  instructorId?: string,
  highlights?: string[],
  topics?: string[],
  prerequisites?: string[],
  packages?: { name: string; price: number | null; currency: string; description: string; features: string[]; is_featured: boolean; sort_order: number }[]
) {
  // Eğitmen
  if (instructorId) {
    await db.query('DELETE FROM course_instructors WHERE course_id = $1', [courseId]);
    await db.query(
      'INSERT INTO course_instructors (course_id, instructor_id, is_primary) VALUES ($1, $2, true)',
      [courseId, instructorId]
    );
  }

  // Highlights
  if (highlights !== undefined) {
    await db.query('DELETE FROM course_highlights WHERE course_id = $1', [courseId]);
    const filtered = highlights.filter(h => h.trim());
    for (let i = 0; i < filtered.length; i++) {
      await db.query(
        'INSERT INTO course_highlights (course_id, text, sort_order) VALUES ($1, $2, $3)',
        [courseId, filtered[i], i]
      );
    }
  }

  // Topics
  if (topics !== undefined) {
    await db.query('DELETE FROM course_topics WHERE course_id = $1', [courseId]);
    const filtered = topics.filter(t => t.trim());
    for (let i = 0; i < filtered.length; i++) {
      await db.query(
        'INSERT INTO course_topics (course_id, text, sort_order) VALUES ($1, $2, $3)',
        [courseId, filtered[i], i]
      );
    }
  }

  // Prerequisites
  if (prerequisites !== undefined) {
    await db.query('DELETE FROM course_prerequisites WHERE course_id = $1', [courseId]);
    const filtered = prerequisites.filter(p => p.trim());
    for (let i = 0; i < filtered.length; i++) {
      await db.query(
        'INSERT INTO course_prerequisites (course_id, text, sort_order) VALUES ($1, $2, $3)',
        [courseId, filtered[i], i]
      );
    }
  }

  // Packages
  if (packages !== undefined) {
    await db.query('DELETE FROM course_packages WHERE course_id = $1', [courseId]);
    const filtered = packages.filter(p => p.name.trim());
    for (let i = 0; i < filtered.length; i++) {
      const p = filtered[i];
      await db.query(
        `INSERT INTO course_packages (course_id, name, price, currency, description, features, is_featured, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [courseId, p.name, p.price, p.currency || 'TRY', p.description || '', JSON.stringify(p.features ?? []), p.is_featured ?? false, p.sort_order ?? i]
      );
    }
  }
}
