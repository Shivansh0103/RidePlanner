import type { TripStop } from "@/features/tripStops/types/tripStop";
import { useState } from "react";
import ViewToggle from "./ViewToggle";
import type { TripStopsViewMode } from "../types/tripStopsViewMode";
import TripStopsListView from "./TripStopsListView";
import { TripStopsTimelineView } from "./TripStopsTimelineView";
import { Box } from "@mui/material";

type TripStopsViewProps = {
  stops: TripStop[];
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
  onReorder?: (orderedStopIds: string[]) => void;
};

export default function TripStopsView(props: TripStopsViewProps) {
  const [viewMode, setViewMode] = useState<TripStopsViewMode>("list");

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </Box>

      {viewMode === "timeline" ? (
        <TripStopsTimelineView
          stops={props.stops}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
      ) : (
        <TripStopsListView {...props} />
      )}
    </>
  );
}
