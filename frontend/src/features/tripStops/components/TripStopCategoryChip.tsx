import { Chip, type ChipProps } from "@mui/material";

import { getCategoryMetadata } from "../constants/tripStopCategoryMetadata";
import type { TripStopCategory } from "../types/tripStopCategory";

export type TripStopCategoryChipProps = {
  category?: TripStopCategory;
  size?: ChipProps["size"];
  variant?: ChipProps["variant"];
};

export default function TripStopCategoryChip({
  category,
  size = "small",
  variant = "outlined",
}: TripStopCategoryChipProps) {
  const metadata = getCategoryMetadata(category);

  return (
    <Chip
      icon={metadata.icon}
      label={metadata.label}
      color={metadata.color}
      size={size}
      variant={variant}
    />
  );
}
