"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Check, AlertTriangle, Save, Wrench } from "lucide-react";

interface Settings {
  id: string;
  site_name: string;
  site_logo: string | null;
  tagline: string | null;
  footer_about: string | null;
  phone: string | null;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  working_hours: string | null;
  maps_embed_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-lg ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}{message}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{label}</label>
      {type === "textarea" ? (
        <textarea className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-3 py-1.5 text-sm text-[var(--text-primary)] min-h-[80px]" value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input type={type} className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-3 py-1.5 text-sm text-[var(--text-primary)]" value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/site-settings");
    if (res.ok) { const data = await res.json(); setSettings(data); setForm(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v ?? "")]))); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setToast({ message: "Ayarlar kaydedildi!", type: "success" }); fetchData(); }
      else { const err = await res.json(); setToast({ message: err.error || "Hata.", type: "error" }); }
    } catch { setToast({ message: "Bağlantı hatası.", type: "error" }); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-[var(--accent-color)]" /></div>;
  if (!settings) return <p className="text-[var(--text-secondary)]">Ayarlar yüklenemedi.</p>;

  return (
    <div className="space-y-6 w-full max-w-3xl">
      <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2"><Wrench size={20} /> Site Ayarları</h2>

      {/* Genel */}
      <section className="border border-[var(--border-color)] rounded-sm p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Genel</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Site Adı" value={form.site_name ?? ""} onChange={v => update("site_name", v)} />
          <Field label="Tagline" value={form.tagline ?? ""} onChange={v => update("tagline", v)} />
          <Field label="Logo URL" value={form.site_logo ?? ""} onChange={v => update("site_logo", v)} />
        </div>
        <Field label="Footer Hakkında Metni" value={form.footer_about ?? ""} onChange={v => update("footer_about", v)} type="textarea" />
      </section>

      {/* İletişim */}
      <section className="border border-[var(--border-color)] rounded-sm p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">İletişim</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Telefon" value={form.phone ?? ""} onChange={v => update("phone", v)} />
          <Field label="E-posta" value={form.email ?? ""} onChange={v => update("email", v)} />
          <Field label="Adres 1" value={form.address_line1 ?? ""} onChange={v => update("address_line1", v)} />
          <Field label="Adres 2" value={form.address_line2 ?? ""} onChange={v => update("address_line2", v)} />
          <Field label="Çalışma Saatleri" value={form.working_hours ?? ""} onChange={v => update("working_hours", v)} />
        </div>
        <Field label="Harita Embed URL" value={form.maps_embed_url ?? ""} onChange={v => update("maps_embed_url", v)} />
      </section>

      {/* Sosyal Medya */}
      <section className="border border-[var(--border-color)] rounded-sm p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Sosyal Medya</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="LinkedIn" value={form.linkedin_url ?? ""} onChange={v => update("linkedin_url", v)} />
          <Field label="Instagram" value={form.instagram_url ?? ""} onChange={v => update("instagram_url", v)} />
          <Field label="Twitter / X" value={form.twitter_url ?? ""} onChange={v => update("twitter_url", v)} />
          <Field label="YouTube" value={form.youtube_url ?? ""} onChange={v => update("youtube_url", v)} />
        </div>
      </section>

      {/* Kaydet */}
      <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Kaydet
      </button>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
