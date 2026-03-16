"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, FileJson, Clock, Award } from "lucide-react";
import {
  type Quiz,
  type QuizQuestion,
  createEmptyQuestion,
} from "@/lib/course-builder-schema";
import QuizJsonImport from "./QuizJsonImport";

interface QuizBuilderProps {
  quiz: Quiz;
  onChange: (quiz: Quiz) => void;
}

const QUESTION_TYPE_LABELS = {
  multiple_choice: "Çoktan Seçmeli",
  true_false: "Doğru / Yanlış",
  open_ended: "Açık Uçlu",
};

export default function QuizBuilder({ quiz, onChange }: QuizBuilderProps) {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [showImport, setShowImport] = useState(false);

  const updateQuiz = (key: keyof Quiz, value: unknown) => {
    onChange({ ...quiz, [key]: value });
  };

  const addQuestion = () => {
    const newQ = createEmptyQuestion(quiz.questions.length);
    onChange({ ...quiz, questions: [...quiz.questions, newQ] });
    setExpandedQ(quiz.questions.length);
  };

  const updateQuestion = (idx: number, key: keyof QuizQuestion, value: unknown) => {
    const updated = quiz.questions.map((q, i) =>
      i === idx ? { ...q, [key]: value } : q
    );
    onChange({ ...quiz, questions: updated });
  };

  const removeQuestion = (idx: number) => {
    onChange({ ...quiz, questions: quiz.questions.filter((_, i) => i !== idx) });
    if (expandedQ === idx) setExpandedQ(null);
  };

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    const arr = [...quiz.questions];
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    onChange({ ...quiz, questions: arr });
  };

  const updateOption = (qIdx: number, oIdx: number, val: string) => {
    const updated = quiz.questions.map((q, i) => {
      if (i !== qIdx) return q;
      const opts = [...(q.options ?? [])];
      opts[oIdx] = val;
      return { ...q, options: opts };
    });
    onChange({ ...quiz, questions: updated });
  };

  const addOption = (qIdx: number) => {
    const updated = quiz.questions.map((q, i) => {
      if (i !== qIdx) return q;
      return { ...q, options: [...(q.options ?? []), ""] };
    });
    onChange({ ...quiz, questions: updated });
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const updated = quiz.questions.map((q, i) => {
      if (i !== qIdx) return q;
      return { ...q, options: (q.options ?? []).filter((_, oi) => oi !== oIdx) };
    });
    onChange({ ...quiz, questions: updated });
  };

  const handleImport = (importedQuiz: Quiz) => {
    onChange(importedQuiz);
  };

  return (
    <div className="space-y-4">
      {/* Sınav Ayarları */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-sm p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-color)]">Sınav Ayarları</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Sınav Başlığı *</label>
            <input
              type="text"
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              value={quiz.title}
              onChange={(e) => updateQuiz("title", e.target.value)}
              placeholder="Sınav başlığı..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Açıklama</label>
            <input
              type="text"
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              value={quiz.description ?? ""}
              onChange={(e) => updateQuiz("description", e.target.value)}
              placeholder="Sınav açıklaması..."
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <Clock size={11} /> Süre Limiti (dakika)
            </label>
            <input
              type="number"
              min={1}
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              value={quiz.time_limit ?? ""}
              onChange={(e) => updateQuiz("time_limit", e.target.value ? Number(e.target.value) : null)}
              placeholder="Sınırsız"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1">
              <Award size={11} /> Geçme Notu (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              value={quiz.pass_score ?? 60}
              onChange={(e) => updateQuiz("pass_score", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Sorular Başlığı */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          Sorular ({quiz.questions.length})
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
          >
            <FileJson size={12} /> JSON Import
          </button>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={12} /> Soru Ekle
          </button>
        </div>
      </div>

      {/* Soru Listesi */}
      {quiz.questions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[var(--border-color)] rounded-sm text-[var(--text-secondary)] text-sm">
          Henüz soru eklenmedi. &quot;Soru Ekle&quot; butonuna tıklayın veya JSON import edin.
        </div>
      ) : (
        <div className="space-y-2">
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="border border-[var(--border-color)] rounded-sm overflow-hidden">
              {/* Soru Başlığı */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-secondary)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
              >
                <span className="text-xs font-bold text-[var(--accent-color)] w-6 text-center shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-[var(--text-primary)] truncate">
                  {q.question || <span className="text-[var(--text-secondary)] italic">Soru metni girilmedi...</span>}
                </span>
                <span className="text-xs text-[var(--text-secondary)] shrink-0 hidden sm:block">
                  {QUESTION_TYPE_LABELS[q.question_type]}
                </span>
                <span className="text-xs font-bold text-[var(--accent-color)] shrink-0">{q.points}p</span>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveQuestion(idx, -1); }}
                    className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveQuestion(idx, 1); }}
                    className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <ChevronDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeQuestion(idx); }}
                    className="p-1 text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                  {expandedQ === idx ? <ChevronUp size={14} className="text-[var(--text-secondary)]" /> : <ChevronDown size={14} className="text-[var(--text-secondary)]" />}
                </div>
              </div>

              {/* Soru Detayları */}
              {expandedQ === idx && (
                <div className="px-3 py-3 space-y-3 bg-[var(--bg-color)]">
                  {/* Soru Tipi + Puan */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Soru Tipi</label>
                      <select
                        className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                        value={q.question_type}
                        onChange={(e) => updateQuestion(idx, "question_type", e.target.value as QuizQuestion["question_type"])}
                      >
                        <option value="multiple_choice">Çoktan Seçmeli</option>
                        <option value="true_false">Doğru / Yanlış</option>
                        <option value="open_ended">Açık Uçlu</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Puan</label>
                      <input
                        type="number"
                        min={1}
                        className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                        value={q.points ?? 1}
                        onChange={(e) => updateQuestion(idx, "points", Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Soru Metni */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Soru Metni *</label>
                    <textarea
                      className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-sm text-[var(--text-primary)] min-h-[60px] resize-y focus:outline-none focus:border-[var(--accent-color)]"
                      value={q.question}
                      onChange={(e) => updateQuestion(idx, "question", e.target.value)}
                      placeholder="Soru metnini girin..."
                    />
                  </div>

                  {/* Çoktan Seçmeli Seçenekler */}
                  {q.question_type === "multiple_choice" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[var(--text-secondary)]">Seçenekler</label>
                        <button
                          type="button"
                          onClick={() => addOption(idx)}
                          className="text-xs text-[var(--accent-color)] hover:underline"
                        >
                          + Seçenek Ekle
                        </button>
                      </div>
                      {(q.options ?? []).map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${idx}`}
                            checked={q.correct_answer === opt}
                            onChange={() => updateQuestion(idx, "correct_answer", opt)}
                            className="accent-[var(--accent-color)] shrink-0"
                            title="Doğru cevap olarak işaretle"
                          />
                          <input
                            type="text"
                            className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                            value={opt}
                            onChange={(e) => updateOption(idx, oi, e.target.value)}
                            placeholder={`Seçenek ${oi + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(idx, oi)}
                            className="p-1 text-red-500 hover:text-red-400 shrink-0"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                      <p className="text-xs text-[var(--text-secondary)] italic">Radio butonuna tıklayarak doğru cevabı işaretleyin.</p>
                    </div>
                  )}

                  {/* Doğru/Yanlış */}
                  {q.question_type === "true_false" && (
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Doğru Cevap</label>
                      <div className="flex gap-3">
                        {["true", "false"].map((val) => (
                          <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`tf-${idx}`}
                              checked={q.correct_answer === val}
                              onChange={() => updateQuestion(idx, "correct_answer", val)}
                              className="accent-[var(--accent-color)]"
                            />
                            <span className="text-sm text-[var(--text-primary)]">
                              {val === "true" ? "✅ Doğru" : "❌ Yanlış"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Açıklama */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Açıklama (isteğe bağlı)</label>
                    <textarea
                      className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm px-2 py-1.5 text-xs text-[var(--text-primary)] min-h-[50px] resize-y focus:outline-none focus:border-[var(--accent-color)]"
                      value={q.explanation ?? ""}
                      onChange={(e) => updateQuestion(idx, "explanation", e.target.value)}
                      placeholder="Cevap açıklaması..."
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* JSON Import Modal */}
      {showImport && (
        <QuizJsonImport
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}
