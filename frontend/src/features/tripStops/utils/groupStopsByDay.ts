import type { RouteLeg } from "@/shared/maps/types/route";
import type { TimelineGroup } from "../types/timelineGroup";
import type { TripStop } from "../types/tripStop";

export function groupStopsByDay(
  stops: TripStop[],
  routeLegs?: RouteLeg[]
): TimelineGroup[] {
  if (stops.length === 0) {
    return [];
  }

  const groupsMap = new Map<string, { date: Date; stops: TripStop[] }>();

  const sortedStops = [...stops].sort(
    (a, b) =>
      new Date(a.arrivalDate).getTime() -
      new Date(b.arrivalDate).getTime(),
  );

  for (const stop of sortedStops) {
    const date = new Date(stop.arrivalDate);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.toISOString().split("T")[0];

    if (!groupsMap.has(dateKey)) {
      groupsMap.set(dateKey, { date, stops: [] });
    }

    groupsMap.get(dateKey)!.stops.push(stop);
  }

  const legMapByEndStop = new Map<string, RouteLeg>();
  if (routeLegs) {
    for (const leg of routeLegs) {
      if (leg.endStopId) {
        legMapByEndStop.set(leg.endStopId, leg);
      }
    }
  }

  return Array.from(groupsMap.values()).map(
    ({ date, stops: dayStops }, index) => {
      let dayDistance = 0;
      let dayDuration = 0;
      let hasMetrics = false;

      for (const stop of dayStops) {
        const leg = legMapByEndStop.get(stop.id);
        if (leg) {
          dayDistance += leg.distanceMeters ?? 0;
          dayDuration += leg.durationMillis ?? 0;
          hasMetrics = true;
        }
      }

      return {
        dayNumber: index + 1,
        date,
        stops: dayStops,
        stopCount: dayStops.length,
        totalDistanceMeters: hasMetrics ? dayDistance : undefined,
        totalDurationMillis: hasMetrics ? dayDuration : undefined,
      };
    }
  );
}