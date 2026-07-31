import type { TripStop } from "../types/tripStop";
import type { TimelineGroup } from "../types/timelineGroup";

export function groupStopsByDay(stops: TripStop[]): TimelineGroup[] {
  if (stops.length === 0) {
    return [];
  }

  const groups = new Map<string, { date: Date; stops: TripStop[] }>();

  const sortedStops = [...stops].sort(
    (a, b) =>
      new Date(a.arrivalDate).getTime() -
      new Date(b.arrivalDate).getTime(),
  );

  for (const stop of sortedStops) {
    const date = new Date(stop.arrivalDate);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.toISOString().split("T")[0];

    if (!groups.has(dateKey)) {
      groups.set(dateKey, { date, stops: [] });
    }

    groups.get(dateKey)!.stops.push(stop);
  }

  return Array.from(groups.values()).map(
    ({ date, stops: dayStops }, index) => ({
      dayNumber: index + 1,
      date,
      stops: dayStops,
      stopCount: dayStops.length,
    }),
  );
}