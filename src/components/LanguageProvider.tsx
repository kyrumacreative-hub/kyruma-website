"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  languageReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>("es");
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "kyruma-language"
    ) as Language | null;

    if (savedLanguage === "es" || savedLanguage === "en") {
      setLanguageState(savedLanguage);
    } else {
      const browserLanguage = navigator.language.toLowerCase();

      setLanguageState(
        browserLanguage.startsWith("en") ? "en" : "es"
      );
    }

    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!languageReady) return;

    document.documentElement.lang = language;
  }, [language, languageReady]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("kyruma-language", newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languageReady,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider"
    );
  }

  return context;
}