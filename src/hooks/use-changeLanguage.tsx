// biome-ignore assist/source/organizeImports: <explanation>
import { useState, useEffect } from 'react';

type Language = "en" | "ne";

export const useLanguage = () => {
  const [locale, setCurrentLanguage] = useState<Language>(() => {
    // Initialize from localStorage if available, otherwise default to 'en'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentLanguage') as Language;
      return saved || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentLanguage' && e.newValue) {
        setCurrentLanguage(e.newValue as Language);
      }
    };

    // Function to handle custom events (for same-tab changes)
    const handleLanguageChange = (e: CustomEvent) => {
      setCurrentLanguage(e.detail.language);
    };

    // Listen for storage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom language change events (same-tab)
    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const updateLanguage = (newLang: Language) => {
    setCurrentLanguage(newLang);
    localStorage.setItem('currentLanguage', newLang);
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { language: newLang }
    }));
  };

  return { locale, updateLanguage };
};