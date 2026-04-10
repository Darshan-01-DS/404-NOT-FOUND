"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Minimal shape needed to display saved scholarships
export interface WatchlistItem {
  id: string;
  name: string;
  provider: string;
  provider_type?: string;
  amount?: number;
  deadline?: string;
  course_levels?: string[];
  categories?: string[];
  genders?: string[];
  min_percentage?: number | null;
  description?: string;
  apply_url?: string;
  is_featured?: boolean;
  field_tags?: string[];
  emoji?: string;
  states?: string[];
  religions?: string[];
  documents_required?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (s: WatchlistItem) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  count: number;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
  isInWatchlist: () => false,
  count: 0,
});

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sa_watchlist");
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist on every change — this is INSTANT, no refresh needed
  useEffect(() => {
    try {
      localStorage.setItem("sa_watchlist", JSON.stringify(watchlist));
    } catch {}
  }, [watchlist]);

  const addToWatchlist = useCallback((s: WatchlistItem) => {
    setWatchlist((prev) => (prev.some((x) => x.id === s.id) ? prev : [...prev, s]));
  }, []);

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const isInWatchlist = useCallback(
    (id: string) => watchlist.some((s) => s.id === id),
    [watchlist]
  );

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, count: watchlist.length }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
