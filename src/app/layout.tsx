import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import NavbarWrapper from "@/components/NavbarWrapper";
import FilterBarWrapper from "@/components/FilterBarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalLoading from "@/components/GlobalLoading";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import Toaster from "@/components/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DS Akademi",
  description: "Yapısal mühendislik eğitim platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inject script to prevent dark mode/light mode FOUC (Flash of unstyled content)
  // This runs synchronously before the DOM paints, checking localStorage or falling back to time.
  const themeScript = `
    (function() {
      try {
        var saved = localStorage.getItem('ds-theme');
        var autoTheme = 'light';
        if (!saved) {
          var hour = new Date().getHours();
          var isNightTime = hour >= 20 || hour < 8;
          autoTheme = isNightTime ? 'dark' : 'light';
        }
        var finalTheme = saved ? saved : autoTheme;
        document.documentElement.setAttribute('data-theme', finalTheme);
      } catch (e) {}
    })();
  `;

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <AuthSessionProvider>
          <GlobalLoading />
          <ThemeProvider>
            <NavbarWrapper />
            <FilterBarWrapper />
            <main id="main-content">
              {children}
            </main>
            <FooterWrapper />
            <ScrollToTop />
          </ThemeProvider>
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
