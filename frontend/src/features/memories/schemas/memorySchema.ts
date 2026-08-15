import { z } from "zod";

export const createMemorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  content: z.string().max(2000, "Journal entry cannot exceed 2000 characters").optional().or(z.literal("")),
  imageUrl: z.string().max(500, "Image URL cannot exceed 500 characters").optional().or(z.literal("")),
  odometerReadingKm: z.number().min(0, "Odometer reading cannot be negative").nullable().optional(),
  memoryDate: z.string().optional().or(z.literal("")),
});

export const updateMemorySchema = createMemorySchema;

export type CreateMemoryRequest = z.infer<typeof createMemorySchema>;
export type UpdateMemoryRequest = z.infer<typeof updateMemorySchema>;
