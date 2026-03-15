"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Save, X, Search, Loader2, Check, AlertTriangle, ChevronUp, ChevronDown, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

/* ─── Types ─── */
interface CategoryOption { id: string; name: string; slug: string; }
interface InstructorOption { id: string; name: string; slug: string; }
interface PackageRow { id?: string; name: string; price: number | null; currency: string; description: string; features: string[]; is_featured: boolean; sort_order: number; }
interface CourseRow {
  id: string; code: string; title: string; short_title: string; slug: string; image: string | null;
  level: string; duration: string; week_count: number; description: string;
  is_new: boolean; is_active: boolean; sort_order: number; category_id: string | null;
  categories?: { id: string; name: string } | null;
  course_instructors?: { is_primary: boolean; instructors: { id: string; name: string; title: string } }[];
}

interface CourseFormData {
  id?: string; code: string; title: string; short_title: string; slug: string;
  image: string | null; level: string; duration: string; week_count: number;
  description: string; is_new: boolean; is_active: boolean; sort_order: number;
  category_id: string; instructor_id: string;
  highlights: string[]; topics: string[]; prerequisites: string[]; packages: PackageRow[];
}

const emptyForm: CourseFormData = {
  code: "", title: "", short_title: "", slug: "", image: null, level: "Temel",
  duration: "4 Hafta", week_count: 4, description: "", is_new: false, is_active: true,
  sort_order: 0, category_id: "", instructor_id: "",
  highlights: [], topics: [], prerequisites: [], packages: [],
};

/* ─── Toast ─── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-lg ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}{message}
    </div>
  );
}

/* ─── String List Editor ─── */
function StringListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const add = () => onChange([...items, ""]);
  const update = (i: number, v: string) => { const n = [...items]; n[i] = v; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const n = [...items]; const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; onChange(n);
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</label>
        <button type="button" onClick={add} className="text-xs font-semibold text-[var(--accent-color)] hover:underline">+ Ekle</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-xs text-[var(--text-secondary)] w-5 text-center">{i + 1}</span>
          <input type="text" className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)]" value={item} onChange={e => update(i, e.target.value)} />
          <button type="button" onClick={() => move(i, -1)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><ChevronUp size={12} /></button>
          <button type="button" onClick={() => move(i, 1)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><ChevronDown size={12} /></button>
          <button type="button" onClick={() => remove(i)} className="p-1 text-red-500 hover:text-red-400"><X size={12} /></button>
        </div>
      ))}
      {items.length === 0 && <p className="text-xs text-[var(--text-secondary)] italic">Henüz öğe eklenmedi.</p>}
    </div>
  );
}

/* ─── Package Editor ─── */
function PackageEditor({ packages, onChange }: { packages: PackageRow[]; onChange: (v: PackageRow[]) => void }) {
  const add = () => onChange([...packages, { name: "", price: null, currency: "TRY", description: "", features: [], is_featured: false, sort_order: packages.length }]);
  const update = (i: number, key: string, val: unknown) => { const n = [...packages]; (n[i] as unknown as Record<string, unknown>)[key] = val; onChange(n); };
  const remove = (i: number) => onChange(packages.filter((_, idx) => idx !== i));
  const updateFeature = (pi: number, fi: number, val: string) => { const n = [...packages]; n[pi].features[fi] = val; onChange(n); };
  const addFeature = (pi: number) => { const n = [...packages]; n[pi].features = [...n[pi].features, ""]; onChange(n); };
  const removeFeature = (pi: number, fi: number) => { const n = [...packages]; n[pi].features = n[pi].features.filter((_, idx) => idx !== fi); onChange(n); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Fiyat Paketleri</label>
        <button type="button" onClick={add} className="text-xs font-semibold text-[var(--accent-color)] hover:underline">+ Paket Ekle</button>
      </div>
      {packages.map((pkg, pi) => (
        <div key={pi} className="border border-[var(--border-color)] rounded-sm p-3 space-y-2 bg-[var(--bg-color)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--accent-color)]">Paket {pi + 1}</span>
            <button type="button" onClick={() => remove(pi)} className="text-xs text-red-500 hover:underline">Sil</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div><label className="text-xs text-[var(--text-secondary)]">Paket Adı</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)]" value={pkg.name} onChange={e => update(pi, "name", e.target.value)} /></div>
            <div><label className="text-xs text-[var(--text-secondary)]">Fiyat</label><input type="number" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)]" value={pkg.price ?? ""} onChange={e => update(pi, "price", e.target.value ? Number(e.target.value) : null)} /></div>
            <div><label className="text-xs text-[var(--text-secondary)]">Para Birimi</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)]" value={pkg.currency} onChange={e => update(pi, "currency", e.target.value)} /></div>
          </div>
          <div><label className="text-xs text-[var(--text-secondary)]">Açıklama</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)]" value={pkg.description} onChange={e => update(pi, "description", e.target.value)} /></div>
          <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]"><input type="checkbox" checked={pkg.is_featured} onChange={e => update(pi, "is_featured", e.target.checked)} className="w-4 h-4 accent-[var(--accent-color)]" /> Öne Çıkan Paket</label>
          {/* Features */}
          <div className="space-y-1">
            <div className="flex items-center justify-between"><span className="text-xs text-[var(--text-secondary)]">Özellikler</span><button type="button" onClick={() => addFeature(pi)} className="text-xs text-[var(--accent-color)] hover:underline">+ Özellik</button></div>
            {pkg.features.map((f, fi) => (
              <div key={fi} className="flex items-center gap-1">
                <input type="text" className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-0.5 text-xs text-[var(--text-primary)]" value={f} onChange={e => updateFeature(pi, fi, e.target.value)} />
                <button type="button" onClick={() => removeFeature(pi, fi)} className="p-0.5 text-red-500"><X size={10} /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Ana Sayfa ─── */
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CourseFormData>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [cRes, catRes, insRes] = await Promise.all([
      fetch("/api/admin/courses"), fetch("/api/admin/categories"), fetch("/api/admin/instructors"),
    ]);
    if (cRes.ok) setCourses(await cRes.json());
    if (catRes.ok) setCategories(await catRes.json());
    if (insRes.ok) setInstructors(await insRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ─── Modal Açma ─── */
  const openAdd = () => { setForm({ ...emptyForm }); setModalOpen(true); };

  const openEdit = async (course: CourseRow) => {
    // Fetch full course details including sub-collections
    const res = await fetch(`/api/admin/courses?id=${course.id}`);
    if (res.ok) {
      const full = await res.json();
      const ci = course.course_instructors?.find(c => c.is_primary) ?? course.course_instructors?.[0];
      setForm({
        id: course.id, code: course.code, title: course.title, short_title: course.short_title,
        slug: course.slug, image: course.image, level: course.level, duration: course.duration,
        week_count: course.week_count, description: course.description, is_new: course.is_new,
        is_active: course.is_active, sort_order: course.sort_order,
        category_id: course.category_id ?? "",
        instructor_id: ci?.instructors?.id ?? "",
        highlights: full.highlights ?? [], topics: full.topics ?? [],
        prerequisites: full.prerequisites ?? [], packages: full.packages ?? [],
      });
    } else {
      const ci = course.course_instructors?.find(c => c.is_primary) ?? course.course_instructors?.[0];
      setForm({
        id: course.id, code: course.code, title: course.title, short_title: course.short_title,
        slug: course.slug, image: course.image, level: course.level, duration: course.duration,
        week_count: course.week_count, description: course.description, is_new: course.is_new,
        is_active: course.is_active, sort_order: course.sort_order,
        category_id: course.category_id ?? "",
        instructor_id: ci?.instructors?.id ?? "",
        highlights: [], topics: [], prerequisites: [], packages: [],
      });
    }
    setModalOpen(true);
  };

  /* ─── Image Upload ─── */
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", "courses");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) { const data = await res.json(); setForm(prev => ({ ...prev, image: data.url })); }
      else { setToast({ message: "Yükleme başarısız.", type: "error" }); }
    } catch { setToast({ message: "Yükleme hatası.", type: "error" }); }
    setUploading(false);
  };

  /* ─── Kaydet ─── */
  const save = async () => {
    if (!form.code || !form.title || !form.slug) { setToast({ message: "Kod, başlık ve slug zorunludur.", type: "error" }); return; }
    setSaving(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/courses", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setToast({ message: form.id ? "Kurs güncellendi!" : "Kurs oluşturuldu!", type: "success" }); setModalOpen(false); fetchData(); }
      else { const err = await res.json(); setToast({ message: err.error || "Hata.", type: "error" }); }
    } catch { setToast({ message: "Bağlantı hatası.", type: "error" }); }
    setSaving(false);
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Bu kursu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
    if (res.ok) { setToast({ message: "Kurs silindi.", type: "success" }); fetchData(); }
  };

  const filtered = courses.filter(c => { if (!search) return true; const s = search.toLowerCase(); return c.title.toLowerCase().includes(s) || c.code.toLowerCase().includes(s); });

  const F = (key: keyof CourseFormData, val: unknown) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Tüm Kurslar</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input type="text" placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] w-48" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity"><Plus size={14} /> Yeni Kurs</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[var(--border-color)] rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Resim</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Kod</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Başlık</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Kategori</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Eğitmen</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Seviye</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Durum</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-3 py-12 text-center"><Loader2 size={20} className="animate-spin mx-auto text-[var(--accent-color)]" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-12 text-center text-[var(--text-secondary)]">Kurs bulunamadı.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                <td className="px-3 py-2">{c.image ? <div className="w-10 h-7 rounded-sm overflow-hidden relative"><Image src={c.image} alt={c.title} fill className="object-cover" sizes="40px" /></div> : <div className="w-10 h-7 rounded-sm bg-[var(--bg-tertiary)] flex items-center justify-center"><ImageIcon size={14} className="text-[var(--text-secondary)]" /></div>}</td>
                <td className="px-3 py-2 font-mono text-xs">{c.code}</td>
                <td className="px-3 py-2 font-medium text-[var(--text-primary)]">{c.short_title || c.title}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{(c.categories as { name: string } | null)?.name ?? "—"}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{c.course_instructors?.[0]?.instructors?.name ?? "—"}</td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm ${c.level === "Temel" ? "bg-green-500/10 text-green-500" : c.level === "Orta" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}>{c.level}</span></td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm ${c.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>{c.is_active ? "Aktif" : "Pasif"}</span></td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-sm text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-colors" title="Düzenle"><Pencil size={14} /></button>
                    <button onClick={() => deleteCourse(c.id)} className="p-1.5 rounded-sm text-red-500 hover:bg-red-500/10 transition-colors" title="Sil"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">Toplam {filtered.length} kurs</p>

      {/* ─── MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4 sm:p-8">
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm w-full max-w-3xl shadow-2xl my-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{form.id ? "Kurs Düzenle" : "Yeni Kurs Ekle"}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X size={18} /></button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Temel Bilgiler */}
              <section className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Temel Bilgiler</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Kurs Kodu *</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.code} onChange={e => F("code", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Slug *</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.slug} onChange={e => F("slug", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Sıralama</label><input type="number" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.sort_order} onChange={e => F("sort_order", Number(e.target.value))} /></div>
                </div>
                <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Başlık *</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.title} onChange={e => F("title", e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Kısa Başlık</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.short_title} onChange={e => F("short_title", e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Açıklama</label><textarea className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] min-h-[80px]" value={form.description} onChange={e => F("description", e.target.value)} /></div>
              </section>

              {/* Kurs Resmi */}
              <section className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Kurs Görseli</p>
                <div className="flex items-start gap-4">
                  {form.image ? (
                    <div className="w-32 h-20 rounded-sm overflow-hidden relative border border-[var(--border-color)]">
                      <Image src={form.image} alt="Kurs" fill className="object-cover" sizes="128px" />
                    </div>
                  ) : (
                    <div className="w-32 h-20 rounded-sm bg-[var(--bg-tertiary)] flex items-center justify-center border border-dashed border-[var(--border-color)]">
                      <ImageIcon size={24} className="text-[var(--text-secondary)]" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-[var(--border-color)] rounded-sm cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors w-fit">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Resim Yükle
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                    </label>
                    <input type="text" placeholder="veya URL girin" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-xs text-[var(--text-primary)]" value={form.image ?? ""} onChange={e => F("image", e.target.value || null)} />
                  </div>
                </div>
              </section>

              {/* Kategori, Eğitmen, Seviye */}
              <section className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Kategori ve Eğitmen</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Kategori</label>
                    <select className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.category_id} onChange={e => F("category_id", e.target.value)}>
                      <option value="">Seçiniz</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Ana Eğitmen</label>
                    <select className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.instructor_id} onChange={e => F("instructor_id", e.target.value)}>
                      <option value="">Seçiniz</option>
                      {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Seviye</label>
                    <select className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.level} onChange={e => F("level", e.target.value)}>
                      <option value="Temel">Temel</option><option value="Orta">Orta</option><option value="İleri">İleri</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Süre</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.duration} onChange={e => F("duration", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Hafta</label><input type="number" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.week_count} onChange={e => F("week_count", Number(e.target.value))} /></div>
                  <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] pt-5"><input type="checkbox" checked={form.is_active} onChange={e => F("is_active", e.target.checked)} className="w-4 h-4 accent-[var(--accent-color)]" /> Aktif</label>
                  <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] pt-5"><input type="checkbox" checked={form.is_new} onChange={e => F("is_new", e.target.checked)} className="w-4 h-4 accent-[var(--accent-color)]" /> Yeni</label>
                </div>
              </section>

              {/* Highlights */}
              <StringListEditor label="Bu Eğitimde Neler Öğreneceksiniz?" items={form.highlights} onChange={v => F("highlights", v)} />

              {/* Topics */}
              <StringListEditor label="Müfredat / Konular" items={form.topics} onChange={v => F("topics", v)} />

              {/* Prerequisites */}
              <StringListEditor label="Ön Koşullar" items={form.prerequisites} onChange={v => F("prerequisites", v)} />

              {/* Packages */}
              <PackageEditor packages={form.packages} onChange={v => F("packages", v)} />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border-color)]">
              <button onClick={() => setModalOpen(false)} className="px-4 py-1.5 text-sm font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-tertiary)] transition-colors">İptal</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {form.id ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
