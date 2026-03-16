"use client";

import { useFormContext } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import type { CourseBuilderData, CoursePackage } from "@/lib/course-builder-schema";

export default function SettingsTab() {
  const { register, watch, setValue } = useFormContext<CourseBuilderData>();

  const status = watch("settings.status");
  const packages = watch("settings.packages") ?? [];

  const addPackage = () => {
    setValue("settings.packages", [
      ...packages,
      {
        name: "",
        price: null,
        currency: "TRY",
        description: "",
        features: [],
        is_featured: false,
        sort_order: packages.length,
      },
    ]);
  };

  const updatePackage = (idx: number, key: keyof CoursePackage, value: unknown) => {
    const updated = packages.map((p, i) =>
      i === idx ? { ...p, [key]: value } : p
    );
    setValue("settings.packages", updated);
  };

  const removePackage = (idx: number) => {
    setValue("settings.packages", packages.filter((_, i) => i !== idx));
  };

  const addFeature = (pkgIdx: number) => {
    const updated = packages.map((p, i) =>
      i === pkgIdx ? { ...p, features: [...(p.features ?? []), ""] } : p
    );
    setValue("settings.packages", updated);
  };

  const updateFeature = (pkgIdx: number, fIdx: number, val: string) => {
    const updated = packages.map((p, i) => {
      if (i !== pkgIdx) return p;
      const feats = [...(p.features ?? [])];
      feats[fIdx] = val;
      return { ...p, features: feats };
    });
    setValue("settings.packages", updated);
  };

  const removeFeature = (pkgIdx: number, fIdx: number) => {
    const updated = packages.map((p, i) => {
      if (i !== pkgIdx) return p;
      return { ...p, features: (p.features ?? []).filter((_, fi) => fi !== fIdx) };
    });
    setValue("settings.packages", updated);
  };

  const inputCls = "w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors";
  const labelCls = "text-xs font-semibold text-[var(--text-secondary)] mb-1 block";

  return (
    <div className="space-y-6">
      {/* ─── Yayın Durumu ─── */}
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Yayın Durumu</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["draft", "published", "archived"] as const).map((s) => {
            const config = {
              draft: {
                label: "Taslak",
                desc: "Kurs henüz yayında değil. Sadece yöneticiler görebilir.",
                color: "border-yellow-500/40 bg-yellow-500/5",
                activeColor: "border-yellow-500 bg-yellow-500/10",
                dot: "bg-yellow-500",
              },
              published: {
                label: "Yayında",
                desc: "Kurs herkese açık ve aktif olarak görünür.",
                color: "border-green-500/40 bg-green-500/5",
                activeColor: "border-green-500 bg-green-500/10",
                dot: "bg-green-500",
              },
              archived: {
                label: "Arşivlendi",
                desc: "Kurs gizlendi. Mevcut öğrenciler erişmeye devam edebilir.",
                color: "border-[var(--border-color)] bg-[var(--bg-secondary)]",
                activeColor: "border-[var(--text-secondary)] bg-[var(--bg-tertiary)]",
                dot: "bg-[var(--text-secondary)]",
              },
            }[s];

            const isActive = status === s;

            return (
              <button
                key={s}
                type="button"
                onClick={() => setValue("settings.status", s)}
                className={`text-left p-4 rounded-sm border-2 transition-all ${
                  isActive ? config.activeColor : config.color
                } hover:opacity-90`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                  <span className="text-sm font-bold text-[var(--text-primary)]">{config.label}</span>
                  {isActive && (
                    <span className="ml-auto text-xs font-bold text-[var(--accent-color)]">✓ Seçili</span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{config.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Hidden input for form registration */}
        <input type="hidden" {...register("settings.status")} />
      </section>

      {/* ─── Fiyat Paketleri ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Fiyat Paketleri</p>
          <button
            type="button"
            onClick={addPackage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={12} />
            Paket Ekle
          </button>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[var(--border-color)] rounded-sm text-[var(--text-secondary)] text-sm">
            Henüz fiyat paketi eklenmedi.
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg, pi) => (
              <div
                key={pi}
                className={`border rounded-sm p-4 space-y-3 ${
                  pkg.is_featured
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5"
                    : "border-[var(--border-color)] bg-[var(--bg-secondary)]"
                }`}
              >
                {/* Paket Başlığı */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--accent-color)]">
                    Paket {pi + 1} {pkg.is_featured && "⭐ Öne Çıkan"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePackage(pi)}
                    className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Sil
                  </button>
                </div>

                {/* Paket Alanları */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Paket Adı *</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={pkg.name}
                      onChange={(e) => updatePackage(pi, "name", e.target.value)}
                      placeholder="Bireysel, Kurumsal..."
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Fiyat</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={pkg.price ?? ""}
                      onChange={(e) =>
                        updatePackage(pi, "price", e.target.value ? Number(e.target.value) : null)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Para Birimi</label>
                    <select
                      className={inputCls}
                      value={pkg.currency}
                      onChange={(e) => updatePackage(pi, "currency", e.target.value)}
                    >
                      <option value="TRY">TRY (₺)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Açıklama</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={pkg.description ?? ""}
                    onChange={(e) => updatePackage(pi, "description", e.target.value)}
                    placeholder="Paket açıklaması..."
                  />
                </div>

                {/* Özellikler */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>Özellikler</label>
                    <button
                      type="button"
                      onClick={() => addFeature(pi)}
                      className="text-xs text-[var(--accent-color)] hover:underline"
                    >
                      + Özellik Ekle
                    </button>
                  </div>
                  {(pkg.features ?? []).map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                        value={feat}
                        onChange={(e) => updateFeature(pi, fi, e.target.value)}
                        placeholder={`Özellik ${fi + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(pi, fi)}
                        className="p-1 text-red-500 hover:text-red-400 shrink-0"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Öne Çıkan */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pkg.is_featured}
                    onChange={(e) => updatePackage(pi, "is_featured", e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent-color)]"
                  />
                  <span className="text-sm text-[var(--text-primary)]">Öne Çıkan Paket</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
