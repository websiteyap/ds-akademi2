"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Save, X, Search, Loader2, Check, AlertTriangle, Upload } from "lucide-react";
import Image from "next/image";

interface InstructorRow {
  id: string; slug: string; name: string; title: string; department: string;
  image: string | null; bio: string; linkedin_url: string | null;
  twitter_url: string | null; website_url: string | null; specialty: string | null;
  sort_order: number; is_active: boolean; courseCount?: number;
}

interface FormData {
  id?: string; name: string; title: string; slug: string; department: string;
  image: string | null; bio: string; specialty: string;
  linkedin_url: string; twitter_url: string; website_url: string;
  sort_order: number; is_active: boolean;
}

const emptyForm: FormData = {
  name: "", title: "", slug: "", department: "", image: null, bio: "",
  specialty: "", linkedin_url: "", twitter_url: "", website_url: "",
  sort_order: 0, is_active: true,
};

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-lg ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}{message}
    </div>
  );
}

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<InstructorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/instructors");
    if (res.ok) setInstructors(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (ins: InstructorRow) => {
    setForm({
      id: ins.id, name: ins.name, title: ins.title, slug: ins.slug,
      department: ins.department, image: ins.image, bio: ins.bio,
      specialty: ins.specialty ?? "", linkedin_url: ins.linkedin_url ?? "",
      twitter_url: ins.twitter_url ?? "", website_url: ins.website_url ?? "",
      sort_order: ins.sort_order, is_active: ins.is_active,
    });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", "instructors");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) { const data = await res.json(); setForm(prev => ({ ...prev, image: data.url })); }
      else { setToast({ message: "Fotoğraf yüklenemedi.", type: "error" }); }
    } catch { setToast({ message: "Yükleme hatası.", type: "error" }); }
    setUploading(false);
  };

  const save = async () => {
    if (!form.name || !form.title) { setToast({ message: "Ad ve unvan zorunludur.", type: "error" }); return; }
    setSaving(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/instructors", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setToast({ message: form.id ? "Eğitmen güncellendi!" : "Eğitmen oluşturuldu!", type: "success" }); setModalOpen(false); fetchData(); }
      else { const err = await res.json(); setToast({ message: err.error || "Hata.", type: "error" }); }
    } catch { setToast({ message: "Bağlantı hatası.", type: "error" }); }
    setSaving(false);
  };

  const deleteInstructor = async (id: string) => {
    if (!confirm("Bu eğitmeni silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/instructors?id=${id}`, { method: "DELETE" });
    if (res.ok) { setToast({ message: "Eğitmen silindi.", type: "success" }); fetchData(); }
  };

  const filtered = instructors.filter(i => { if (!search) return true; const s = search.toLowerCase(); return i.name.toLowerCase().includes(s) || i.title.toLowerCase().includes(s); });
  const F = (key: keyof FormData, val: unknown) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Tüm Eğitmenler</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input type="text" placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] w-48" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity"><Plus size={14} /> Yeni Eğitmen</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[var(--border-color)] rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Foto</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Ad Soyad</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Unvan</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Departman</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Uzmanlık</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Durum</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Kurs</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-3 py-12 text-center"><Loader2 size={20} className="animate-spin mx-auto text-[var(--accent-color)]" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-12 text-center text-[var(--text-secondary)]">Eğitmen bulunamadı.</td></tr>
            ) : filtered.map(ins => (
              <tr key={ins.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                <td className="px-3 py-2">
                  {ins.image ? (
                    <div className="w-8 h-8 rounded-sm overflow-hidden relative"><Image src={ins.image} alt={ins.name} fill className="object-cover" sizes="32px" /></div>
                  ) : (
                    <div className="w-8 h-8 rounded-sm bg-[var(--accent-color)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent-color)]">{ins.name?.charAt(0) ?? "?"}</div>
                  )}
                </td>
                <td className="px-3 py-2 font-medium text-[var(--text-primary)]">{ins.name}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{ins.title}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{ins.department || "—"}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{ins.specialty || "—"}</td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm ${ins.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>{ins.is_active ? "Aktif" : "Pasif"}</span></td>
                <td className="px-3 py-2"><span className="inline-block px-2 py-0.5 text-xs font-bold rounded-sm bg-blue-500/10 text-blue-500">{ins.courseCount ?? 0}</span></td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(ins)} className="p-1.5 rounded-sm text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-colors" title="Düzenle"><Pencil size={14} /></button>
                    <button onClick={() => deleteInstructor(ins.id)} className="p-1.5 rounded-sm text-red-500 hover:bg-red-500/10 transition-colors" title="Sil"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">Toplam {filtered.length} eğitmen</p>

      {/* ─── MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4 sm:p-8">
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm w-full max-w-2xl shadow-2xl my-4">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{form.id ? "Eğitmen Düzenle" : "Yeni Eğitmen Ekle"}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X size={18} /></button>
            </div>
            <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Profil Fotoğrafı */}
              <section className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Profil Fotoğrafı</p>
                <div className="flex items-start gap-4">
                  {form.image ? (
                    <div className="w-20 h-20 rounded-sm overflow-hidden relative border border-[var(--border-color)]"><Image src={form.image} alt="Foto" fill className="object-cover" sizes="80px" /></div>
                  ) : (
                    <div className="w-20 h-20 rounded-sm bg-[var(--bg-tertiary)] flex items-center justify-center border border-dashed border-[var(--border-color)] text-2xl font-bold text-[var(--text-secondary)]">{form.name?.charAt(0) || "?"}</div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-[var(--border-color)] rounded-sm cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors w-fit">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Fotoğraf Yükle
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
                    </label>
                    {form.image && <button type="button" onClick={() => F("image", null)} className="text-xs text-red-500 hover:underline">Fotoğrafı Kaldır</button>}
                  </div>
                </div>
              </section>

              {/* Temel Bilgiler */}
              <section className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Temel Bilgiler</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Ad Soyad *</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.name} onChange={e => F("name", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Unvan *</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.title} onChange={e => F("title", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Slug</label><input type="text" placeholder="Otomatik oluşturulur" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.slug} onChange={e => F("slug", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Departman</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.department} onChange={e => F("department", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Uzmanlık Alanı</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.specialty} onChange={e => F("specialty", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Sıralama</label><input type="number" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.sort_order} onChange={e => F("sort_order", Number(e.target.value))} /></div>
                </div>
                <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Biyografi</label><textarea className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] min-h-[80px]" value={form.bio} onChange={e => F("bio", e.target.value)} /></div>
                <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]"><input type="checkbox" checked={form.is_active} onChange={e => F("is_active", e.target.checked)} className="w-4 h-4 accent-[var(--accent-color)]" /> Aktif</label>
              </section>

              {/* Sosyal Medya */}
              <section className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Sosyal Medya</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">LinkedIn</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.linkedin_url} onChange={e => F("linkedin_url", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Twitter / X</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.twitter_url} onChange={e => F("twitter_url", e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Web Sitesi</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.website_url} onChange={e => F("website_url", e.target.value)} /></div>
                </div>
              </section>
            </div>
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
