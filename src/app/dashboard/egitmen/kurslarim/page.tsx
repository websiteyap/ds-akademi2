"use client";

import DashboardTable, { Column } from "@/components/dashboard/DashboardTable";

interface CourseRow {
  id: string;
  code: string;
  title: string;
  short_title: string;
  slug: string;
  level: string;
  duration: string;
  week_count: number;
  is_new: boolean;
  is_active: boolean;
  sort_order: number;
  description: string;
  categories?: { id: string; slug: string; name: string } | null;
}

const columns: Column<CourseRow>[] = [
  { key: "code", header: "Kod", width: "80px" },
  { key: "title", header: "Başlık" },
  {
    key: "categories",
    header: "Kategori",
    render: (item) => (item.categories as { name: string } | null)?.name ?? "—",
    editable: false,
  },
  {
    key: "level",
    header: "Seviye",
    editType: "select",
    editOptions: [
      { value: "Temel", label: "Temel" },
      { value: "Orta", label: "Orta" },
      { value: "İleri", label: "İleri" },
    ],
    width: "90px",
  },
  { key: "duration", header: "Süre", width: "90px" },
  {
    key: "is_active",
    header: "Aktif",
    editType: "checkbox",
    render: (item) => (
      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm ${item.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
        {item.is_active ? "Aktif" : "Pasif"}
      </span>
    ),
    width: "70px",
  },
  { key: "sort_order", header: "Sıra", editType: "number", width: "60px" },
];

export default function InstructorCoursesPage() {
  return (
    <DashboardTable<CourseRow>
      title="Kurslarım"
      columns={columns}
      apiUrl="/api/admin/courses"
    />
  );
}
