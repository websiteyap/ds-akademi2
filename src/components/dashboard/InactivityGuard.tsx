"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { AlertTriangle, Clock } from 'lucide-react';

// 1 hour inactivity = 3600 seconds
const INACTIVITY_MS = 60 * 60 * 1000;
// Show warning 5 minutes before timeout
const WARNING_MS = 5 * 60 * 1000;

export default function InactivityGuard() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 min in seconds
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSignOut = useCallback(() => {
    setShowWarning(false);
    signOut({ callbackUrl: '/login?reason=timeout' });
  }, []);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Set warning timer (fires 5 min before timeout)
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(300);
      // Start countdown display
      countdownRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, INACTIVITY_MS - WARNING_MS);

    // Set actual sign-out timer
    timerRef.current = setTimeout(() => {
      handleSignOut();
    }, INACTIVITY_MS);
  }, [handleSignOut]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleActivity = () => {
      if (!showWarning) resetTimer();
    };

    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    resetTimer(); // Start on mount

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [resetTimer, showWarning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Oturum Sona Eriyor
        </h2>

        <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
          Uzun süredir işlem yapılmadığı için oturumunuz kapatılacak.
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock size={18} className="text-amber-500" />
          <span className="text-3xl font-mono font-bold text-amber-500 tabular-nums">
            {formatTime(countdown)}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSignOut}
            className="flex-1 py-2.5 px-4 rounded border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-semibold hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            Çıkış Yap
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 py-2.5 px-4 rounded bg-[var(--accent-color)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  );
}
