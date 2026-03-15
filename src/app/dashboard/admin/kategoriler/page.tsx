"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Save, X, Search, Loader2, Check, AlertTriangle } from "lucide-react";

interface CategoryRow {
  id: string; slug: string; name: string; description: string;
  icon: string; color: string; bg_gradient: string | null;
  sort_order: number; courseCount?: number;
}

interface FormData {
  id?: string; name: string; slug: string; description: string;
  icon: string; color: string; bg_gradient: string; sort_order: number;
}

const emptyForm: FormData = { name: "", slug: "", description: "", icon: "BookOpen", color: "#3b82f6", bg_gradient: "", sort_order: 0 };

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-lg ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}{message}
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (cat: CategoryRow) => {
    setForm({ id: cat.id, name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon, color: cat.color, bg_gradient: cat.bg_gradient ?? "", sort_order: cat.sort_order });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.slug) { setToast({ message: "Ad ve slug zorunludur.", type: "error" }); return; }
    setSaving(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setToast({ message: form.id ? "Kategori güncellendi!" : "Kategori oluşturuldu!", type: "success" }); setModalOpen(false); fetchData(); }
      else { const err = await res.json(); setToast({ message: err.error || "Hata.", type: "error" }); }
    } catch { setToast({ message: "Bağlantı hatası.", type: "error" }); }
    setSaving(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) { setToast({ message: "Kategori silindi.", type: "success" }); fetchData(); }
  };

  const filtered = categories.filter(c => { if (!search) return true; return c.name.toLowerCase().includes(search.toLowerCase()); });
  const F = (key: keyof FormData, val: unknown) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Tüm Kategoriler</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input type="text" placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] w-48" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity"><Plus size={14} /> Yeni Kategori</button>
        </div>
      </div>

      <div className="overflow-x-auto border border-[var(--border-color)] rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Renk</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Kategori Adı</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Slug</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">İkon</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Kurs</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Sıra</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-3 py-12 text-center"><Loader2 size={20} className="animate-spin mx-auto text-[var(--accent-color)]" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-12 text-center text-[var(--text-secondary)]">Kategori bulunamadı.</td></tr>
            ) : filtered.map(cat => (
              <tr key={cat.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                <td className="px-3 py-2"><span className="inline-block w-5 h-5 rounded-sm border border-[var(--border-color)]" style={{ backgroundColor: cat.color }} /></td>
                <td className="px-3 py-2 font-medium text-[var(--text-primary)]">{cat.name}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)] font-mono text-xs">{cat.slug}</td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{cat.icon}</td>
                <td className="px-3 py-2"><span className="inline-block px-2 py-0.5 text-xs font-bold rounded-sm bg-blue-500/10 text-blue-500">{cat.courseCount ?? 0}</span></td>
                <td className="px-3 py-2 text-[var(--text-secondary)]">{cat.sort_order}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-sm text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-sm text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">Toplam {filtered.length} kategori</p>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4 sm:p-8">
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm w-full max-w-lg shadow-2xl my-4">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{form.id ? "Kategori Düzenle" : "Yeni Kategori Ekle"}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X size={18} /></button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Kategori Adı *</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.name} onChange={e => F("name", e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Slug *</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.slug} onChange={e => F("slug", e.target.value)} /></div>
              </div>
              <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Açıklama</label><textarea className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] min-h-[60px]" value={form.description} onChange={e => F("description", e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">İkon (Lucide)</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.icon} onChange={e => F("icon", e.target.value)} /></div>
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Renk</label>
                  <div className="flex items-center gap-2">
                    <input type="color" className="w-8 h-8 rounded-sm border-0 cursor-pointer" value={form.color} onChange={e => F("color", e.target.value)} />
                    <input type="text" className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.color} onChange={e => F("color", e.target.value)} />
                  </div>
                </div>
                <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Sıralama</label><input type="number" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.sort_order} onChange={e => F("sort_order", Number(e.target.value))} /></div>
              </div>
              <div><label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Gradient</label><input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)]" value={form.bg_gradient} onChange={e => F("bg_gradient", e.target.value)} placeholder="ör: linear-gradient(135deg, #667eea, #764ba2)" /></div>
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
