export { default as EmergencyContactsSection } from "./components/EmergencyContactsSection";

export { useEmergencyContacts } from "./hooks/useEmergencyContacts";
export { useCreateEmergencyContact } from "./hooks/useCreateEmergencyContact";
export { useUpdateEmergencyContact } from "./hooks/useUpdateEmergencyContact";
export { useDeleteEmergencyContact } from "./hooks/useDeleteEmergencyContact";

export type { EmergencyContact } from "./types/contact";
export {
  createContactSchema,
  updateContactSchema,
  type CreateContactRequest,
  type UpdateContactRequest,
} from "./schemas/contactSchema";
