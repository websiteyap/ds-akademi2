import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// ─── GET: Site ayarları ──────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { rows } = await db.query('SELECT * FROM site_settings LIMIT 1');
  if (rows.length === 0) return NextResponse.json({ error: 'Ayarlar bulunamadı.' }, { status: 404 });

  return NextResponse.json(rows[0]);
}

// ─── PUT: Site ayarları güncelle ─────────────────────────────────
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

  await db.query(`UPDATE site_settings SET ${setClauses} WHERE id = $1`, values);

  return NextResponse.json({ message: 'Site ayarları güncellendi.' });
}
