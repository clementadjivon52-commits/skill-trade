"use client";

import { createContext, useContext, useState } from "react";
import fr from "@/i18n/fr.json";
import en from "@/i18n/en.json";

type Lang = "fr" | "en";
type Translations = typeof fr;

const translations: Record<Lang, Translations> = { fr, en };

const LangContext = createContext<{
  lang: Lang;
  t: (key: string) => string;
  setLang: (l: Lang) => void;
}>({ lang: "fr", t: (k) => k, setLang: () => {} });

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = translations[lang];
    for (const k of keys) {
      val = val?.[k];
    }
    return val ?? key;
  };

  const setLang = async (l: Lang) => {
    setLangState(l);
    document.cookie = `lang=${l}; path=/; max-age=31536000`;
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: l }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LangContext);
}
