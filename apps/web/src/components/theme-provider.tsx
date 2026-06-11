"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sdp-theme") as Theme | null;
    if (saved) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

    setResolvedTheme(resolved);
    root.setAttribute("data-theme", resolved);
    localStorage.setItem("sdp-theme", theme);

    if (resolved === "light") {
      root.style.setProperty("--sdp-bg", "#fafafa");
      root.style.setProperty("--sdp-sidebar-bg", "#ffffff");
      root.style.setProperty("--sdp-text-high", "#171717");
      root.style.setProperty("--sdp-text-medium", "#525252");
      root.style.setProperty("--sdp-text-low", "#a3a3a3");
    } else {
      root.style.setProperty("--sdp-bg", "#0a0a0f");
      root.style.setProperty("--sdp-sidebar-bg", "#0f0f16");
      root.style.setProperty("--sdp-text-high", "#f0f0f5");
      root.style.setProperty("--sdp-text-medium", "#8b8b9e");
      root.style.setProperty("--sdp-text-low", "#5a5a6e");
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
