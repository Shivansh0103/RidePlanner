import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Document title is required").max(100, "Title cannot exceed 100 characters"),
  type: z.string().min(1, "Document type is required"),
  documentNumber: z.string().max(100, "Document number cannot exceed 100 characters").optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
  filePath: z.string().max(500, "File path cannot exceed 500 characters").optional().or(z.literal("")),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().or(z.literal("")),
});

export const updateDocumentSchema = createDocumentSchema;

export type CreateDocumentRequest = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentRequest = z.infer<typeof updateDocumentSchema>;
