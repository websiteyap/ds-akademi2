import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';

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
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kayıtlı.' },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        password_hash,
        role: 'student',
      })
      .select('id, name, email, role')
      .single();

    if (error || !newUser) {
      console.error('User creation error:', error);
      return NextResponse.json(
        { error: 'Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Hesabınız başarıyla oluşturuldu.', userId: newUser.id },
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
