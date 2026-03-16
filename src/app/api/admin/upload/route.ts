import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });

  // Write file to disk
  const filePath = path.join(uploadDir, uniqueFilename);
  await writeFile(filePath, buffer);

  // Return relative URL (served by Next.js static files)
  const publicUrl = `/uploads/${folder}/${uniqueFilename}`;

  return NextResponse.json({ url: publicUrl }, { status: 201 });
}
