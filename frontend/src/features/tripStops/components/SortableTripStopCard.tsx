import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";

import type { TripStop } from "../types/tripStop";
import TripStopCard from "./TripStopCard";

type SortableTripStopCardProps = {
  stop: TripStop;
  index: number;
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;

  selected?: boolean;
  onStopSelect?: (stopId: string) => void;

  registerRef?: (stopId: string) => (element: HTMLDivElement | null) => void;
};

export default function SortableTripStopCard({
  stop,
  index,
  onEdit,
  onDelete,
  selected = false,
  onStopSelect,
  registerRef,
}: SortableTripStopCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const dragHandleProps = {
    ...attributes,
    ...listeners,
  };

  return (
    <Box
      ref={(node: HTMLDivElement | null) => {
        setNodeRef(node);

        registerRef?.(stop.id)(node);
      }}
      style={style}
    >
      <TripStopCard
        stop={stop}
        index={index}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
        selected={selected}
        onStopSelect={onStopSelect}
      />
    </Box>
  );
}
