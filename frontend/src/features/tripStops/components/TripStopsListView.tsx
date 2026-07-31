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
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";

import type { TripStop } from "../types/tripStop";
import SortableTripStopCard from "./SortableTripStopCard";

type TripStopListProps = {
  stops: TripStop[];
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
  onReorder?: (orderedStopIds: string[]) => void;
};

export default function TripStopsListView({
  stops: initialStops,
  onEdit,
  onDelete,
  onReorder,
}: TripStopListProps) {
  const [items, setItems] = useState<TripStop[]>(initialStops);

  useEffect(() => {
    setItems(initialStops);
  }, [initialStops]);

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

      if (onReorder) {
        onReorder(reorderedItems.map((stop) => stop.id));
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((stop) => stop.id)} strategy={verticalListSortingStrategy}>
        <Stack spacing={2.5}>
          {items.map((stop, index) => (
            <SortableTripStopCard
              key={stop.id}
              stop={stop}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
}
