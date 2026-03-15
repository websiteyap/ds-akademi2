"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Shield,
  ShieldOff,
  Loader2,
  Check,
  AlertTriangle,
  Users,
} from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  is_blocked: boolean;
  can_write_blog: boolean;
  created_at: string;
}

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
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-lg ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
      {message}
    </div>
  );
}

const roleBadge: Record<string, { label: string; cls: string }> = {
  admin: { label: "Admin", cls: "bg-purple-500/10 text-purple-500" },
  instructor: { label: "Eğitmen", cls: "bg-blue-500/10 text-blue-500" },
  student: { label: "Öğrenci", cls: "bg-gray-500/10 text-gray-400" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleBlock = async (user: UserRow) => {
    setSaving(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, is_blocked: !user.is_blocked }),
      });
      if (res.ok) {
        setToast({
          message: user.is_blocked ? "Engel kaldırıldı." : "Kullanıcı engellendi.",
          type: "success",
        });
        fetchData();
      } else {
        const err = await res.json();
        setToast({ message: err.error || "Hata.", type: "error" });
      }
    } catch {
      setToast({ message: "Bağlantı hatası.", type: "error" });
    }
    setSaving(null);
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.role?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Users size={20} /> Tüm Kullanıcılar
        </h2>
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
      </div>

      <div className="overflow-x-auto border border-[var(--border-color)] rounded-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Ad Soyad
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                E-posta
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Rol
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Kayıt
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Durum
              </th>
              <th className="text-right px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center">
                  <Loader2
                    size={20}
                    className="animate-spin mx-auto text-[var(--accent-color)]"
                  />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-12 text-center text-[var(--text-secondary)]"
                >
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const badge = roleBadge[u.role] ?? roleBadge.student;
                return (
                  <tr
                    key={u.id}
                    className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-[var(--text-primary)] font-medium">
                      {u.name || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)]">
                      {u.email}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[var(--text-secondary)] text-xs">
                      {new Date(u.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm ${
                          u.is_blocked
                            ? "bg-red-500/10 text-red-500"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {u.is_blocked ? "Engelli" : "Aktif"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => toggleBlock(u)}
                        disabled={saving === u.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors ${
                          u.is_blocked
                            ? "text-green-500 border border-green-500/30 hover:bg-green-500/10"
                            : "text-red-500 border border-red-500/30 hover:bg-red-500/10"
                        } disabled:opacity-50`}
                        title={u.is_blocked ? "Engeli Kaldır" : "Engelle"}
                      >
                        {saving === u.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : u.is_blocked ? (
                          <ShieldOff size={12} />
                        ) : (
                          <Shield size={12} />
                        )}
                        {u.is_blocked ? "Kaldır" : "Engelle"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--text-secondary)]">
        Toplam {filtered.length} kullanıcı
      </p>

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
