"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// Global toast state — use the hook to show toasts
type ToastListener = (toasts: ToastMessage[]) => void;
const listeners: ToastListener[] = [];
let toastStore: ToastMessage[] = [];

function notify() {
  listeners.forEach((fn) => fn([...toastStore]));
}

export function toast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).slice(2);
  toastStore = [...toastStore, { id, type, message }];
  notify();
  // Auto-remove after 4 seconds
  setTimeout(() => {
    toastStore = toastStore.filter((t) => t.id !== id);
    notify();
  }, 4000);
}

export const showToast = {
  success: (msg: string) => toast(msg, 'success'),
  error: (msg: string) => toast(msg, 'error'),
  warning: (msg: string) => toast(msg, 'warning'),
  info: (msg: string) => toast(msg, 'info'),
};

const ICONS: Record<ToastType, React.ComponentType<{ size?: number; className?: string }>> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS: Record<ToastType, { border: string; bg: string; icon: string; text: string }> = {
  success: {
    border: 'border-emerald-500/30',
    bg: 'from-emerald-500/10 to-emerald-500/5',
    icon: 'text-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    border: 'border-red-500/30',
    bg: 'from-red-500/10 to-red-500/5',
    icon: 'text-red-500',
    text: 'text-red-600 dark:text-red-400',
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'from-amber-500/10 to-amber-500/5',
    icon: 'text-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    border: 'border-[var(--accent-color)]/30',
    bg: 'from-[var(--accent-color)]/10 to-[var(--accent-color)]/5',
    icon: 'text-[var(--accent-color)]',
    text: 'text-[var(--text-primary)]',
  },
};

function ToastItem({ toast: t, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const Icon = ICONS[t.type];
  const c = COLORS[t.type];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`
        flex items-start gap-3 w-full max-w-sm
        bg-gradient-to-r ${c.bg}
        border ${c.border}
        backdrop-blur-sm
        rounded-lg px-4 py-3 shadow-lg
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
      style={{
        background: 'var(--bg-secondary)',
        backgroundImage: `linear-gradient(135deg, ${
          t.type === 'success' ? 'rgba(34,197,94,0.08)' :
          t.type === 'error' ? 'rgba(239,68,68,0.08)' :
          t.type === 'warning' ? 'rgba(245,158,11,0.08)' :
          'rgba(var(--accent-rgb,0,102,255),0.08)'
        }, transparent)`,
      }}
    >
      <Icon size={18} className={`${c.icon} mt-0.5 shrink-0`} />
      <p className="flex-1 text-sm font-medium text-[var(--text-primary)] leading-snug">{t.message}</p>
      <button
        onClick={onRemove}
        className="shrink-0 p-0.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Kapat"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const listenerRef = useRef<ToastListener | null>(null);

  useEffect(() => {
    const listener: ToastListener = (t) => setToasts(t);
    listenerRef.current = listener;
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  const remove = useCallback((id: string) => {
    toastStore = toastStore.filter((t) => t.id !== id);
    notify();
  }, []);

  return (
    <div
      className="fixed bottom-5 right-5 z-[9998] flex flex-col gap-2 items-end pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto w-full max-w-sm">
          <ToastItem toast={t} onRemove={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
}
