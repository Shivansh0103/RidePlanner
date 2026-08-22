import { z } from "zod";

export const accommodationSchema = z
  .object({
    name: z.string().min(1, "Property name is required.").max(200),
    type: z.enum(["Hotel", "Hostel", "Homestay", "Resort", "Campsite", "Other"]),
    checkInDate: z.string().min(1, "Check-in date is required."),
    checkOutDate: z.string().min(1, "Check-out date is required."),
    checkInTime: z.string().optional().nullable(),
    checkOutTime: z.string().optional().nullable(),
    formattedAddress: z.string().min(1, "Address is required.").max(500),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    placeId: z.string().optional().nullable(),
    confirmationNumber: z.string().max(100).optional().nullable(),
    contactName: z.string().max(100).optional().nullable(),
    contactPhone: z.string().max(50).optional().nullable(),
    website: z.string().max(500).optional().nullable(),
    bookingNotes: z.string().max(2000).optional().nullable(),
    cost: z.number().min(0, "Cost cannot be negative."),
    displayOrder: z.number().optional(),
  })
  .refine((data) => new Date(data.checkOutDate) >= new Date(data.checkInDate), {
    message: "Check-out date cannot be before check-in date.",
    path: ["checkOutDate"],
  });

export type AccommodationFormValues = z.infer<typeof accommodationSchema>;
