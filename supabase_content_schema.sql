-- ============================================================
-- DS Akademi — Content Schema v1
-- Kurslar, Eğitmenler, Kategoriler ve Fiyat Paketleri
-- Çalıştırmadan önce supabase_schema.sql çalıştırılmış olmalıdır.
-- ============================================================

-- ─── Kategoriler ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT NOT NULL DEFAULT 'BookOpen',  -- lucide-react icon adı
  color       TEXT NOT NULL DEFAULT '#3b82f6',
  bg_gradient TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Eğitmenler (halka açık profil) ──────────────────────────
CREATE TABLE IF NOT EXISTS instructors (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  title      TEXT NOT NULL,
  department TEXT,
  image      TEXT,          -- /public yolu, örn: /instructor-onur.png
  bio        TEXT,
  linkedin_url TEXT,
  twitter_url  TEXT,
  website_url  TEXT,
  specialty  TEXT,          -- Anasayfa kartı için kısa uzmanlık
  sort_order INTEGER DEFAULT 0,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Eğitim Geçmişi ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instructor_education (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  degree        TEXT NOT NULL,
  university    TEXT NOT NULL,
  year          TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0
);

-- ─── İş Deneyimi ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instructor_experience (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  role          TEXT NOT NULL,
  institution   TEXT NOT NULL,
  duration      TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0
);

-- ─── Kurslar ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  code        TEXT UNIQUE NOT NULL,   -- DS-101, DS-201 …
  title       TEXT NOT NULL,
  short_title TEXT NOT NULL,
  image       TEXT,
  category_id UUID REFERENCES categories(id),
  level       TEXT NOT NULL CHECK (level IN ('Temel', 'Orta', 'İleri')),
  duration    TEXT NOT NULL,          -- "4 Hafta"
  week_count  INTEGER NOT NULL DEFAULT 4,
  description TEXT,
  is_new      BOOLEAN DEFAULT false,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Kurs ↔ Eğitmen (çoktan-çoğa) ───────────────────────────
CREATE TABLE IF NOT EXISTS course_instructors (
  course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  is_primary    BOOLEAN DEFAULT true,
  PRIMARY KEY (course_id, instructor_id)
);

-- ─── Öğrenme Çıktıları (highlights) ──────────────────────────
CREATE TABLE IF NOT EXISTS course_highlights (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ─── Müfredat Konuları ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_topics (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ─── Ön Koşullar ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_prerequisites (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ─── Fiyat Paketleri ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_packages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,        -- "Bireysel", "Kurumsal" …
  price       NUMERIC(10,2),
  currency    TEXT DEFAULT 'TRY',
  description TEXT,
  features    TEXT[],               -- paket özellikleri listesi
  is_featured BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0
);

-- ─── Trigger: courses.updated_at ─────────────────────────────
CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_courses_slug        ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category    ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_active      ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_instructors_slug    ON instructors(slug);
CREATE INDEX IF NOT EXISTS idx_course_instr_course ON course_instructors(course_id);
CREATE INDEX IF NOT EXISTS idx_course_instr_instr  ON course_instructors(instructor_id);
CREATE INDEX IF NOT EXISTS idx_highlights_course   ON course_highlights(course_id);
CREATE INDEX IF NOT EXISTS idx_topics_course       ON course_topics(course_id);
CREATE INDEX IF NOT EXISTS idx_prereqs_course      ON course_prerequisites(course_id);
CREATE INDEX IF NOT EXISTS idx_packages_course     ON course_packages(course_id);
