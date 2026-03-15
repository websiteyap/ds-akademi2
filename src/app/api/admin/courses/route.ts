import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

// ─── GET: Kurslar veya tek kurs detayı ───────────────────────────
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // Tek kurs detayı (sub-collections dahil)
  if (id) {
    const [hlRes, topRes, preRes, pkgRes] = await Promise.all([
      supabaseAdmin.from('course_highlights').select('text').eq('course_id', id).order('sort_order'),
      supabaseAdmin.from('course_topics').select('text').eq('course_id', id).order('sort_order'),
      supabaseAdmin.from('course_prerequisites').select('text').eq('course_id', id).order('sort_order'),
      supabaseAdmin.from('course_packages').select('*').eq('course_id', id).order('sort_order'),
    ]);
    return NextResponse.json({
      highlights: (hlRes.data ?? []).map((r: { text: string }) => r.text),
      topics: (topRes.data ?? []).map((r: { text: string }) => r.text),
      prerequisites: (preRes.data ?? []).map((r: { text: string }) => r.text),
      packages: (pkgRes.data ?? []).map((p) => ({
        id: (p as Record<string, unknown>).id,
        name: (p as Record<string, unknown>).name,
        price: (p as Record<string, unknown>).price,
        currency: (p as Record<string, unknown>).currency ?? 'TRY',
        description: (p as Record<string, unknown>).description ?? '',
        features: (p as Record<string, unknown>).features ?? [],
        is_featured: (p as Record<string, unknown>).is_featured ?? false,
        sort_order: (p as Record<string, unknown>).sort_order ?? 0,
      })),
    });
  }

  // Tüm kurslar listesi
  const user = session.user as { role?: string };
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select(`
      id, slug, code, title, short_title, image, level, duration, week_count,
      description, is_new, is_active, sort_order, created_at, updated_at, category_id,
      categories ( id, slug, name ),
      course_instructors ( is_primary, instructors ( id, slug, name, title ) )
    `)
    .order('sort_order');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Eğitmen: sadece kendi kurslarını filtrele (gelecekte)
  if (user.role !== 'admin' && user.role !== 'instructor') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  return NextResponse.json(data ?? []);
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

  const { data, error } = await supabaseAdmin
    .from('courses')
    .insert({
      title, short_title: short_title || title, code, slug,
      category_id: category_id || null,
      level: level || 'Temel', duration: duration || '4 Hafta',
      week_count: week_count || 4, description: description || '',
      image: image || null, is_new: is_new ?? false, is_active: is_active ?? true,
      sort_order: sort_order ?? 0,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const courseId = data?.id;
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

  const { error } = await supabaseAdmin.from('courses').update(courseUpdates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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
    supabaseAdmin.from('course_highlights').delete().eq('course_id', id),
    supabaseAdmin.from('course_topics').delete().eq('course_id', id),
    supabaseAdmin.from('course_prerequisites').delete().eq('course_id', id),
    supabaseAdmin.from('course_packages').delete().eq('course_id', id),
    supabaseAdmin.from('course_instructors').delete().eq('course_id', id),
  ]);

  const { error } = await supabaseAdmin.from('courses').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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
    await supabaseAdmin.from('course_instructors').delete().eq('course_id', courseId);
    await supabaseAdmin.from('course_instructors').insert({ course_id: courseId, instructor_id: instructorId, is_primary: true });
  }

  // Highlights
  if (highlights !== undefined) {
    await supabaseAdmin.from('course_highlights').delete().eq('course_id', courseId);
    if (highlights.length > 0) {
      await supabaseAdmin.from('course_highlights').insert(
        highlights.filter(h => h.trim()).map((text, i) => ({ course_id: courseId, text, sort_order: i }))
      );
    }
  }

  // Topics
  if (topics !== undefined) {
    await supabaseAdmin.from('course_topics').delete().eq('course_id', courseId);
    if (topics.length > 0) {
      await supabaseAdmin.from('course_topics').insert(
        topics.filter(t => t.trim()).map((text, i) => ({ course_id: courseId, text, sort_order: i }))
      );
    }
  }

  // Prerequisites
  if (prerequisites !== undefined) {
    await supabaseAdmin.from('course_prerequisites').delete().eq('course_id', courseId);
    if (prerequisites.length > 0) {
      await supabaseAdmin.from('course_prerequisites').insert(
        prerequisites.filter(p => p.trim()).map((text, i) => ({ course_id: courseId, text, sort_order: i }))
      );
    }
  }

  // Packages
  if (packages !== undefined) {
    await supabaseAdmin.from('course_packages').delete().eq('course_id', courseId);
    if (packages.length > 0) {
      await supabaseAdmin.from('course_packages').insert(
        packages.filter(p => p.name.trim()).map((p, i) => ({
          course_id: courseId,
          name: p.name, price: p.price, currency: p.currency || 'TRY',
          description: p.description || '', features: p.features ?? [],
          is_featured: p.is_featured ?? false, sort_order: p.sort_order ?? i,
        }))
      );
    }
  }
}
