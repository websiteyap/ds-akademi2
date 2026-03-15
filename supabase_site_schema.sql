-- ============================================================
-- DS Akademi — Site Ayarları, SSS, Hakkımızda Schema
-- supabase_content_schema.sql'den SONRA çalıştırın.
-- ============================================================

-- ─── Site Ayarları (tek satır, key-value değil tek tablo) ────
CREATE TABLE IF NOT EXISTS site_settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name     TEXT NOT NULL DEFAULT 'DS Akademi',
  site_logo     TEXT,           -- /public yolu
  tagline       TEXT,

  -- Footer hakkında metni
  footer_about  TEXT,

  -- İletişim bilgileri
  phone         TEXT,
  email         TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  working_hours TEXT,

  -- Harita embed URL
  maps_embed_url TEXT,

  -- Sosyal medya linkleri
  linkedin_url  TEXT,
  instagram_url TEXT,
  twitter_url   TEXT,
  youtube_url   TEXT,

  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: site_settings.updated_at
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── SSS Kategorileri ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faq_categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT 'HelpCircle',  -- lucide icon adı
  sort_order INTEGER DEFAULT 0
);

-- ─── SSS Soruları ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES faq_categories(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

-- ─── Hakkımızda Bölümleri ─────────────────────────────────────
-- Birden fazla bölüm (stats, misyon paragrafları, değerler) yönetmek için
CREATE TABLE IF NOT EXISTS about_sections (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section    TEXT NOT NULL,  -- 'stat', 'mission_paragraph', 'value'
  title      TEXT,
  content    TEXT,
  icon       TEXT,           -- lucide icon adı
  sort_order INTEGER DEFAULT 0,
  is_active  BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_faqs_active   ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_about_section ON about_sections(section);
