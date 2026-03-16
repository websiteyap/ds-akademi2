import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { QuizImportSchema } from '@/lib/course-builder-schema';

// ─── POST: JSON dosyasından sınav import et ───────────────────
// Body: { lessonId: string, quizData: QuizImportData }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = session.user as { role?: string };
  if (user.role !== 'admin' && user.role !== 'instructor') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON formatı.' }, { status: 400 });
  }

  const { lessonId, quizData } = body as { lessonId?: string; quizData?: unknown };

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId zorunludur.' }, { status: 400 });
  }

  // Zod validasyonu
  const parsed = QuizImportSchema.safeParse(quizData);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz sınav formatı.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    // Mevcut sınavı sil (varsa)
    await db.query('DELETE FROM course_quizzes WHERE lesson_id = $1', [lessonId]);

    // Yeni sınav oluştur
    const { rows: quizRows } = await db.query(
      `INSERT INTO course_quizzes (lesson_id, title, description, time_limit, pass_score)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [lessonId, data.title, data.description ?? '', data.time_limit ?? null, data.pass_score ?? 60]
    );

    if (!quizRows[0]) {
      throw new Error('Sınav oluşturulamadı');
    }

    const quizId = quizRows[0].id;

    // Soruları ekle
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      await db.query(
        `INSERT INTO quiz_questions (quiz_id, question, question_type, options, correct_answer, explanation, points, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [quizId, q.question, q.type, q.options ? JSON.stringify(q.options) : null, q.correct_answer ?? null, q.explanation ?? null, q.points ?? 1, i]
      );
    }

    return NextResponse.json({
      message: `Sınav başarıyla import edildi. ${data.questions.length} soru eklendi.`,
      quizId,
      questionCount: data.questions.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── GET: Sınav şemasını döndür (örnek JSON) ─────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const exampleSchema = {
    title: 'Örnek Sınav Başlığı',
    description: 'Sınav açıklaması (isteğe bağlı)',
    time_limit: 30,
    pass_score: 70,
    questions: [
      {
        question: 'Çelik yapılarda en yaygın birleşim türü nedir?',
        type: 'multiple_choice',
        options: ['Kaynaklı', 'Bulonlu', 'Perçinli', 'Yapıştırmalı'],
        correct_answer: 'Bulonlu',
        explanation: 'Modern çelik yapılarda bulonlu birleşimler en yaygın kullanılan türdür.',
        points: 2,
      },
      {
        question: 'Betonarme yapılarda donatı oranı %1 ile %4 arasında olmalıdır.',
        type: 'true_false',
        correct_answer: 'true',
        explanation: 'TS 500 standardına göre minimum donatı oranı %0.8, maksimum %4\'tür.',
        points: 1,
      },
      {
        question: 'Depreme dayanıklı yapı tasarımında en önemli parametre nedir? Açıklayınız.',
        type: 'open_ended',
        points: 5,
      },
    ],
  };

  return NextResponse.json({ schema: exampleSchema });
}
