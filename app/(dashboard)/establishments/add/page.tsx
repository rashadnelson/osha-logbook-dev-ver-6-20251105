/**
 * @fileoverview Add new establishment form page
 * @grep_search AddEstablishmentPage, useForm, establishmentFormSchema
 * 
 * Allows safety officers to register a new establishment
 * Validates input with React Hook Form + Zod before submission
 */

"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import {
  establishmentFormSchema,
  type EstablishmentFormData,
  US_STATE_CODES,
} from "@/lib/validations/establishment";

/**
 * Add Establishment page component
 * Renders form with full validation and error handling
 */
export default function AddEstablishmentPage() {
  const router = useRouter();
  const utils = trpc.useContext();

  /**
   * Setup form with React Hook Form + Zod validation
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "CA",
      zipCode: "",
      naicsCode: "",
      industryDescription: "",
      averageEmployees: 0,
    },
  });

  /**
   * tRPC mutation to create establishment
   */
  const createMutation = trpc.establishment.create.useMutation({
    onSuccess: async () => {
      // Invalidate list query to refetch establishments
      await utils.establishment.list.invalidate();
      
      // Redirect to establishments list
      router.push("/establishments");
    },
    onError: (error) => {
      console.error("Failed to create establishment:", error);
      alert(`Error: ${error.message}`);
    },
  });

  /**
   * Form submission handler
   * Validates data and calls tRPC mutation
   */
  const onSubmit = (data: EstablishmentFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Add New Establishment
        </h1>
        <p className="text-slate-600">
          Register a new establishment to start tracking OSHA incidents.
          All fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <div className="space-y-6">
          {/* Establishment Name */}
          <div>
            <label htmlFor="name" className="label">
              Establishment Name *
            </label>
            <input
              id="name"
              type="text"
              className="input-field"
              placeholder="Acme Manufacturing Plant #3"
              disabled={isSubmitting}
              {...register("name")}
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="label">
              Street Address *
            </label>
            <input
              id="address"
              type="text"
              className="input-field"
              placeholder="1234 Industrial Parkway"
              disabled={isSubmitting}
              {...register("address")}
            />
            {errors.address && (
              <p className="error-message">{errors.address.message}</p>
            )}
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="city" className="label">
                City *
              </label>
              <input
                id="city"
                type="text"
                className="input-field"
                placeholder="Los Angeles"
                disabled={isSubmitting}
                {...register("city")}
              />
              {errors.city && (
                <p className="error-message">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="label">
                State *
              </label>
              <select
                id="state"
                className="input-field"
                disabled={isSubmitting}
                {...register("state")}
              >
                {US_STATE_CODES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="error-message">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="zipCode" className="label">
                ZIP Code *
              </label>
              <input
                id="zipCode"
                type="text"
                className="input-field"
                placeholder="90001"
                disabled={isSubmitting}
                {...register("zipCode")}
              />
              {errors.zipCode && (
                <p className="error-message">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          {/* NAICS Code */}
          <div>
            <label htmlFor="naicsCode" className="label">
              NAICS Code (Optional)
            </label>
            <input
              id="naicsCode"
              type="text"
              className="input-field"
              placeholder="332710"
              maxLength={6}
              disabled={isSubmitting}
              {...register("naicsCode")}
            />
            {errors.naicsCode && (
              <p className="error-message">{errors.naicsCode.message}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              6-digit code for OSHA industry classification (e.g., 332710 for Machine Shops)
            </p>
          </div>

          {/* Industry Description */}
          <div>
            <label htmlFor="industryDescription" className="label">
              Industry Description (Optional)
            </label>
            <textarea
              id="industryDescription"
              className="input-field"
              rows={3}
              placeholder="e.g., Metal fabrication and assembly"
              disabled={isSubmitting}
              {...register("industryDescription")}
            />
            {errors.industryDescription && (
              <p className="error-message">{errors.industryDescription.message}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Human-readable description of your industry
            </p>
          </div>

          {/* Average Employees */}
          <div>
            <label htmlFor="averageEmployees" className="label">
              Average Number of Employees *
            </label>
            <input
              id="averageEmployees"
              type="number"
              min="0"
              className="input-field"
              placeholder="50"
              disabled={isSubmitting}
              {...register("averageEmployees", {
                valueAsNumber: true,
              })}
            />
            {errors.averageEmployees && (
              <p className="error-message">{errors.averageEmployees.message}</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Used for OSHA 300A calculations. Enter 0 if temporarily closed.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Establishment"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

