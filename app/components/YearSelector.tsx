/**
 * @fileoverview Year selector dropdown component
 * @grep_search YearSelector, useEstablishmentContext, year
 * 
 * Dropdown component for selecting the active year
 * Allows users to switch between historical years and add new years
 */

"use client";

import { useEstablishmentContext } from "@/app/hooks/useEstablishmentContext";

/**
 * Year selector component props
 */
interface YearSelectorProps {
  /**
   * Available years to display in dropdown
   * Defaults to current year ± 5 years
   */
  availableYears?: number[];
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Generate year range (current year ± 5 years)
 * Allows selection of past and future years
 */
const getDefaultYearRange = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push(i);
  }
  
  return years.sort((a, b) => b - a); // Descending order
};

/**
 * Year selector dropdown component
 * Integrates with establishment context to manage global year state
 * 
 * @example
 * <YearSelector availableYears={[2023, 2024, 2025]} />
 */
export function YearSelector({ availableYears, className = "" }: YearSelectorProps) {
  const { year, setYear } = useEstablishmentContext();
  const years = availableYears ?? getDefaultYearRange();

  /**
   * Handle year change from dropdown
   */
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    if (!isNaN(selectedYear)) {
      setYear(selectedYear);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <label htmlFor="year-selector" className="text-sm font-medium text-slate-700">
        Year:
      </label>
      <select
        id="year-selector"
        value={year}
        onChange={handleYearChange}
        className="input-field py-1.5 text-sm w-32"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Simple year badge component (non-interactive)
 * Shows selected year as a badge instead of dropdown
 * 
 * @example
 * <YearBadge />
 */
export function YearBadge() {
  const { year } = useEstablishmentContext();

  return (
    <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-900 rounded-md text-sm font-medium">
      📅 {year}
    </div>
  );
}

