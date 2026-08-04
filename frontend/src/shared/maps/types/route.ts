import type { Coordinates } from "./place";

export const TravelMode = {
  Driving: "DRIVING",
  Walking: "WALKING",
  Bicycling: "BICYCLING",
  Transit: "TRANSIT",
} as const;

export type TravelMode = (typeof TravelMode)[keyof typeof TravelMode];

export interface RouteGeometry {
  path: Coordinates[];
}

export interface RouteSummary {
  distanceMeters: number;
  durationMillis: number;
  travelMode: TravelMode;
}

export interface RouteLeg {
  startStopId: string;
  endStopId: string;

  distanceMeters: number;
  durationMillis: number;
}

export interface RouteResult {
  geometry: RouteGeometry;
  summary: RouteSummary;
  legs: RouteLeg[];
}