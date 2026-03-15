import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

// ─── GET: Tüm eğitmenler ────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('instructors')
    .select('*')
    .order('sort_order');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Kurs sayıları
  const { data: ciRows } = await supabaseAdmin
    .from('course_instructors')
    .select('instructor_id');

  const ciMap: Record<string, number> = {};
  (ciRows ?? []).forEach((r: { instructor_id: string }) => {
    ciMap[r.instructor_id] = (ciMap[r.instructor_id] ?? 0) + 1;
  });

  const result = (data ?? []).map((ins) => ({
    ...ins,
    courseCount: ciMap[ins.id] ?? 0,
  }));

  return NextResponse.json(result);
}

// ─── POST: Yeni eğitmen ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const body = await req.json();
  const { name, title, department, image, bio, linkedin_url, twitter_url, website_url, specialty, sort_order, is_active } = body;

  if (!name || !title) {
    return NextResponse.json({ error: 'Ad ve unvan zorunludur.' }, { status: 400 });
  }

  // Slug otomatik oluştur
  const slug = name
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/Ğ/g, 'g').replace(/Ü/g, 'u').replace(/Ş/g, 's')
    .replace(/İ/g, 'i').replace(/Ö/g, 'o').replace(/Ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const { data, error } = await supabaseAdmin
    .from('instructors')
    .insert({
      name, slug, title,
      department: department || '',
      image: image || null,
      bio: bio || '',
      linkedin_url: linkedin_url || null,
      twitter_url: twitter_url || null,
      website_url: website_url || null,
      specialty: specialty || null,
      sort_order: sort_order ?? 0,
      is_active: is_active ?? true,
    })
    .select('id, slug')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data?.id, slug: data?.slug, message: 'Eğitmen oluşturuldu.' }, { status: 201 });
}

// ─── PUT: Eğitmen güncelle ───────────────────────────────────────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('instructors')
    .update(updates)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Eğitmen güncellendi.' });
}

// ─── DELETE: Eğitmen sil ─────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });

  const { error } = await supabaseAdmin.from('instructors').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Eğitmen silindi.' });
}
