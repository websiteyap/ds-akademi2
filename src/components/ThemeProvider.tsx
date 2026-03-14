"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ds-theme') as Theme | null;
    
    // Otomatik saat kontrolü: 20:00 - 08:00 arası dark mode, geri kalan aydınlık.
    const hour = new Date().getHours();
    const isNightTime = hour >= 20 || hour < 8;
    const autoTheme = isNightTime ? 'dark' : 'light';
    
    // Eğer kullanıcı daha önce elle değiştirmişse onu kullanalım, yoksa saate göre
    const finalTheme = saved ? saved : autoTheme;
    
    setTheme(finalTheme);
    document.documentElement.setAttribute('data-theme', finalTheme);
    
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ds-theme', next);
  };

  // SSR sırasında flash olmaması için
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
