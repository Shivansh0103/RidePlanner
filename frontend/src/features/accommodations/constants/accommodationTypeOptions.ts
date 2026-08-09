import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import HotelIcon from "@mui/icons-material/Hotel";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import type { ElementType } from "react";

import type { AccommodationType } from "../types/accommodation";

export interface AccommodationTypeOption {
  value: AccommodationType;
  label: string;
  icon: ElementType;
}

export const ACCOMMODATION_TYPE_OPTIONS: AccommodationTypeOption[] = [
  { value: "Hotel", label: "Hotel", icon: HotelIcon },
  { value: "Hostel", label: "Hostel / Backpacker", icon: SingleBedIcon },
  { value: "Homestay", label: "Homestay / B&B", icon: HomeWorkIcon },
  { value: "Resort", label: "Resort", icon: ApartmentIcon },
  { value: "Campsite", label: "Campsite / Tent", icon: NightShelterIcon },
  { value: "Other", label: "Other", icon: OtherHousesIcon },
];
