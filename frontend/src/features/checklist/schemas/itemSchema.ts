import { z } from "zod";

export const createItemSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  title: z
    .string()
    .min(1, "Item title is required")
    .max(200, "Item title cannot exceed 200 characters"),
});

export const updateItemSchema = z.object({
  title: z
    .string()
    .min(1, "Item title is required")
    .max(200, "Item title cannot exceed 200 characters"),
});

export type CreateItemRequest = z.infer<typeof createItemSchema>;
export type UpdateItemRequest = z.infer<typeof updateItemSchema>;
