'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Property, UserProfile } from '@/types';
import { INITIAL_PROPERTIES } from '@/lib/data';

interface ToastState {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  comparison: string[];
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('bn');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('tolet_lang') as Language;
      if (savedLang === 'bn' || savedLang === 'en') {
        setLangState(savedLang);
      }
      const savedFavs = JSON.parse(localStorage.getItem('tolet_favs') || '[]');
      if (Array.isArray(savedFavs)) setFavorites(savedFavs);
      const savedCmp = JSON.parse(localStorage.getItem('tolet_cmp') || '[]');
      if (Array.isArray(savedCmp)) setComparison(savedCmp);
      const savedUser = JSON.parse(localStorage.getItem('tolet_user') || 'null');
      if (savedUser) setUser(savedUser);
    } catch {
      // Ignore localStorage read errors in SSR/strict env
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem('tolet_lang', l);
    } catch {}
  };

  const toggleLang = () => {
    setLang(lang === 'bn' ? 'en' : 'bn');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('tolet_favs', JSON.stringify(next));
      } catch {}
      showToast(
        prev.includes(id)
          ? lang === 'bn'
            ? 'সংরক্ষণ বাদ দেওয়া হয়েছে'
            : 'Removed from saved'
          : lang === 'bn'
          ? 'সংরক্ষিত হয়েছে'
          : 'Saved to your list'
      );
      return next;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem('tolet_favs');
    } catch {}
    showToast(lang === 'bn' ? 'সংরক্ষিত তালিকা খালি করা হয়েছে' : 'Saved list cleared');
  };

  const toggleComparison = (id: string) => {
    setComparison((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((x) => x !== id);
        try {
          localStorage.setItem('tolet_cmp', JSON.stringify(next));
        } catch {}
        return next;
      }
      if (prev.length >= 3) {
        showToast(
          lang === 'bn'
            ? 'সর্বোচ্চ তিনটি বাসা তুলনা করা যায়'
            : 'You can compare up to three homes',
          'info'
        );
        return prev;
      }
      const next = [...prev, id];
      try {
        localStorage.setItem('tolet_cmp', JSON.stringify(next));
      } catch {}
      showToast(
        lang === 'bn' ? 'তুলনায় যোগ হয়েছে' : 'Added to comparison'
      );
      return next;
    });
  };

  const clearComparison = () => {
    setComparison([]);
    try {
      localStorage.removeItem('tolet_cmp');
    } catch {}
    showToast(lang === 'bn' ? 'তুলনা তালিকা খালি করা হয়েছে' : 'Comparison cleared');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        favorites,
        toggleFavorite,
        clearFavorites,
        comparison,
        toggleComparison,
        clearComparison,
        properties,
        setProperties,
        user,
        setUser,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
