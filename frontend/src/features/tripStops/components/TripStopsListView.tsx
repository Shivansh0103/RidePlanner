import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import type { RouteLeg } from "@/shared/maps/types/route";

import { useScrollToSelection } from "../hooks/useScrollToSelection";
import type { TripStop } from "../types/tripStop";
import RouteLegConnector from "./RouteLegConnector";
import SortableTripStopCard from "./SortableTripStopCard";

type TripStopListProps = {
  stops: TripStop[];
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
  onReorder?: (orderedStopIds: string[]) => void;
  routeLegs?: RouteLeg[];

  selectedStopId?: string | null;
  onStopSelect?: (stopId: string) => void;
};

export default function TripStopsListView({
  stops: initialStops,
  onEdit,
  onDelete,
  onReorder,
  routeLegs = [],
  selectedStopId,
  onStopSelect,
}: TripStopListProps) {
  const [items, setItems] = useState<TripStop[]>(initialStops);
  const { registerRef } = useScrollToSelection(selectedStopId);

  useEffect(() => {
    setItems(initialStops);
  }, [initialStops]);

  const legMapByEndStop = new Map<string, RouteLeg>();
  for (const leg of routeLegs) {
    if (leg.endStopId) {
      legMapByEndStop.set(leg.endStopId, leg);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      setItems(reorderedItems);

      onReorder?.(reorderedItems.map((stop) => stop.id));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((stop) => stop.id)} strategy={verticalListSortingStrategy}>
        <Stack
          role="region"
          aria-label="Reorderable trip stops list"
          spacing={0}
        >
          {items.map((stop, index) => {
            const leg = legMapByEndStop.get(stop.id);

            return (
              <Box key={stop.id}>
                {index > 0 && (
                  <RouteLegConnector
                    distanceMeters={leg?.distanceMeters}
                    durationMillis={leg?.durationMillis}
                    compact
                  />
                )}
                <SortableTripStopCard
                  stop={stop}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  selected={selectedStopId === stop.id}
                  onStopSelect={onStopSelect}
                  registerRef={registerRef}
                />
              </Box>
            );
          })}
        </Stack>
      </SortableContext>
    </DndContext>
  );
}
