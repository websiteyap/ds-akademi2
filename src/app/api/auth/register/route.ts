import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Ad soyad, e-posta ve şifre zorunludur.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const { rows: existing } = await db.query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kayıtlı.' },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const { rows: newUser } = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'student') RETURNING id, name, email, role`,
      [name.trim(), normalizedEmail, password_hash]
    );

    if (!newUser[0]) {
      return NextResponse.json(
        { error: 'Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Hesabınız başarıyla oluşturuldu.', userId: newUser[0].id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Register route error:', err);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
