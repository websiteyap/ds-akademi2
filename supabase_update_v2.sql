-- ============================================================
-- DS Akademi - Supabase Schema Update v2
-- Mevcut schema'ya bu dosyayı Supabase SQL Editor'de çalıştırın.
-- supabase_schema.sql'i zaten çalıştırdıysanız bunu da çalıştırın.
-- ============================================================

-- Blog yazma yetkisi (sadece eğitmenler için anlamlıdır)
-- Admin bu kolonu true yaparak eğitmene blog erişimi verebilir.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS can_write_blog BOOLEAN NOT NULL DEFAULT false;

-- ============================================================
-- Örnek: Bir eğitmene blog yetkisi vermek için:
-- UPDATE users SET can_write_blog = true WHERE email = 'egitmen@example.com';
-- ============================================================
