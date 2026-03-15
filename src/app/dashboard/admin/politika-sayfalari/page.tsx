"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Check, AlertTriangle, Save, FileStack, ChevronDown, ChevronUp } from "lucide-react";

interface PolicyRow { id: string; slug: string; title: string; content: string; updated_at: string; }

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-lg ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}{message}
    </div>
  );
}

export default function AdminPolicyPagesPage() {
  const [pages, setPages] = useState<PolicyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, { title: string; content: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => { setLoading(true); const res = await fetch("/api/admin/policy-pages"); if (res.ok) setPages(await res.json()); setLoading(false); }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleExpand = (page: PolicyRow) => {
    if (expandedId === page.id) { setExpandedId(null); return; }
    setExpandedId(page.id);
    setEditData(prev => ({ ...prev, [page.id]: { title: page.title, content: page.content } }));
  };

  const savePage = async (id: string) => {
    const data = editData[id]; if (!data) return;
    setSaving(id);
    try {
      const res = await fetch("/api/admin/policy-pages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) });
      if (res.ok) { setToast({ message: "Sayfa güncellendi!", type: "success" }); setExpandedId(null); fetchData(); }
      else { const err = await res.json(); setToast({ message: err.error || "Hata.", type: "error" }); }
    } catch { setToast({ message: "Bağlantı hatası.", type: "error" }); }
    setSaving(null);
  };

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2"><FileStack size={20} /> Politika Sayfaları</h2>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-[var(--accent-color)]" /></div>
      ) : (
        <div className="space-y-2">
          {pages.map(page => {
            const isExpanded = expandedId === page.id;
            const data = editData[page.id];
            return (
              <div key={page.id} className="border border-[var(--border-color)] rounded-sm overflow-hidden">
                <button onClick={() => toggleExpand(page)} className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left">
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{page.title}</p>
                    <p className="text-xs text-[var(--text-secondary)]">/{page.slug} · Son güncelleme: {new Date(page.updated_at).toLocaleDateString("tr-TR")}</p>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-[var(--text-secondary)]" /> : <ChevronDown size={16} className="text-[var(--text-secondary)]" />}
                </button>
                {isExpanded && data && (
                  <div className="p-4 space-y-3 border-t border-[var(--border-color)] border-l-2 border-l-[var(--accent-color)]">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Sayfa Başlığı</label>
                      <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-3 py-1.5 text-sm text-[var(--text-primary)]" value={data.title} onChange={e => setEditData(prev => ({ ...prev, [page.id]: { ...data, title: e.target.value } }))} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">İçerik (HTML)</label>
                      <textarea className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-sm text-[var(--text-primary)] font-mono min-h-[300px]" value={data.content} onChange={e => setEditData(prev => ({ ...prev, [page.id]: { ...data, content: e.target.value } }))} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => savePage(page.id)} disabled={saving === page.id} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors disabled:opacity-50">
                        {saving === page.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Kaydet
                      </button>
                      <button onClick={() => setExpandedId(null)} className="px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-tertiary)] transition-colors">İptal</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
