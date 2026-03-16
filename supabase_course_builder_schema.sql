-- ============================================================
-- DS Akademi — Course Builder Schema (LMS Müfredat Yapısı)
-- Mevcut supabase_content_schema.sql üzerine eklenir.
-- ============================================================

-- ─── Kurs durumu alanı ───────────────────────────────────────
ALTER TABLE courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' 
  CHECK (status IN ('draft', 'published', 'archived'));

-- ─── Kurs Bölümleri (Sections) ───────────────────────────────
CREATE TABLE IF NOT EXISTS course_sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Dersler (Lessons) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_lessons (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id   UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'video' 
    CHECK (content_type IN ('video', 'text', 'quiz')),
  video_url    TEXT,
  text_content TEXT,           -- Rich text (HTML)
  duration_min INTEGER,        -- Tahmini süre (dakika)
  is_free      BOOLEAN DEFAULT false,  -- Ücretsiz önizleme
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Sınavlar (Quizzes) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_quizzes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id   UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  time_limit  INTEGER,         -- Süre limiti (dakika), NULL = sınırsız
  pass_score  INTEGER DEFAULT 60,  -- Geçme notu (%)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Sınav Soruları ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_questions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id        UUID NOT NULL REFERENCES course_quizzes(id) ON DELETE CASCADE,
  question       TEXT NOT NULL,
  question_type  TEXT NOT NULL DEFAULT 'multiple_choice'
    CHECK (question_type IN ('multiple_choice', 'true_false', 'open_ended')),
  options        JSONB,         -- ["A seçeneği", "B seçeneği", ...]
  correct_answer TEXT,
  explanation    TEXT,
  points         INTEGER DEFAULT 1,
  sort_order     INTEGER DEFAULT 0
);

-- ─── Triggers: updated_at ────────────────────────────────────
CREATE TRIGGER course_sections_updated_at
  BEFORE UPDATE ON course_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER course_lessons_updated_at
  BEFORE UPDATE ON course_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER course_quizzes_updated_at
  BEFORE UPDATE ON course_quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sections_course    ON course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_sections_order     ON course_sections(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lessons_section    ON course_lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order      ON course_lessons(section_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson     ON course_quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions     ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_q_order       ON quiz_questions(quiz_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_courses_status     ON courses(status);
