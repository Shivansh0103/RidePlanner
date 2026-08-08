import type { TripStop } from "./tripStop";

export interface TimelineGroup {
    dayNumber: number;
    date: Date;
    stops: TripStop[];
    stopCount: number;
    totalDistanceMeters?: number;
    totalDurationMillis?: number;
}