"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Trash2,
  Video,
  FileText,
  ClipboardList,
  Eye,
  EyeOff,
} from "lucide-react";
import { type Lesson, createEmptyQuiz } from "@/lib/course-builder-schema";
import QuizBuilder from "./QuizBuilder";

interface LessonItemProps {
  lesson: Lesson;
  lessonIndex: number;
  sectionIndex: number;
  onChange: (lesson: Lesson) => void;
  onRemove: () => void;
}

const CONTENT_TYPE_CONFIG = {
  video: { label: "Video", icon: Video, color: "text-blue-400", bg: "bg-blue-500/10" },
  text: { label: "Metin", icon: FileText, color: "text-green-400", bg: "bg-green-500/10" },
  quiz: { label: "Sınav", icon: ClipboardList, color: "text-purple-400", bg: "bg-purple-500/10" },
};

export default function LessonItem({
  lesson,
  lessonIndex,
  sectionIndex,
  onChange,
  onRemove,
}: LessonItemProps) {
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `lesson-${sectionIndex}-${lessonIndex}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cfg = CONTENT_TYPE_CONFIG[lesson.content_type];
  const Icon = cfg.icon;

  const update = (key: keyof Lesson, value: unknown) => {
    onChange({ ...lesson, [key]: value });
  };

  const handleTypeChange = (type: Lesson["content_type"]) => {
    const updated: Lesson = {
      ...lesson,
      content_type: type,
      quiz: type === "quiz" ? (lesson.quiz ?? createEmptyQuiz()) : lesson.quiz,
    };
    onChange(updated);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-[var(--border-color)] rounded-sm overflow-hidden ml-4 ${isDragging ? "shadow-lg z-50" : ""}`}
    >
      {/* Ders Başlığı Satırı */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-color)] hover:bg-[var(--bg-secondary)] transition-colors">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-grab active:cursor-grabbing shrink-0"
          title="Sürükle"
        >
          <GripVertical size={14} />
        </button>

        {/* İçerik Tipi İkonu */}
        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${cfg.bg}`}>
          <Icon size={12} className={cfg.color} />
        </div>

        {/* Ders Başlığı Input */}
        <input
          type="text"
          className="flex-1 bg-transparent text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none min-w-0"
          value={lesson.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Ders başlığı..."
          onClick={(e) => e.stopPropagation()}
        />

        {/* Ücretsiz Önizleme */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); update("is_free", !lesson.is_free); }}
          className={`p-1 rounded shrink-0 transition-colors ${lesson.is_free ? "text-green-400" : "text-[var(--text-secondary)]"}`}
          title={lesson.is_free ? "Ücretsiz önizleme (kaldır)" : "Ücretsiz önizleme yap"}
        >
          {lesson.is_free ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>

        {/* Sil */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1 text-red-500 hover:text-red-400 shrink-0"
          title="Dersi sil"
        >
          <Trash2 size={13} />
        </button>

        {/* Aç/Kapat */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Ders İçeriği (Accordion) */}
      {expanded && (
        <div className="px-4 py-3 space-y-4 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
          {/* İçerik Tipi Seçimi */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
              İçerik Tipi
            </label>
            <div className="flex gap-2">
              {(Object.entries(CONTENT_TYPE_CONFIG) as [Lesson["content_type"], typeof CONTENT_TYPE_CONFIG[keyof typeof CONTENT_TYPE_CONFIG]][]).map(([type, config]) => {
                const TypeIcon = config.icon;
                const isActive = lesson.content_type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                      isActive
                        ? `${config.bg} ${config.color} border-current`
                        : "border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                    }`}
                  >
                    <TypeIcon size={12} />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Süre */}
          <div className="flex items-center gap-3">
            <div className="w-40">
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Süre (dakika)</label>
              <input
                type="number"
                min={0}
                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                value={lesson.duration_min ?? ""}
                onChange={(e) => update("duration_min", e.target.value ? Number(e.target.value) : null)}
                placeholder="Opsiyonel"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id={`free-${sectionIndex}-${lessonIndex}`}
                checked={lesson.is_free}
                onChange={(e) => update("is_free", e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-color)]"
              />
              <label
                htmlFor={`free-${sectionIndex}-${lessonIndex}`}
                className="text-sm text-[var(--text-primary)] cursor-pointer"
              >
                Ücretsiz Önizleme
              </label>
            </div>
          </div>

          {/* Video İçeriği */}
          {lesson.content_type === "video" && (
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                Video URL
              </label>
              <input
                type="url"
                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                value={lesson.video_url ?? ""}
                onChange={(e) => update("video_url", e.target.value)}
                placeholder="https://youtube.com/watch?v=... veya Vimeo URL"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                YouTube, Vimeo veya doğrudan video URL&apos;si girin.
              </p>
            </div>
          )}

          {/* Metin İçeriği */}
          {lesson.content_type === "text" && (
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                Metin İçeriği
              </label>
              <textarea
                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-sm text-[var(--text-primary)] min-h-[150px] resize-y focus:outline-none focus:border-[var(--accent-color)] font-mono"
                value={lesson.text_content ?? ""}
                onChange={(e) => update("text_content", e.target.value)}
                placeholder="Ders içeriğini buraya yazın... (HTML desteklenir)"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                HTML etiketleri kullanabilirsiniz: &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h2&gt; vb.
              </p>
            </div>
          )}

          {/* Sınav İçeriği */}
          {lesson.content_type === "quiz" && (
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                Sınav Oluşturucu
              </label>
              <QuizBuilder
                quiz={lesson.quiz ?? createEmptyQuiz()}
                onChange={(quiz) => update("quiz", quiz)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
