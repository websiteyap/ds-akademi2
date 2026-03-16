import { z } from 'zod';

// ─── Quiz Soru Şeması ─────────────────────────────────────────
export const QuizQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, 'Soru metni zorunludur'),
  question_type: z.enum(['multiple_choice', 'true_false', 'open_ended']),
  options: z.array(z.string()).optional(),
  correct_answer: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().int().min(1),
  sort_order: z.number().int(),
});

// ─── Sınav Şeması ────────────────────────────────────────────
export const QuizSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Sınav başlığı zorunludur'),
  description: z.string().optional(),
  time_limit: z.number().int().min(1).nullable().optional(),
  pass_score: z.number().int().min(0).max(100),
  questions: z.array(QuizQuestionSchema),
});

// ─── Ders Şeması ─────────────────────────────────────────────
export const LessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Ders başlığı zorunludur'),
  content_type: z.enum(['video', 'text', 'quiz']),
  video_url: z.string().optional(),
  text_content: z.string().optional(),
  duration_min: z.number().int().min(0).nullable().optional(),
  is_free: z.boolean(),
  sort_order: z.number().int(),
  quiz: QuizSchema.optional(),
});

// ─── Bölüm Şeması ────────────────────────────────────────────
export const SectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Bölüm başlığı zorunludur'),
  description: z.string().optional(),
  sort_order: z.number().int(),
  lessons: z.array(LessonSchema),
});

// ─── Genel Bilgiler Şeması ────────────────────────────────────
export const GeneralInfoSchema = z.object({
  code: z.string().min(1, 'Kurs kodu zorunludur').max(20),
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır'),
  short_title: z.string().optional(),
  slug: z.string().min(1, 'Slug zorunludur').regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
  category_id: z.string().optional(),
  instructor_id: z.string().optional(),
  level: z.enum(['Temel', 'Orta', 'İleri']),
  duration: z.string(),
  week_count: z.number().int().min(1),
  is_new: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
  highlights: z.array(z.string()),
  prerequisites: z.array(z.string()),
});

// ─── Ayarlar Şeması ──────────────────────────────────────────
export const PackageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Paket adı zorunludur'),
  price: z.number().nullable().optional(),
  currency: z.string(),
  description: z.string().optional(),
  features: z.array(z.string()),
  is_featured: z.boolean(),
  sort_order: z.number().int(),
});

export const SettingsSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']),
  packages: z.array(PackageSchema),
});

// ─── Tam Kurs Builder Şeması ──────────────────────────────────
export const CourseBuilderSchema = z.object({
  id: z.string().optional(),
  general: GeneralInfoSchema,
  curriculum: z.array(SectionSchema),
  settings: SettingsSchema,
});

// ─── JSON Sınav Import Şeması ─────────────────────────────────
export const QuizImportSchema = z.object({
  title: z.string().min(1, 'Sınav başlığı zorunludur'),
  description: z.string().optional(),
  time_limit: z.number().int().min(1).nullable().optional(),
  pass_score: z.number().int().min(0).max(100).optional(),
  questions: z.array(z.object({
    question: z.string().min(1),
    type: z.enum(['multiple_choice', 'true_false', 'open_ended']),
    options: z.array(z.string()).optional(),
    correct_answer: z.string().optional(),
    explanation: z.string().optional(),
    points: z.number().int().min(1).optional(),
  })).min(1, 'En az bir soru gereklidir'),
});

// ─── TypeScript Tipleri ───────────────────────────────────────
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type GeneralInfo = z.infer<typeof GeneralInfoSchema>;
export type CoursePackage = z.infer<typeof PackageSchema>;
export type CourseSettings = z.infer<typeof SettingsSchema>;
export type CourseBuilderData = z.infer<typeof CourseBuilderSchema>;
export type QuizImportData = z.infer<typeof QuizImportSchema>;

// ─── Yardımcı Fonksiyonlar ────────────────────────────────────
export function createEmptyLesson(sortOrder = 0): Lesson {
  return {
    title: '',
    content_type: 'video',
    video_url: '',
    text_content: '',
    duration_min: null,
    is_free: false,
    sort_order: sortOrder,
  };
}

export function createEmptySection(sortOrder = 0): Section {
  return {
    title: '',
    description: '',
    sort_order: sortOrder,
    lessons: [],
  };
}

export function createEmptyQuiz(): Quiz {
  return {
    title: '',
    description: '',
    time_limit: null,
    pass_score: 60,
    questions: [],
  };
}

export function createEmptyQuestion(sortOrder = 0): QuizQuestion {
  return {
    question: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    points: 1,
    sort_order: sortOrder,
  };
}
