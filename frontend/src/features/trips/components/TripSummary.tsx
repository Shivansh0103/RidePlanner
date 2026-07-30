import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PlaceIcon from "@mui/icons-material/Place";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { Grid } from "@mui/material";
import { useMemo } from "react";

import type { TripStop } from "@/features/tripStops/types/tripStop";

import type { Trip } from "../types/trip";
import { calculateTripSummaryMetrics } from "../utils/calculateTripSummary";
import TripSummaryCard from "./TripSummaryCard";

export type TripSummaryProps = {
  trip?: Pick<Trip, "startDate" | "endDate"> | null;
  startDate?: string;
  endDate?: string;
  stops?: TripStop[];
};

export default function TripSummary({
  trip,
  startDate,
  endDate,
  stops = [],
}: TripSummaryProps) {
  const effectiveStartDate = startDate ?? trip?.startDate;
  const effectiveEndDate = endDate ?? trip?.endDate;

  const metrics = useMemo(
    () => calculateTripSummaryMetrics(effectiveStartDate, effectiveEndDate, stops),
    [effectiveStartDate, effectiveEndDate, stops]
  );

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <TripSummaryCard
          title="Total Stops"
          value={metrics.totalStops}
          icon={<PlaceIcon />}
          iconBgColor="primary.50"
          iconColor="primary.main"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <TripSummaryCard
          title="Trip Days"
          value={`${metrics.totalDays} ${metrics.totalDays === 1 ? "Day" : "Days"}`}
          icon={<CalendarMonthIcon />}
          iconBgColor="info.50"
          iconColor="info.main"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <TripSummaryCard
          title="Hotels"
          value={metrics.hotels}
          icon={<HotelIcon />}
          iconBgColor="secondary.50"
          iconColor="secondary.main"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <TripSummaryCard
          title="Fuel Stops"
          value={metrics.fuelStops}
          icon={<LocalGasStationIcon />}
          iconBgColor="warning.50"
          iconColor="warning.main"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <TripSummaryCard
          title="Food Stops"
          value={metrics.foodStops}
          icon={<RestaurantIcon />}
          iconBgColor="success.50"
          iconColor="success.main"
        />
      </Grid>
    </Grid>
  );
}
