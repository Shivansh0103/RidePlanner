export { default as AccommodationsSection } from "./components/AccommodationsSection";
export { default as AccommodationCard } from "./components/AccommodationCard";
export { default as AccommodationDialog } from "./components/AccommodationDialog";
export { default as AccommodationForm } from "./components/AccommodationForm";

export { useAccommodations } from "./hooks/useAccommodations";
export { useCreateAccommodation } from "./hooks/useCreateAccommodation";
export { useUpdateAccommodation } from "./hooks/useUpdateAccommodation";
export { useDeleteAccommodation } from "./hooks/useDeleteAccommodation";

export type { Accommodation } from "./types/accommodation";
export { accommodationSchema, type AccommodationFormValues } from "./schemas/accommodationSchema";
