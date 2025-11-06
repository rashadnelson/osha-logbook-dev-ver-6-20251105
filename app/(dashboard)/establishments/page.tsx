/**
 * @fileoverview Establishments list page
 * @grep_search EstablishmentsPage, trpc.establishment.list, useQuery
 * 
 * Displays all establishments owned by the authenticated user
 * Provides actions to add, edit, view, and delete establishments
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";

/**
 * Establishments list page component
 * Shows table of all user's establishments with management actions
 */
export default function EstablishmentsPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const utils = trpc.useContext();

  /**
   * Query all establishments for current user
   */
  const { data: establishments, isLoading, error } = trpc.establishment.list.useQuery();

  /**
   * Delete mutation
   */
  const deleteMutation = trpc.establishment.delete.useMutation({
    onSuccess: async () => {
      // Invalidate and refetch list
      await utils.establishment.list.invalidate();
      setDeletingId(null);
    },
    onError: (error) => {
      console.error("Failed to delete establishment:", error);
      alert(`Error: ${error.message}`);
      setDeletingId(null);
    },
  });

  /**
   * Handle delete with confirmation
   */
  const handleDelete = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${name}"?\n\nThis will remove all associated incidents and cannot be undone.`
      )
    ) {
      setDeletingId(id);
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Establishments
          </h1>
          <p className="text-slate-600">
            Manage your facilities and locations for OSHA incident tracking
          </p>
        </div>

        <Link href="/establishments/add" className="btn-primary">
          + Add Establishment
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600">Loading establishments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-800 font-medium">Failed to load establishments</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && establishments?.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🏭</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            No establishments yet
          </h2>
          <p className="text-slate-600 mb-6">
            Get started by adding your first establishment
          </p>
          <Link href="/establishments/add" className="btn-primary">
            + Add Your First Establishment
          </Link>
        </div>
      )}

      {/* Establishments Table */}
      {!isLoading && !error && establishments && establishments.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    NAICS Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Avg. Employees
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {establishments.map((establishment) => (
                  <tr key={establishment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {establishment.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {establishment.city}, {establishment.state} {establishment.zipCode}
                      </div>
                      <div className="text-xs text-slate-500">
                        {establishment.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-slate-900">
                        {establishment.naicsCode || (
                          <span className="italic text-slate-400 font-sans">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {establishment.industryDescription || (
                          <span className="italic text-slate-400">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {establishment.averageEmployees}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/establishments/${establishment.id}`}
                          className="text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(establishment.id, establishment.name)}
                          disabled={deletingId === establishment.id}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                        >
                          {deletingId === establishment.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Showing {establishments.length} {establishments.length === 1 ? "establishment" : "establishments"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

