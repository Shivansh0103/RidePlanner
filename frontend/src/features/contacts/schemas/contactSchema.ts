import { z } from "zod";

const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,20}$/;

export const createContactSchema = z.object({
  name: z.string().min(1, "Contact name is required").max(100, "Name cannot exceed 100 characters"),
  relationship: z.string().min(1, "Relationship is required").max(50, "Relationship cannot exceed 50 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(PHONE_REGEX, "Please enter a valid phone number with digits only (e.g. +91 9876543210 or 9876543210)")
    .max(30, "Phone cannot exceed 30 characters"),
  alternatePhone: z
    .string()
    .regex(PHONE_REGEX, "Please enter a valid alternate phone number with digits only")
    .max(30, "Alternate phone cannot exceed 30 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email format").max(100, "Email cannot exceed 100 characters").optional().or(z.literal("")),
  isPrimary: z.boolean(),
});

export const updateContactSchema = createContactSchema;

export type CreateContactRequest = z.infer<typeof createContactSchema>;
export type UpdateContactRequest = z.infer<typeof updateContactSchema>;
