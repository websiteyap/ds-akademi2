-- ============================================================
-- DS Akademi - Supabase Schema Update v3
-- Dashboard yönetim paneli için gerekli güncellemeler
-- supabase_update_v2.sql çalıştırıldıktan SONRA çalıştırın.
-- ============================================================

-- ─── 1. Kullanıcı engelleme ──────────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT false;

-- ─── 2. Politika sayfaları tablosu ───────────────────────────
CREATE TABLE IF NOT EXISTS policy_pages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       TEXT UNIQUE NOT NULL,   -- 'kullanim-kosullari', 'gizlilik-politikasi', 'kvkk', 'cerez-politikasi'
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,           -- HTML içerik
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER policy_pages_updated_at
  BEFORE UPDATE ON policy_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_policy_pages_slug ON policy_pages(slug);

-- ─── 3. Seed: mevcut politika sayfalarının başlıkları ────────
-- İçerikleri admin dashboard'dan düzenlenecek.
INSERT INTO policy_pages (slug, title, content) VALUES
  ('kullanim-kosullari',   'Kullanım Koşulları',      '<p>İçerik admin panelinden düzenlenecektir.</p>'),
  ('gizlilik-politikasi',  'Gizlilik Politikası',     '<p>İçerik admin panelinden düzenlenecektir.</p>'),
  ('kvkk',                 'KVKK Aydınlatma Metni',   '<p>İçerik admin panelinden düzenlenecektir.</p>'),
  ('cerez-politikasi',     'Çerez Politikası',        '<p>İçerik admin panelinden düzenlenecektir.</p>')
ON CONFLICT (slug) DO NOTHING;
