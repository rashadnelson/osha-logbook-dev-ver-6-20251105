/**
 * @fileoverview Establishment selector dropdown component
 * @grep_search EstablishmentSelector, useEstablishmentContext, trpc
 * 
 * Dropdown component for selecting the active establishment
 * Fetches establishments via tRPC and integrates with global context
 */

"use client";

import { useEstablishmentContext } from "@/app/hooks/useEstablishmentContext";
import { trpc } from "@/app/_trpc/client";

/**
 * Establishment selector component props
 */
interface EstablishmentSelectorProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Show label text
   */
  showLabel?: boolean;
}

/**
 * Establishment selector dropdown component
 * Loads user's establishments and allows switching between them
 * 
 * @example
 * <EstablishmentSelector showLabel={true} />
 */
export function EstablishmentSelector({
  className = "",
  showLabel = true,
}: EstablishmentSelectorProps) {
  const { establishmentId, setEstablishmentId } = useEstablishmentContext();
  const { data: establishments, isLoading } = trpc.establishment.list.useQuery();

  /**
   * Handle establishment change from dropdown
   */
  const handleEstablishmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setEstablishmentId(value || null);
  };

  /**
   * Show loading state
   */
  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-slate-700">Establishment:</span>
        )}
        <div className="input-field py-1.5 text-sm text-slate-400 w-64">
          Loading...
        </div>
      </div>
    );
  }

  /**
   * Show empty state if no establishments
   */
  if (!establishments || establishments.length === 0) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-slate-700">Establishment:</span>
        )}
        <div className="text-sm text-slate-500 italic">
          No establishments yet
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabel && (
        <label htmlFor="establishment-selector" className="text-sm font-medium text-slate-700">
          Establishment:
        </label>
      )}
      <select
        id="establishment-selector"
        value={establishmentId || ""}
        onChange={handleEstablishmentChange}
        className="input-field py-1.5 text-sm w-64"
      >
        <option value="">Select establishment...</option>
        {establishments.map((est) => (
          <option key={est.id} value={est.id}>
            {est.name} - {est.city}, {est.state}
          </option>
        ))}
      </select>
    </div>
  );
}

