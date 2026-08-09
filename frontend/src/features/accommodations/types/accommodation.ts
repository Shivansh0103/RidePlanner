export type AccommodationType =
  | 'Hotel'
  | 'Hostel'
  | 'Homestay'
  | 'Resort'
  | 'Campsite'
  | 'Other';

export interface Accommodation {
  id: string;
  tripId: string;
  tripStopId: string;
  name: string;
  type: AccommodationType;
  checkInDate: string;
  checkOutDate: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  nights: number;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  confirmationNumber?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  bookingNotes?: string | null;
  cost: number;
  displayOrder: number;
}

export interface CreateAccommodationRequest {
  name: string;
  type: AccommodationType;
  checkInDate: string;
  checkOutDate: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  confirmationNumber?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  bookingNotes?: string | null;
  cost: number;
  displayOrder: number;
}

export interface UpdateAccommodationRequest {
  name: string;
  type: AccommodationType;
  checkInDate: string;
  checkOutDate: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  confirmationNumber?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  bookingNotes?: string | null;
  cost: number;
  displayOrder: number;
}
