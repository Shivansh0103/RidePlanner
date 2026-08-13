export interface TripDocument {
  id: string;
  tripId: string;
  title: string;
  type: string;
  documentNumber?: string | null;
  expiryDate?: string | null;
  filePath?: string | null;
  notes?: string | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType =
  | "Passport"
  | "Driving License"
  | "Vehicle RC"
  | "Insurance"
  | "Permit"
  | "Visa"
  | "Other";
