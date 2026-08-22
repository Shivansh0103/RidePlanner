export { default as DocumentsSection } from "./components/DocumentsSection";

export { useTripDocuments } from "./hooks/useTripDocuments";
export { useCreateTripDocument } from "./hooks/useCreateTripDocument";
export { useUpdateTripDocument } from "./hooks/useUpdateTripDocument";
export { useDeleteTripDocument } from "./hooks/useDeleteTripDocument";

export type { TripDocument } from "./types/document";
export {
  createDocumentSchema,
  updateDocumentSchema,
  type CreateDocumentRequest,
  type UpdateDocumentRequest,
} from "./schemas/documentSchema";
