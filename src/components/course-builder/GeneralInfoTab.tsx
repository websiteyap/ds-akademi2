"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronUp, ChevronDown, X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { CourseBuilderData } from "@/lib/course-builder-schema";

interface CategoryOption { id: string; name: string; }
interface InstructorOption { id: string; name: string; }

interface GeneralInfoTabProps {
  categories: CategoryOption[];
  instructors: InstructorOption[];
}

// ─── String List Editor ───────────────────────────────────────
function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const add = () => onChange([...items, ""]);
  const update = (i: number, v: string) => {
    const n = [...items];
    n[i] = v;
    onChange(n);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const n = [...items];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</label>
        <button
          type="button"
          onClick={add}
          className="text-xs font-semibold text-[var(--accent-color)] hover:underline"
        >
          + Ekle
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-xs text-[var(--text-secondary)] w-5 text-center">{i + 1}</span>
          <input
            type="text"
            className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => move(i, -1)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ChevronUp size={12} />
          </button>
          <button type="button" onClick={() => move(i, 1)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ChevronDown size={12} />
          </button>
          <button type="button" onClick={() => remove(i)} className="p-1 text-red-500 hover:text-red-400">
            <X size={12} />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-[var(--text-secondary)] italic">Henüz öğe eklenmedi.</p>
      )}
    </div>
  );
}

// ─── Ana Bileşen ──────────────────────────────────────────────
export default function GeneralInfoTab({ categories, instructors }: GeneralInfoTabProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CourseBuilderData>();

  const [uploading, setUploading] = useState(false);
  const image = watch("general.image");
  const title = watch("general.title");
  const highlights = watch("general.highlights") ?? [];
  const prerequisites = watch("general.prerequisites") ?? [];

  // Başlıktan otomatik slug üret
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("general.slug", slug, { shouldValidate: false });
    }
  }, [title, setValue]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "courses");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setValue("general.image", data.url);
      }
    } catch {
      // hata yoksay
    }
    setUploading(false);
  };

  const inputCls = "w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors";
  const errorCls = "text-xs text-red-400 mt-1";
  const labelCls = "text-xs font-semibold text-[var(--text-secondary)] mb-1 block";

  return (
    <div className="space-y-6">
      {/* ─── Temel Bilgiler ─── */}
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Temel Bilgiler</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Kurs Kodu *</label>
            <input
              {...register("general.code")}
              className={inputCls}
              placeholder="DS-101"
            />
            {errors.general?.code && <p className={errorCls}>{errors.general.code.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input
              {...register("general.slug")}
              className={inputCls}
              placeholder="temel-celik-yapi"
            />
            {errors.general?.slug && <p className={errorCls}>{errors.general.slug.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Sıralama</label>
            <input
              type="number"
              {...register("general.sort_order", { valueAsNumber: true })}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Başlık *</label>
          <input
            {...register("general.title")}
            className={inputCls}
            placeholder="Temel Çelik Yapı Tasarımı Eğitimi"
          />
          {errors.general?.title && <p className={errorCls}>{errors.general.title.message}</p>}
        </div>

        <div>
          <label className={labelCls}>Kısa Başlık</label>
          <input
            {...register("general.short_title")}
            className={inputCls}
            placeholder="Kısa başlık (kart görünümü için)"
          />
        </div>

        <div>
          <label className={labelCls}>Açıklama</label>
          <textarea
            {...register("general.description")}
            className={`${inputCls} min-h-[100px] resize-y`}
            placeholder="Kurs hakkında detaylı açıklama..."
          />
        </div>
      </section>

      {/* ─── Kurs Görseli ─── */}
      <section className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Kurs Görseli</p>
        <div className="flex items-start gap-4">
          {image ? (
            <div className="w-32 h-20 rounded-sm overflow-hidden relative border border-[var(--border-color)] shrink-0">
              <Image src={image} alt="Kurs" fill className="object-cover" sizes="128px" />
            </div>
          ) : (
            <div className="w-32 h-20 rounded-sm bg-[var(--bg-tertiary)] flex items-center justify-center border border-dashed border-[var(--border-color)] shrink-0">
              <ImageIcon size={24} className="text-[var(--text-secondary)]" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-[var(--border-color)] rounded-sm cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors w-fit">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Resim Yükle
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                }}
              />
            </label>
            <input
              type="text"
              placeholder="veya URL girin"
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              value={image ?? ""}
              onChange={(e) => setValue("general.image", e.target.value || null)}
            />
          </div>
        </div>
      </section>

      {/* ─── Kategori, Eğitmen, Seviye ─── */}
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Kategori & Eğitmen</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Kategori</label>
            <select {...register("general.category_id")} className={inputCls}>
              <option value="">Seçiniz</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Ana Eğitmen</label>
            <select {...register("general.instructor_id")} className={inputCls}>
              <option value="">Seçiniz</option>
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Seviye</label>
            <select {...register("general.level")} className={inputCls}>
              <option value="Temel">Temel</option>
              <option value="Orta">Orta</option>
              <option value="İleri">İleri</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>Süre</label>
            <input {...register("general.duration")} className={inputCls} placeholder="4 Hafta" />
          </div>
          <div>
            <label className={labelCls}>Hafta Sayısı</label>
            <input
              type="number"
              min={1}
              {...register("general.week_count", { valueAsNumber: true })}
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="is_active"
              {...register("general.is_active")}
              className="w-4 h-4 accent-[var(--accent-color)]"
            />
            <label htmlFor="is_active" className="text-sm text-[var(--text-primary)] cursor-pointer">Aktif</label>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="is_new"
              {...register("general.is_new")}
              className="w-4 h-4 accent-[var(--accent-color)]"
            />
            <label htmlFor="is_new" className="text-sm text-[var(--text-primary)] cursor-pointer">Yeni</label>
          </div>
        </div>
      </section>

      {/* ─── Öğrenme Çıktıları ─── */}
      <section className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Öğrenme Çıktıları</p>
        <StringListEditor
          label="Bu Eğitimde Neler Öğreneceksiniz?"
          items={highlights}
          onChange={(v) => setValue("general.highlights", v)}
          placeholder="Öğrenme çıktısı..."
        />
      </section>

      {/* ─── Ön Koşullar ─── */}
      <section className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Ön Koşullar</p>
        <StringListEditor
          label="Ön Koşullar"
          items={prerequisites}
          onChange={(v) => setValue("general.prerequisites", v)}
          placeholder="Ön koşul..."
        />
      </section>
    </div>
  );
}
