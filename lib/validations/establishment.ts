/**
 * @fileoverview Zod validation schemas for establishment forms
 * @grep_search establishmentFormSchema, zod, validation
 * 
 * Defines client-side and server-side validation rules for establishments
 * Matches backend tRPC input validation to ensure consistency
 */

import { z } from "zod";

/**
 * U.S. state codes for validation
 * Includes all 50 states + DC
 */
export const US_STATE_CODES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
] as const;

/**
 * Establishment form validation schema
 * Validates all required fields for OSHA compliance
 * 
 * @example
 * const form = useForm<EstablishmentFormData>({
 *   resolver: zodResolver(establishmentFormSchema)
 * });
 */
export const establishmentFormSchema = z.object({
  /**
   * Legal name of the establishment
   * Will appear on OSHA forms and reports
   */
  name: z
    .string()
    .min(1, "Establishment name is required")
    .max(255, "Name must be 255 characters or less")
    .trim(),

  /**
   * Street address
   */
  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address must be 500 characters or less")
    .trim(),

  /**
   * City name
   */
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be 100 characters or less")
    .trim(),

  /**
   * Two-letter state code
   * Must be valid U.S. state or DC
   */
  state: z
    .enum(US_STATE_CODES, {
      message: "Please select a valid state",
    }),

  /**
   * ZIP code in format XXXXX or XXXXX-XXXX
   */
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format (use XXXXX or XXXXX-XXXX)")
    .trim(),

  /**
   * 6-digit NAICS code for OSHA industry classification
   * Optional but strongly recommended for compliance
   * @example "332710" for Machine Shops
   */
  naicsCode: z
    .string()
    .regex(/^\d{6}$/, "NAICS code must be exactly 6 digits")
    .optional()
    .or(z.literal("")),

  /**
   * Human-readable industry description
   * Optional supplementary information
   */
  industryDescription: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),

  /**
   * Average number of employees
   * Used for OSHA 300A calculations
   * Must be 0 or greater (0 indicates temporary closure)
   */
  averageEmployees: z
    .number({
      message: "Average employees must be a valid number",
    })
    .int({message: "Must be a whole number"})
    .min(0, {message: "Must be 0 or greater"})
    .max(999999, {message: "Value too large"}),
});

/**
 * TypeScript type inferred from schema
 * Use this for form state and component props
 */
export type EstablishmentFormData = z.infer<typeof establishmentFormSchema>;

