"use client";

import { useState, useRef } from "react";
import { Upload, Download, X, Check, AlertTriangle, FileJson, Loader2 } from "lucide-react";
import { QuizImportSchema, type Quiz, type QuizQuestion } from "@/lib/course-builder-schema";

interface QuizJsonImportProps {
  onImport: (quiz: Quiz) => void;
  onClose: () => void;
}

export default function QuizJsonImport({ onImport, onClose }: QuizJsonImportProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const exampleJson = {
    title: "Örnek Sınav",
    description: "Sınav açıklaması",
    time_limit: 30,
    pass_score: 70,
    questions: [
      {
        question: "Çelik yapılarda en yaygın birleşim türü nedir?",
        type: "multiple_choice",
        options: ["Kaynaklı", "Bulonlu", "Perçinli", "Yapıştırmalı"],
        correct_answer: "Bulonlu",
        explanation: "Modern çelik yapılarda bulonlu birleşimler tercih edilir.",
        points: 2,
      },
      {
        question: "Betonarme yapılarda donatı oranı %1 ile %4 arasında olmalıdır.",
        type: "true_false",
        correct_answer: "true",
        points: 1,
      },
    ],
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target?.result as string);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setLoading(true);
    setError(null);
    try {
      const parsed = JSON.parse(jsonText);
      const result = QuizImportSchema.safeParse(parsed);
      if (!result.success) {
        const firstError = result.error.issues[0];
        setError(`Doğrulama hatası: ${firstError.path.join(".")} — ${firstError.message}`);
        setLoading(false);
        return;
      }

      const data = result.data;
      const quiz: Quiz = {
        title: data.title,
        description: data.description ?? "",
        time_limit: data.time_limit ?? null,
        pass_score: data.pass_score ?? 60,
        questions: data.questions.map((q, i): QuizQuestion => ({
          question: q.question,
          question_type: q.type,
          options: q.options ?? [],
          correct_answer: q.correct_answer ?? "",
          explanation: q.explanation ?? "",
          points: q.points ?? 1,
          sort_order: i,
        })),
      };

      setSuccess(true);
      setTimeout(() => {
        onImport(quiz);
        onClose();
      }, 800);
    } catch {
      setError("Geçersiz JSON formatı. Lütfen JSON sözdizimini kontrol edin.");
    }
    setLoading(false);
  };

  const downloadExample = () => {
    const blob = new Blob([JSON.stringify(exampleJson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sinav-sablonu.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-sm w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <FileJson size={18} className="text-[var(--accent-color)]" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">JSON Sınav Import</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Info */}
          <div className="bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded-sm p-3 text-sm text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text-primary)] mb-1">JSON Şeması Hakkında</p>
            <p>Sınav verilerinizi belirli bir JSON formatında yükleyin. Örnek şablonu indirerek başlayabilirsiniz.</p>
          </div>

          {/* Upload + Example */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-[var(--border-color)] rounded-sm cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
              <Upload size={14} />
              JSON Dosyası Yükle
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
            </label>
            <button
              onClick={downloadExample}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
            >
              <Download size={14} />
              Örnek Şablon İndir
            </button>
          </div>

          {/* JSON Textarea */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">
              JSON İçeriği
            </label>
            <textarea
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-sm px-3 py-2 text-xs font-mono text-[var(--text-primary)] min-h-[200px] resize-y focus:outline-none focus:border-[var(--accent-color)]"
              placeholder={JSON.stringify(exampleJson, null, 2)}
              value={jsonText}
              onChange={(e) => { setJsonText(e.target.value); setError(null); }}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-sm p-3 text-sm text-red-400">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-sm p-3 text-sm text-green-400">
              <Check size={16} />
              <span>Sınav başarıyla import edildi!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-secondary)] transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleImport}
            disabled={!jsonText.trim() || loading || success}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-[var(--accent-color)] text-white rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Import Et
          </button>
        </div>
      </div>
    </div>
  );
}
