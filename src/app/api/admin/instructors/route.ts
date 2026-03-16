import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// ─── GET: Tüm eğitmenler ────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { rows: data } = await db.query('SELECT * FROM instructors ORDER BY sort_order');

  // Kurs sayıları
  const { rows: ciRows } = await db.query(
    'SELECT instructor_id, COUNT(*)::int as count FROM course_instructors GROUP BY instructor_id'
  );

  const ciMap: Record<string, number> = {};
  ciRows.forEach((r: { instructor_id: string; count: number }) => {
    ciMap[r.instructor_id] = r.count;
  });

  const result = data.map((ins: Record<string, unknown>) => ({
    ...ins,
    courseCount: ciMap[ins.id as string] ?? 0,
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

  const { rows } = await db.query(
    `INSERT INTO instructors (name, slug, title, department, image, bio, linkedin_url, twitter_url, website_url, specialty, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id, slug`,
    [name, slug, title, department || '', image || null, bio || '', linkedin_url || null, twitter_url || null, website_url || null, specialty || null, sort_order ?? 0, is_active ?? true]
  );

  return NextResponse.json({ id: rows[0]?.id, slug: rows[0]?.slug, message: 'Eğitmen oluşturuldu.' }, { status: 201 });
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

  const keys = Object.keys(updates);
  if (keys.length === 0) return NextResponse.json({ message: 'Güncelleme yok.' });

  const setClauses = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = [id, ...keys.map((k) => updates[k])];

  await db.query(`UPDATE instructors SET ${setClauses} WHERE id = $1`, values);

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

  await db.query('DELETE FROM instructors WHERE id = $1', [id]);

  return NextResponse.json({ message: 'Eğitmen silindi.' });
}
