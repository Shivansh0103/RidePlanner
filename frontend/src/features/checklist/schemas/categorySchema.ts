import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),
});

export type CreateCategoryRequest = z.infer<typeof categorySchema>;
export type UpdateCategoryRequest = z.infer<typeof categorySchema>;
