import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// ─── GET: Tüm kategoriler ────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { rows: data } = await db.query('SELECT * FROM categories ORDER BY sort_order');

  // Kurs sayılarını hesapla
  const { rows: counts } = await db.query(
    "SELECT category_id, COUNT(*)::int as count FROM courses WHERE is_active = true GROUP BY category_id"
  );

  const countMap: Record<string, number> = {};
  counts.forEach((c: { category_id: string; count: number }) => {
    if (c.category_id) countMap[c.category_id] = c.count;
  });

  const result = data.map((cat: Record<string, unknown>) => ({
    ...cat,
    courseCount: countMap[cat.id as string] ?? 0,
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

  const { rows } = await db.query(
    `INSERT INTO categories (name, slug, description, icon, color, bg_gradient, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [name, slug, description || '', icon || 'BookOpen', color || '#3b82f6', bg_gradient || null, sort_order ?? 0]
  );

  return NextResponse.json({ id: rows[0]?.id, message: 'Kategori oluşturuldu.' }, { status: 201 });
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

  const keys = Object.keys(updates);
  if (keys.length === 0) return NextResponse.json({ message: 'Güncelleme yok.' });

  const setClauses = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = [id, ...keys.map((k) => updates[k])];

  await db.query(`UPDATE categories SET ${setClauses} WHERE id = $1`, values);

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

  await db.query('DELETE FROM categories WHERE id = $1', [id]);

  return NextResponse.json({ message: 'Kategori silindi.' });
}
