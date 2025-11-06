/**
 * @fileoverview React context for selected establishment and year
 * @grep_search useEstablishmentContext, EstablishmentProvider, selectedYear
 * 
 * Provides global state for the currently selected establishment and year
 * Used throughout the app to filter incidents and enforce subscriptions
 */

"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

/**
 * Context value type
 */
interface EstablishmentContextValue {
  /**
   * Currently selected establishment ID
   */
  establishmentId: string | null;
  
  /**
   * Currently selected year
   */
  year: number;
  
  /**
   * Update selected establishment
   */
  setEstablishmentId: (id: string | null) => void;
  
  /**
   * Update selected year
   */
  setYear: (year: number) => void;
}

/**
 * Context instance
 */
const EstablishmentContext = createContext<EstablishmentContextValue | undefined>(undefined);

/**
 * Provider component props
 */
interface EstablishmentProviderProps {
  children: ReactNode;
}

/**
 * Get current year as default
 */
const getCurrentYear = () => new Date().getFullYear();

/**
 * Local storage keys
 */
const STORAGE_KEYS = {
  ESTABLISHMENT_ID: "osha-selected-establishment",
  YEAR: "osha-selected-year",
} as const;

/**
 * Establishment context provider
 * Manages selected establishment and year with localStorage persistence
 * 
 * @param children - Child components that need access to context
 */
export function EstablishmentProvider({ children }: EstablishmentProviderProps) {
  const [establishmentId, setEstablishmentIdState] = useState<string | null>(null);
  const [year, setYearState] = useState<number>(getCurrentYear());
  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * Hydrate state from localStorage on mount
   * Prevents hydration mismatch between server and client
   */
  useEffect(() => {
    const savedEstablishmentId = localStorage.getItem(STORAGE_KEYS.ESTABLISHMENT_ID);
    const savedYear = localStorage.getItem(STORAGE_KEYS.YEAR);

    if (savedEstablishmentId) {
      setEstablishmentIdState(savedEstablishmentId);
    }

    if (savedYear) {
      const parsedYear = parseInt(savedYear, 10);
      if (!isNaN(parsedYear)) {
        setYearState(parsedYear);
      }
    }

    setIsHydrated(true);
  }, []);

  /**
   * Set establishment ID and persist to localStorage
   */
  const setEstablishmentId = (id: string | null) => {
    setEstablishmentIdState(id);
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ESTABLISHMENT_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ESTABLISHMENT_ID);
    }
  };

  /**
   * Set year and persist to localStorage
   */
  const setYear = (newYear: number) => {
    setYearState(newYear);
    localStorage.setItem(STORAGE_KEYS.YEAR, newYear.toString());
  };

  const value: EstablishmentContextValue = {
    establishmentId,
    year,
    setEstablishmentId,
    setYear,
  };

  // Don't render children until hydrated to prevent mismatch
  if (!isHydrated) {
    return null;
  }

  return React.createElement(
    EstablishmentContext.Provider,
    { value },
    children
  );
}

/**
 * Hook to access establishment context
 * Must be used within EstablishmentProvider
 * 
 * @throws Error if used outside provider
 * @returns Context value with establishment ID, year, and setters
 * 
 * @example
 * const { establishmentId, year, setYear } = useEstablishmentContext();
 */
export function useEstablishmentContext() {
  const context = useContext(EstablishmentContext);
  
  if (context === undefined) {
    throw new Error(
      "useEstablishmentContext must be used within EstablishmentProvider"
    );
  }
  
  return context;
}

