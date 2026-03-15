import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

// ─── GET: Tüm kullanıcılar ──────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role, is_blocked, can_write_blog, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}

// ─── PUT: Kullanıcı güncelle (engelle/kaldır, rol değiştir) ─────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const currentUser = session.user as { id?: string; role?: string };
  if (currentUser.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });

  // Admin kendini engelleyemez
  if (id === currentUser.id && updates.is_blocked === true) {
    return NextResponse.json({ error: 'Kendinizi engelleyemezsiniz.' }, { status: 400 });
  }

  // Admin kendisinin rolünü değiştiremez
  if (id === currentUser.id && updates.role && updates.role !== 'admin') {
    return NextResponse.json({ error: 'Kendi rolünüzü değiştiremezsiniz.' }, { status: 400 });
  }

  // Sadece izin verilen alanları güncelle
  const allowedFields: Record<string, unknown> = {};
  if (updates.is_blocked !== undefined) allowedFields.is_blocked = updates.is_blocked;
  if (updates.role !== undefined) allowedFields.role = updates.role;
  if (updates.can_write_blog !== undefined) allowedFields.can_write_blog = updates.can_write_blog;
  if (updates.name !== undefined) allowedFields.name = updates.name;

  const { error } = await supabaseAdmin
    .from('users')
    .update(allowedFields)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Kullanıcı güncellendi.' });
}
