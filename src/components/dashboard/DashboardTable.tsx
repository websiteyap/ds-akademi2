"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";

/* ─── Tablo kolonlarının tanımı ─────────────────────────────── */
export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  editable?: boolean;
  editType?: "text" | "textarea" | "select" | "checkbox" | "number" | "file";
  editOptions?: { value: string; label: string }[];
  width?: string;
}

/* ─── Props ─────────────────────────────────────────────────── */
interface Props<T extends { id: string }> {
  title: string;
  columns: Column<T>[];
  apiUrl: string;
  addFields?: Column<T>[];
  addTitle?: string;
  idField?: string;
  onFileUpload?: (file: File) => Promise<string | null>;
  renderExpandedEdit?: (
    item: T,
    onChange: (key: string, value: unknown) => void,
    editData: Record<string, unknown>
  ) => React.ReactNode;
}

/* ─── Toast ─────────────────────────────────────────────────── */
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-lg transition-all ${
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
      {message}
    </div>
  );
}

/* ─── Ana Bileşen ───────────────────────────────────────────── */
export default function DashboardTable<T extends { id: string }>({
  title,
  columns,
  apiUrl,
  addFields,
  addTitle,
  onFileUpload,
  renderExpandedEdit,
}: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addData, setAddData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      setToast({ message: "Veriler yüklenemedi.", type: "error" });
    }
    setLoading(false);
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ─── Arama ─── */
  const filtered = data.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return columns.some((col) => {
      const val = (item as Record<string, unknown>)[col.key];
      return val !== undefined && val !== null && String(val).toLowerCase().includes(s);
    });
  });

  /* ─── Sıralama ─── */
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal), "tr");
    return sortDir === "asc" ? cmp : -cmp;
  });

  /* ─── Inline Edit Handlers ─── */
  const startEdit = (item: T) => {
    setEditingId(item.id);
    setEditData({ ...item } as Record<string, unknown>);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setToast({ message: "Güncellendi!", type: "success" });
        setEditingId(null);
        setEditData({});
        fetchData();
      } else {
        const err = await res.json();
        setToast({ message: err.error || "Hata oluştu.", type: "error" });
      }
    } catch {
      setToast({ message: "Bağlantı hatası.", type: "error" });
    }
    setSaving(false);
  };

  /* ─── Add Handlers ─── */
  const saveAdd = async () => {
    setSaving(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addData),
      });
      if (res.ok) {
        setToast({ message: "Oluşturuldu!", type: "success" });
        setShowAdd(false);
        setAddData({});
        fetchData();
      } else {
        const err = await res.json();
        setToast({ message: err.error || "Hata oluştu.", type: "error" });
      }
    } catch {
      setToast({ message: "Bağlantı hatası.", type: "error" });
    }
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Bu öğeyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`${apiUrl}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setToast({ message: "Silindi!", type: "success" });
        fetchData();
      } else {
        const err = await res.json();
        setToast({ message: err.error || "Silinemedi.", type: "error" });
      }
    } catch {
      setToast({ message: "Bağlantı hatası.", type: "error" });
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  /* ─── Edit Cell Render ─── */
  const renderEditCell = (
    col: Column<T>,
    currentData: Record<string, unknown>,
    onChange: (key: string, val: unknown) => void
  ) => {
    const val = currentData[col.key];
    switch (col.editType) {
      case "textarea":
        return (
          <textarea
            className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)] min-h-[60px]"
            value={(val as string) ?? ""}
            onChange={(e) => onChange(col.key, e.target.value)}
          />
        );
      case "select":
        return (
          <select
            className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)]"
            value={(val as string) ?? ""}
            onChange={(e) => onChange(col.key, e.target.value)}
          >
            <option value="">Seçiniz</option>
            {col.editOptions?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={!!val}
            onChange={(e) => onChange(col.key, e.target.checked)}
            className="w-4 h-4 accent-[var(--accent-color)]"
          />
        );
      case "number":
        return (
          <input
            type="number"
            className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)]"
            value={(val as number) ?? 0}
            onChange={(e) => onChange(col.key, Number(e.target.value))}
          />
        );
      case "file":
        return (
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="text-xs text-[var(--text-secondary)]"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && onFileUpload) {
                  const url = await onFileUpload(file);
                  if (url) onChange(col.key, url);
                }
              }}
            />
            {Boolean(val) && (
              <span className="text-xs text-[var(--text-secondary)] truncate max-w-[120px]">
                {String(val)}
              </span>
            )}
          </div>
        );
      default:
        return (
          <input
            type="text"
            className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-sm text-[var(--text-primary)]"
            value={(val as string) ?? ""}
            onChange={(e) => onChange(col.key, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              placeholder="Ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] w-48"
            />
          </div>
          {addFields && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              {addTitle || "Yeni Ekle"}
            </button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showAdd && addFields && (
        <div className="border border-[var(--accent-color)]/30 bg-[var(--bg-secondary)] rounded-sm p-4 space-y-3">
          <p className="text-sm font-bold text-[var(--accent-color)]">
            {addTitle || "Yeni Kayıt"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {addFields.map((col) => (
              <div key={col.key}>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                  {col.header}
                </label>
                {renderEditCell(
                  col,
                  addData,
                  (k, v) => setAddData((prev) => ({ ...prev, [k]: v }))
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={saveAdd}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Kaydet
            </button>
            <button
              onClick={() => {
                setShowAdd(false);
                setAddData({});
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <X size={14} /> İptal
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-[var(--border-color)] rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors"
                  style={col.width ? { width: col.width } : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {sortKey === col.key &&
                      (sortDir === "asc" ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      ))}
                  </span>
                </th>
              ))}
              <th className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 py-12 text-center"
                >
                  <Loader2
                    size={20}
                    className="animate-spin mx-auto text-[var(--accent-color)]"
                  />
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 py-12 text-center text-[var(--text-secondary)]"
                >
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              sorted.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors"
                >
                  {editingId === item.id ? (
                    /* ─── Inline Edit Row ─── */
                    <>
                      {renderExpandedEdit ? (
                        <td colSpan={columns.length + 1} className="p-0">
                          <div className="p-4 bg-[var(--bg-secondary)] border-l-2 border-[var(--accent-color)] space-y-3">
                            {renderExpandedEdit(
                              item,
                              (k, v) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  [k]: v,
                                })),
                              editData
                            )}
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {saving ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Save size={14} />
                                )}
                                Kaydet
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-tertiary)] transition-colors"
                              >
                                <X size={14} /> İptal
                              </button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        <>
                          {columns.map((col) => (
                            <td key={col.key} className="px-3 py-2">
                              {col.editable !== false
                                ? renderEditCell(
                                    col,
                                    editData,
                                    (k, v) =>
                                      setEditData((prev) => ({
                                        ...prev,
                                        [k]: v,
                                      }))
                                  )
                                : col.render
                                ? col.render(item)
                                : String(
                                    (item as Record<string, unknown>)[
                                      col.key
                                    ] ?? ""
                                  )}
                            </td>
                          ))}
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="p-1.5 rounded-sm text-green-500 hover:bg-green-500/10 transition-colors"
                                title="Kaydet"
                              >
                                {saving ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Save size={14} />
                                )}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 rounded-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                                title="İptal"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </>
                  ) : (
                    /* ─── Normal Row ─── */
                    <>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-3 py-2.5 text-[var(--text-primary)]"
                        >
                          {col.render
                            ? col.render(item)
                            : String(
                                (item as Record<string, unknown>)[col.key] ?? ""
                              )}
                        </td>
                      ))}
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 rounded-sm text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-colors"
                            title="Düzenle"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 rounded-sm text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Count */}
      <p className="text-xs text-[var(--text-secondary)]">
        Toplam {filtered.length} kayıt
      </p>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
