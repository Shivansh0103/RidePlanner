import AttractionsIcon from "@mui/icons-material/Attractions";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CoffeeIcon from "@mui/icons-material/Coffee";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PlaceIcon from "@mui/icons-material/Place";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import type { ChipProps } from "@mui/material";
import type { ReactElement } from "react";

import { TripStopCategory } from "../types/tripStopCategory";

export type TripStopCategoryMetadata = {
  value: TripStopCategory;
  label: string;
  color: NonNullable<ChipProps["color"]>;
  icon: ReactElement;
};

export const TRIP_STOP_CATEGORY_METADATA: Record<TripStopCategory, TripStopCategoryMetadata> = {
  [TripStopCategory.Destination]: {
    value: TripStopCategory.Destination,
    label: "Destination",
    color: "primary",
    icon: <PlaceIcon fontSize="small" />,
  },
  [TripStopCategory.Hotel]: {
    value: TripStopCategory.Hotel,
    label: "Hotel",
    color: "secondary",
    icon: <HotelIcon fontSize="small" />,
  },
  [TripStopCategory.Fuel]: {
    value: TripStopCategory.Fuel,
    label: "Fuel",
    color: "warning",
    icon: <LocalGasStationIcon fontSize="small" />,
  },
  [TripStopCategory.Food]: {
    value: TripStopCategory.Food,
    label: "Food",
    color: "success",
    icon: <RestaurantIcon fontSize="small" />,
  },
  [TripStopCategory.Break]: {
    value: TripStopCategory.Break,
    label: "Break",
    color: "info",
    icon: <CoffeeIcon fontSize="small" />,
  },
  [TripStopCategory.Attraction]: {
    value: TripStopCategory.Attraction,
    label: "Attraction",
    color: "default",
    icon: <AttractionsIcon fontSize="small" />,
  },
  [TripStopCategory.Checkpoint]: {
    value: TripStopCategory.Checkpoint,
    label: "Checkpoint",
    color: "error",
    icon: <CheckCircleOutlinedIcon fontSize="small" />,
  },
};

export function getCategoryMetadata(category?: TripStopCategory): TripStopCategoryMetadata {
  const defaultCategory = TripStopCategory.Destination;
  if (category === undefined || !(category in TRIP_STOP_CATEGORY_METADATA)) {
    return TRIP_STOP_CATEGORY_METADATA[defaultCategory];
  }
  return TRIP_STOP_CATEGORY_METADATA[category];
}
