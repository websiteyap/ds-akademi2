"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, BookOpen, Clock, ClipboardList } from "lucide-react";
import { type Section, createEmptySection } from "@/lib/course-builder-schema";
import SectionItem from "./SectionItem";

interface CurriculumTabProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export default function CurriculumTab({ sections, onChange }: CurriculumTabProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sectionIds = sections.map((_, i) => `section-${i}`);

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionIds.indexOf(active.id as string);
    const newIndex = sectionIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newSections = arrayMove(sections, oldIndex, newIndex).map(
      (s, i) => ({ ...s, sort_order: i })
    );
    onChange(newSections);
  };

  const addSection = () => {
    const newSection = createEmptySection(sections.length);
    onChange([...sections, newSection]);
  };

  const updateSection = (idx: number, section: Section) => {
    onChange(sections.map((s, i) => (i === idx ? section : s)));
  };

  const removeSection = (idx: number) => {
    if (!confirm("Bu bölümü ve içindeki tüm dersleri silmek istediğinize emin misiniz?")) return;
    onChange(sections.filter((_, i) => i !== idx));
  };

  // İstatistikler
  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const totalDuration = sections.reduce(
    (sum, s) => sum + s.lessons.reduce((ls, l) => ls + (l.duration_min ?? 0), 0),
    0
  );
  const totalQuizzes = sections.reduce(
    (sum, s) => sum + s.lessons.filter((l) => l.content_type === "quiz").length,
    0
  );

  return (
    <div className="space-y-4">
      {/* İstatistik Çubuğu */}
      {sections.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-sm text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <BookOpen size={12} className="text-[var(--accent-color)]" />
            <strong className="text-[var(--text-primary)]">{sections.length}</strong> bölüm
          </span>
          <span className="text-[var(--border-color)]">|</span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={12} className="text-blue-400" />
            <strong className="text-[var(--text-primary)]">{totalLessons}</strong> ders
          </span>
          {totalQuizzes > 0 && (
            <>
              <span className="text-[var(--border-color)]">|</span>
              <span className="flex items-center gap-1.5">
                <ClipboardList size={12} className="text-purple-400" />
                <strong className="text-[var(--text-primary)]">{totalQuizzes}</strong> sınav
              </span>
            </>
          )}
          {totalDuration > 0 && (
            <>
              <span className="text-[var(--border-color)]">|</span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-green-400" />
                <strong className="text-[var(--text-primary)]">{totalDuration}</strong> dk
              </span>
            </>
          )}
        </div>
      )}

      {/* Bölüm Listesi */}
      {sections.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-[var(--border-color)] rounded-sm">
          <BookOpen size={40} className="mx-auto text-[var(--border-color)] mb-3" />
          <p className="text-[var(--text-primary)] font-semibold mb-1">Müfredat Boş</p>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Kursunuza bölüm ekleyerek müfredatı oluşturmaya başlayın.
          </p>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            İlk Bölümü Ekle
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sections.map((section, si) => (
                <SectionItem
                  key={`section-${si}`}
                  section={section}
                  sectionIndex={si}
                  onChange={(updated) => updateSection(si, updated)}
                  onRemove={() => removeSection(si)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Bölüm Ekle Butonu */}
      {sections.length > 0 && (
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-semibold text-[var(--accent-color)] border-2 border-dashed border-[var(--accent-color)]/30 rounded-sm hover:bg-[var(--accent-color)]/5 hover:border-[var(--accent-color)]/60 transition-all"
        >
          <Plus size={16} />
          Yeni Bölüm Ekle
        </button>
      )}

      {/* Yardım Notu */}
      <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-sm p-3 space-y-1">
        <p className="font-semibold text-[var(--text-primary)]">💡 İpuçları</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Bölümleri ve dersleri <strong>sürükle-bırak</strong> ile yeniden sıralayabilirsiniz.</li>
          <li>Her ders için <strong>Video</strong>, <strong>Metin</strong> veya <strong>Sınav</strong> içerik tipi seçebilirsiniz.</li>
          <li>Sınavlar için <strong>JSON import</strong> özelliğini kullanabilirsiniz.</li>
          <li><strong>Göz ikonu</strong> ile dersi ücretsiz önizleme olarak işaretleyebilirsiniz.</li>
        </ul>
      </div>
    </div>
  );
}
