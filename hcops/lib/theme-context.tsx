"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "./i18n";

interface ThemeCtx {
  dark: boolean;
  toggleDark: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<ThemeCtx>({
  dark: false,
  toggleDark: () => {},
  lang: "en",
  setLang: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("hcops_dark");
    const savedLang = localStorage.getItem("hcops_lang") as Lang | null;
    if (saved === "1") setDark(true);
    if (savedLang) setLangState(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("hcops_dark", dark ? "1" : "0");
  }, [dark]);

  function toggleDark() { setDark((d) => !d); }

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("hcops_lang", l);
  }

  return (
    <Ctx.Provider value={{ dark, toggleDark, lang, setLang }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() { return useContext(Ctx); }
