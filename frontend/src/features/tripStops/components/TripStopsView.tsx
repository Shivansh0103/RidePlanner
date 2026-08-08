import { Box, Fade } from "@mui/material";
import { useState } from "react";

import type { TripStop } from "@/features/tripStops/types/tripStop";
import type { RouteLeg } from "@/shared/maps/types/route";

import type { TripStopsViewMode } from "../types/tripStopsViewMode";
import TripStopsListView from "./TripStopsListView";
import { TripStopsTimelineView } from "./TripStopsTimelineView";
import ViewToggle from "./ViewToggle";

type TripStopsViewProps = {
  stops: TripStop[];
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
  onReorder?: (orderedStopIds: string[]) => void;
  headerAction?: React.ReactNode;
  routeLegs?: RouteLeg[];

  selectedStopId?: string | null;
  onStopSelect?: (stopId: string) => void;
};

export default function TripStopsView({ headerAction, routeLegs, ...props }: TripStopsViewProps) {
  const [viewMode, setViewMode] = useState<TripStopsViewMode>("list");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <ViewToggle value={viewMode} onChange={setViewMode} />
        {headerAction}
      </Box>

      <Fade in key={viewMode} timeout={300}>
        <Box>
          {viewMode === "timeline" ? (
            <TripStopsTimelineView
              stops={props.stops}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
              routeLegs={routeLegs}
              selectedStopId={props.selectedStopId}
              onStopSelect={props.onStopSelect}
            />
          ) : (
            <TripStopsListView
              stops={props.stops}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
              onReorder={props.onReorder}
              routeLegs={routeLegs}
              selectedStopId={props.selectedStopId}
              onStopSelect={props.onStopSelect}
            />
          )}
        </Box>
      </Fade>
    </>
  );
}
