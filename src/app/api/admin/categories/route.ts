import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

// ─── GET: Tüm kategoriler ────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('sort_order');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Kurs sayılarını hesapla
  const { data: counts } = await supabaseAdmin
    .from('courses')
    .select('category_id')
    .eq('is_active', true);

  const countMap: Record<string, number> = {};
  (counts ?? []).forEach((c: { category_id: string | null }) => {
    if (c.category_id) countMap[c.category_id] = (countMap[c.category_id] ?? 0) + 1;
  });

  const result = (data ?? []).map((cat) => ({
    ...cat,
    courseCount: countMap[cat.id] ?? 0,
  }));

  return NextResponse.json(result);
}

// ─── POST: Yeni kategori ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, icon, color, bg_gradient, sort_order } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: 'Ad ve slug zorunludur.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name, slug,
      description: description || '',
      icon: icon || 'BookOpen',
      color: color || '#3b82f6',
      bg_gradient: bg_gradient || null,
      sort_order: sort_order ?? 0,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data?.id, message: 'Kategori oluşturuldu.' }, { status: 201 });
}

// ─── PUT: Kategori güncelle ──────────────────────────────────────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('categories')
    .update(updates)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Kategori güncellendi.' });
}

// ─── DELETE: Kategori sil ────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });

  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Kategori silindi.' });
}
