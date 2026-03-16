"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import {
  Save,
  Loader2,
  Check,
  AlertTriangle,
  BookOpen,
  Settings,
  LayoutList,
  ArrowLeft,
  Eye,
} from "lucide-react";
import Link from "next/link";
import {
  CourseBuilderSchema,
  type CourseBuilderData,
  type Section,
} from "@/lib/course-builder-schema";
import GeneralInfoTab from "./GeneralInfoTab";
import CurriculumTab from "./CurriculumTab";
import SettingsTab from "./SettingsTab";

// ─── Tipler ──────────────────────────────────────────────────
interface CategoryOption { id: string; name: string; }
interface InstructorOption { id: string; name: string; }

interface CourseBuilderPageProps {
  courseId?: string;   // Düzenleme modunda mevcut kurs ID'si
  userRole?: string;
}

// ─── Toast ───────────────────────────────────────────────────
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
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[80] flex items-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold shadow-xl transition-all ${
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

// ─── Tab Tanımları ────────────────────────────────────────────
const TABS = [
  { id: "general", label: "Genel Bilgiler", icon: BookOpen },
  { id: "curriculum", label: "Müfredat", icon: LayoutList },
  { id: "settings", label: "Ayarlar", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Varsayılan Form Değerleri ────────────────────────────────
const defaultValues: CourseBuilderData = {
  general: {
    code: "",
    title: "",
    short_title: "",
    slug: "",
    description: "",
    image: null,
    category_id: "",
    instructor_id: "",
    level: "Temel",
    duration: "4 Hafta",
    week_count: 4,
    is_new: false,
    is_active: true,
    sort_order: 0,
    highlights: [],
    prerequisites: [],
  },
  curriculum: [],
  settings: {
    status: "draft",
    packages: [],
  },
};

// ─── Ana Bileşen ──────────────────────────────────────────────
export default function CourseBuilderPage({ courseId, userRole }: CourseBuilderPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!courseId);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [savedCourseId, setSavedCourseId] = useState<string | undefined>(courseId);

  const methods = useForm<CourseBuilderData>({
    resolver: zodResolver(CourseBuilderSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, reset, formState: { errors, isDirty } } = methods;

  // ─── Kategori ve Eğitmenleri Yükle ───────────────────────
  useEffect(() => {
    const fetchMeta = async () => {
      const [catRes, insRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/instructors"),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (insRes.ok) setInstructors(await insRes.json());
    };
    fetchMeta();
  }, []);

  // ─── Mevcut Kursu Yükle (Düzenleme Modu) ─────────────────
  const loadCourse = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Kurs genel bilgileri
      const courseRes = await fetch(`/api/admin/courses?id=${id}`);
      if (courseRes.ok) {
        const courseData = await courseRes.json();
        // Kurs listesinden tam veriyi al
        const listRes = await fetch("/api/admin/courses");
        if (listRes.ok) {
          const list = await listRes.json();
          const course = list.find((c: { id: string }) => c.id === id);
          if (course) {
            const ci = course.course_instructors?.find((c: { is_primary: boolean }) => c.is_primary) ?? course.course_instructors?.[0];
            reset({
              id,
              general: {
                code: course.code ?? "",
                title: course.title ?? "",
                short_title: course.short_title ?? "",
                slug: course.slug ?? "",
                description: course.description ?? "",
                image: course.image ?? null,
                category_id: course.category_id ?? "",
                instructor_id: ci?.instructors?.id ?? "",
                level: course.level ?? "Temel",
                duration: course.duration ?? "4 Hafta",
                week_count: course.week_count ?? 4,
                is_new: course.is_new ?? false,
                is_active: course.is_active ?? true,
                sort_order: course.sort_order ?? 0,
                highlights: courseData.highlights ?? [],
                prerequisites: courseData.prerequisites ?? [],
              },
              curriculum: [],
              settings: {
                status: course.status ?? "draft",
                packages: courseData.packages ?? [],
              },
            });
          }
        }
      }

      // Müfredatı yükle
      const currRes = await fetch(`/api/admin/course-builder?courseId=${id}`);
      if (currRes.ok) {
        const currData = await currRes.json();
        setSections(currData.sections ?? []);
      }
    } catch {
      setToast({ message: "Kurs yüklenirken hata oluştu.", type: "error" });
    }
    setLoading(false);
  }, [reset]);

  useEffect(() => {
    if (courseId) loadCourse(courseId);
  }, [courseId, loadCourse]);

  // ─── Kaydet ──────────────────────────────────────────────
  const onSubmit = async (data: CourseBuilderData) => {
    setSaving(true);
    try {
      // 1. Kurs genel bilgilerini kaydet
      const coursePayload = {
        id: savedCourseId,
        ...data.general,
        highlights: data.general.highlights,
        topics: [],
        prerequisites: data.general.prerequisites,
        packages: data.settings.packages,
        status: data.settings.status,
      };

      const method = savedCourseId ? "PUT" : "POST";
      const courseRes = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coursePayload),
      });

      if (!courseRes.ok) {
        const err = await courseRes.json();
        throw new Error(err.error || "Kurs kaydedilemedi.");
      }

      let currentCourseId = savedCourseId;
      if (!savedCourseId) {
        const courseResult = await courseRes.json();
        currentCourseId = courseResult.id;
        setSavedCourseId(currentCourseId);
      }

      // 2. Müfredatı kaydet
      if (currentCourseId) {
        const currRes = await fetch("/api/admin/course-builder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: currentCourseId, sections }),
        });

        if (!currRes.ok) {
          const err = await currRes.json();
          throw new Error(err.error || "Müfredat kaydedilemedi.");
        }
      }

      setToast({
        message: savedCourseId ? "Kurs başarıyla güncellendi!" : "Kurs başarıyla oluşturuldu!",
        type: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bilinmeyen hata";
      setToast({ message, type: "error" });
    }
    setSaving(false);
  };

  // ─── Taslak Kaydet ───────────────────────────────────────
  const saveDraft = () => {
    methods.setValue("settings.status", "draft");
    handleSubmit(onSubmit)();
  };

  // ─── Yayınla ─────────────────────────────────────────────
  const publish = () => {
    methods.setValue("settings.status", "published");
    handleSubmit(onSubmit)();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[var(--accent-color)]" />
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
        {/* ─── Üst Bar ─── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-3">
            <Link
              href={userRole === "admin" ? "/dashboard/admin/kurslar" : "/dashboard/egitmen/kurslarim"}
              className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft size={16} />
              Geri
            </Link>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                {savedCourseId ? "Kurs Düzenle" : "Yeni Kurs Oluştur"}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {savedCourseId ? `ID: ${savedCourseId.slice(0, 8)}...` : "Kurs bilgilerini doldurun"}
              </p>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-2">
            {savedCourseId && (
              <Link
                href={`/kurslar/${methods.watch("general.slug")}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
              >
                <Eye size={14} />
                Önizle
              </Link>
            )}
            <button
              type="button"
              onClick={saveDraft}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Taslak Kaydet
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Yayınla
            </button>
          </div>
        </div>

        {/* ─── Validasyon Uyarısı ─── */}
        {hasErrors && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-sm px-4 py-2.5 text-sm text-red-400 mb-4">
            <AlertTriangle size={16} />
            <span>Lütfen zorunlu alanları doldurun. &quot;Genel Bilgiler&quot; sekmesini kontrol edin.</span>
          </div>
        )}

        {/* ─── Tab Navigasyonu ─── */}
        <div className="flex border-b border-[var(--border-color)] mb-5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            const hasTabError =
              id === "general" && Object.keys(errors.general ?? {}).length > 0;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
                  isActive
                    ? "border-[var(--accent-color)] text-[var(--accent-color)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]"
                }`}
              >
                <Icon size={15} />
                {label}
                {hasTabError && (
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── Tab İçerikleri ─── */}
        <div className="min-h-[400px]">
          {activeTab === "general" && (
            <GeneralInfoTab categories={categories} instructors={instructors} />
          )}
          {activeTab === "curriculum" && (
            <CurriculumTab sections={sections} onChange={setSections} />
          )}
          {activeTab === "settings" && <SettingsTab />}
        </div>

        {/* ─── Alt Kaydet Butonu ─── */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--border-color)]">
          <div className="text-xs text-[var(--text-secondary)]">
            {isDirty ? (
              <span className="text-yellow-500">● Kaydedilmemiş değişiklikler var</span>
            ) : (
              <span className="text-green-500">✓ Tüm değişiklikler kaydedildi</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveDraft}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Taslak Kaydet
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Yayınla
            </button>
          </div>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </FormProvider>
  );
}
