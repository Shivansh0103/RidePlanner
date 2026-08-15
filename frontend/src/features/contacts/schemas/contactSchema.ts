import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().min(1, "Contact name is required").max(100, "Name cannot exceed 100 characters"),
  relationship: z.string().min(1, "Relationship is required").max(50, "Relationship cannot exceed 50 characters"),
  phone: z.string().min(1, "Phone number is required").max(30, "Phone cannot exceed 30 characters"),
  alternatePhone: z.string().max(30, "Alternate phone cannot exceed 30 characters").optional().or(z.literal("")),
  email: z.string().email("Invalid email format").max(100, "Email cannot exceed 100 characters").optional().or(z.literal("")),
  isPrimary: z.boolean(),
});

export const updateContactSchema = createContactSchema;

export type CreateContactRequest = z.infer<typeof createContactSchema>;
export type UpdateContactRequest = z.infer<typeof updateContactSchema>;
