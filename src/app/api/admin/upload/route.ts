import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as { role?: string };
  if (user.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'uploads';

  if (!file) return NextResponse.json({ error: 'Dosya zorunludur.' }, { status: 400 });

  // Convert to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Upload to Supabase Storage
  const { error } = await supabaseAdmin.storage
    .from('public-assets')
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from('public-assets')
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
}
