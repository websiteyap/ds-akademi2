import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import type { Section, Lesson, Quiz } from '@/lib/course-builder-schema';

// ─── GET: Kursun tüm müfredat ağacını getir ──────────────────
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');
  if (!courseId) return NextResponse.json({ error: 'courseId zorunludur.' }, { status: 400 });

  // Bölümleri getir
  const { rows: sections } = await db.query(
    'SELECT * FROM course_sections WHERE course_id = $1 ORDER BY sort_order',
    [courseId]
  );

  if (sections.length === 0) {
    return NextResponse.json({ sections: [] });
  }

  const sectionIds = sections.map((s: { id: string }) => s.id);

  // Dersleri getir
  const { rows: lessons } = await db.query(
    'SELECT * FROM course_lessons WHERE section_id = ANY($1) ORDER BY sort_order',
    [sectionIds]
  );

  const lessonIds = lessons.map((l: { id: string }) => l.id);

  // Sınavları getir
  let quizzes: Record<string, unknown>[] = [];
  let questions: Record<string, unknown>[] = [];

  if (lessonIds.length > 0) {
    const { rows: quizData } = await db.query(
      'SELECT * FROM course_quizzes WHERE lesson_id = ANY($1)',
      [lessonIds]
    );
    quizzes = quizData;

    const quizIds = quizzes.map((q) => q.id as string);
    if (quizIds.length > 0) {
      const { rows: qData } = await db.query(
        'SELECT * FROM quiz_questions WHERE quiz_id = ANY($1) ORDER BY sort_order',
        [quizIds]
      );
      questions = qData;
    }
  }

  // Ağacı birleştir
  const quizMap = new Map<string, Record<string, unknown>>();
  for (const quiz of quizzes) {
    const quizQuestions = questions.filter((q) => q.quiz_id === quiz.id);
    quizMap.set(quiz.lesson_id as string, { ...quiz, questions: quizQuestions });
  }

  const lessonMap = new Map<string, Record<string, unknown>[]>();
  for (const lesson of lessons) {
    const sectionId = lesson.section_id as string;
    if (!lessonMap.has(sectionId)) lessonMap.set(sectionId, []);
    const quiz = quizMap.get(lesson.id as string);
    lessonMap.get(sectionId)!.push({ ...lesson, quiz: quiz ?? null });
  }

  const tree = sections.map((section: Record<string, unknown>) => ({
    ...section,
    lessons: lessonMap.get(section.id as string) ?? [],
  }));

  return NextResponse.json({ sections: tree });
}

// ─── POST: Müfredatı kaydet (upsert) ─────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = session.user as { role?: string };
  if (user.role !== 'admin' && user.role !== 'instructor') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { courseId, sections } = body as { courseId: string; sections: Section[] };

  if (!courseId) return NextResponse.json({ error: 'courseId zorunludur.' }, { status: 400 });

  try {
    // Mevcut tüm bölümleri sil (cascade ile dersler ve sınavlar da silinir)
    await db.query('DELETE FROM course_sections WHERE course_id = $1', [courseId]);

    if (!sections || sections.length === 0) {
      return NextResponse.json({ message: 'Müfredat kaydedildi (boş).' });
    }

    // Bölümleri ekle
    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];

      const { rows: secRows } = await db.query(
        `INSERT INTO course_sections (course_id, title, description, sort_order)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [courseId, section.title, section.description ?? '', si]
      );

      if (!secRows[0]) {
        throw new Error('Bölüm kaydedilemedi');
      }

      const sectionId = secRows[0].id;

      // Dersleri ekle
      if (section.lessons && section.lessons.length > 0) {
        for (let li = 0; li < section.lessons.length; li++) {
          const lesson = section.lessons[li] as Lesson;

          const { rows: lesRows } = await db.query(
            `INSERT INTO course_lessons (section_id, title, content_type, video_url, text_content, duration_min, is_free, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [sectionId, lesson.title, lesson.content_type, lesson.video_url ?? null, lesson.text_content ?? null, lesson.duration_min ?? null, lesson.is_free ?? false, li]
          );

          if (!lesRows[0]) {
            throw new Error('Ders kaydedilemedi');
          }

          const lessonId = lesRows[0].id;

          // Sınav ekle (content_type === 'quiz' ise)
          if (lesson.content_type === 'quiz' && lesson.quiz) {
            const quiz = lesson.quiz as Quiz;

            const { rows: quizRows } = await db.query(
              `INSERT INTO course_quizzes (lesson_id, title, description, time_limit, pass_score)
               VALUES ($1, $2, $3, $4, $5) RETURNING id`,
              [lessonId, quiz.title || lesson.title, quiz.description ?? '', quiz.time_limit ?? null, quiz.pass_score ?? 60]
            );

            if (!quizRows[0]) {
              throw new Error('Sınav kaydedilemedi');
            }

            const quizId = quizRows[0].id;

            // Soruları ekle
            if (quiz.questions && quiz.questions.length > 0) {
              for (let qi = 0; qi < quiz.questions.length; qi++) {
                const q = quiz.questions[qi];
                await db.query(
                  `INSERT INTO quiz_questions (quiz_id, question, question_type, options, correct_answer, explanation, points, sort_order)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                  [quizId, q.question, q.question_type, q.options ? JSON.stringify(q.options) : null, q.correct_answer ?? null, q.explanation ?? null, q.points ?? 1, qi]
                );
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ message: 'Müfredat başarıyla kaydedildi.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PUT: Kurs genel bilgilerini + durumunu güncelle ──────────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = session.user as { role?: string };
  if (user.role !== 'admin' && user.role !== 'instructor') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const body = await req.json();
  const { courseId, status } = body;

  if (!courseId) return NextResponse.json({ error: 'courseId zorunludur.' }, { status: 400 });

  await db.query(
    'UPDATE courses SET status = $1, updated_at = NOW() WHERE id = $2',
    [status, courseId]
  );

  return NextResponse.json({ message: 'Kurs durumu güncellendi.' });
}
