import type { TripStop } from "@/features/tripStops/types/tripStop";

import type { Trip } from "../types/trip";
import TripSummary from "./TripSummary";

type TripSummarySectionProps = {
  trip: Trip;
  stops?: TripStop[];
};

export default function TripSummarySection({ trip, stops = [] }: TripSummarySectionProps) {
  return <TripSummary trip={trip} stops={stops} />;
}

