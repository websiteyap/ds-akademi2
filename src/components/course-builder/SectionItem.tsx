"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  BookOpen,
  Layers,
} from "lucide-react";
import { type Section, type Lesson, createEmptyLesson } from "@/lib/course-builder-schema";
import LessonItem from "./LessonItem";

interface SectionItemProps {
  section: Section;
  sectionIndex: number;
  onChange: (section: Section) => void;
  onRemove: () => void;
}

export default function SectionItem({
  section,
  sectionIndex,
  onChange,
  onRemove,
}: SectionItemProps) {
  const [expanded, setExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `section-${sectionIndex}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Ders sürükle-bırak sensörleri
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const lessonIds = section.lessons.map((_, i) => `lesson-${sectionIndex}-${i}`);

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessonIds.indexOf(active.id as string);
    const newIndex = lessonIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newLessons = arrayMove(section.lessons, oldIndex, newIndex).map(
      (l, i) => ({ ...l, sort_order: i })
    );
    onChange({ ...section, lessons: newLessons });
  };

  const addLesson = () => {
    const newLesson = createEmptyLesson(section.lessons.length);
    onChange({ ...section, lessons: [...section.lessons, newLesson] });
  };

  const updateLesson = (idx: number, lesson: Lesson) => {
    const updated = section.lessons.map((l, i) => (i === idx ? lesson : l));
    onChange({ ...section, lessons: updated });
  };

  const removeLesson = (idx: number) => {
    onChange({ ...section, lessons: section.lessons.filter((_, i) => i !== idx) });
  };

  const totalDuration = section.lessons.reduce(
    (sum, l) => sum + (l.duration_min ?? 0),
    0
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-[var(--border-color)] rounded-sm overflow-hidden ${isDragging ? "shadow-xl z-50" : ""}`}
    >
      {/* Bölüm Başlığı */}
      <div className="flex items-center gap-2 px-3 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-grab active:cursor-grabbing shrink-0"
          title="Bölümü sürükle"
        >
          <GripVertical size={16} />
        </button>

        {/* Bölüm İkonu */}
        <div className="w-7 h-7 rounded bg-[var(--accent-color)]/10 flex items-center justify-center shrink-0">
          <Layers size={14} className="text-[var(--accent-color)]" />
        </div>

        {/* Bölüm Başlığı Input */}
        <input
          type="text"
          className="flex-1 bg-transparent text-sm font-bold text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none min-w-0"
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          placeholder="Bölüm başlığı..."
          onClick={(e) => e.stopPropagation()}
        />

        {/* Meta Bilgiler */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <BookOpen size={11} />
            {section.lessons.length} ders
          </span>
          {totalDuration > 0 && (
            <span className="text-xs text-[var(--text-secondary)]">
              {totalDuration} dk
            </span>
          )}
        </div>

        {/* Sil */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded shrink-0 transition-colors"
          title="Bölümü sil"
        >
          <Trash2 size={14} />
        </button>

        {/* Aç/Kapat */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded shrink-0"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Bölüm İçeriği */}
      {expanded && (
        <div className="p-3 space-y-2 bg-[var(--bg-color)]">
          {/* Bölüm Açıklaması */}
          <input
            type="text"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-sm px-3 py-1.5 text-xs text-[var(--text-secondary)] placeholder:text-[var(--text-secondary)]/60 focus:outline-none focus:border-[var(--accent-color)]"
            value={section.description ?? ""}
            onChange={(e) => onChange({ ...section, description: e.target.value })}
            placeholder="Bölüm açıklaması (isteğe bağlı)..."
          />

          {/* Dersler */}
          {section.lessons.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-[var(--border-color)] rounded-sm text-[var(--text-secondary)] text-xs ml-4">
              Bu bölümde henüz ders yok. Aşağıdan ders ekleyin.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleLessonDragEnd}
            >
              <SortableContext items={lessonIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5">
                  {section.lessons.map((lesson, li) => (
                    <LessonItem
                      key={`lesson-${sectionIndex}-${li}`}
                      lesson={lesson}
                      lessonIndex={li}
                      sectionIndex={sectionIndex}
                      onChange={(updated) => updateLesson(li, updated)}
                      onRemove={() => removeLesson(li)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Ders Ekle Butonu */}
          <button
            type="button"
            onClick={addLesson}
            className="flex items-center gap-1.5 ml-4 px-3 py-1.5 text-xs font-semibold text-[var(--accent-color)] border border-dashed border-[var(--accent-color)]/40 rounded-sm hover:bg-[var(--accent-color)]/5 transition-colors w-full justify-center"
          >
            <Plus size={12} />
            Ders / Sınav Ekle
          </button>
        </div>
      )}
    </div>
  );
}
