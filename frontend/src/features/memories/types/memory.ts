export interface TripMemory {
  id: string;
  tripId: string;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  odometerReadingKm?: number | null;
  memoryDate: string;
  createdAt: string;
  updatedAt: string;
}
