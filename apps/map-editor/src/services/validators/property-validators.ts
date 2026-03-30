/**
 * Validators for Property Management
 */

import { z } from "zod";

/**
 * Property data schema
 */
export const PropertyDataSchema = z.object({
	price: z.number().nonnegative("Price must be non-negative"),
	rent: z.number().nonnegative("Rent must be non-negative"),
});

/**
 * Add property schema
 */
export const AddPropertySchema = z.object({
	mapItemId: z.string().min(1, "Map item ID is required"),
	property: PropertyDataSchema,
});

/**
 * Update property schema
 */
export const UpdatePropertySchema = z.object({
	mapItemId: z.string().min(1, "Map item ID is required"),
	property: PropertyDataSchema,
});

/**
 * Remove property schema
 */
export const RemovePropertySchema = z.object({
	mapItemId: z.string().min(1, "Map item ID is required"),
});

/**
 * Type exports
 */
export type PropertyData = z.infer<typeof PropertyDataSchema>;
export type AddPropertyInput = z.infer<typeof AddPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>;
export type RemovePropertyInput = z.infer<typeof RemovePropertySchema>;
