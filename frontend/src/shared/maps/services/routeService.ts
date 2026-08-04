import type { MapStop } from "../types/map";
import { TravelMode, type RouteLeg, type RouteResult } from "../types/route";

interface ComputeDrivingRouteParams {
  Route: typeof google.maps.routes.Route;
  stops: MapStop[];
}

const routeCache = new Map<string, RouteResult>();

export function getRouteCacheKey(stops: MapStop[]): string {
  return stops.map((s) => `${s.id}:${s.latitude},${s.longitude}`).join("|");
}

export function getCachedRoute(key: string): RouteResult | undefined {
  return routeCache.get(key);
}

export async function computeDrivingRoute({
  Route,
  stops,
}: ComputeDrivingRouteParams): Promise<RouteResult | null> {
  if (stops.length < 2) {
    return null;
  }

  const cacheKey = getRouteCacheKey(stops);
  const cached = routeCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const origin = {
    lat: stops[0].latitude!,
    lng: stops[0].longitude!,
  };

  const destination = {
    lat: stops[stops.length - 1].latitude!,
    lng: stops[stops.length - 1].longitude!,
  };

  const intermediates = stops.slice(1, -1).map((stop) => ({
    location: {
      lat: stop.latitude!,
      lng: stop.longitude!,
    },
  }));

  const { routes } = await Route.computeRoutes({
    origin,
    destination,
    intermediates,
    travelMode: "DRIVING",
    fields: ["path", "distanceMeters", "durationMillis", "legs"],
  });

  const route = routes?.[0];

  if (!route) {
    return null;
  }

  const legs: RouteLeg[] =
    route.legs?.map((leg, index) => ({
      startStopId: stops[index]?.id ?? "",
      endStopId: stops[index + 1]?.id ?? "",
      distanceMeters: leg.distanceMeters ?? 0,
      durationMillis: leg.durationMillis ?? 0,
    })) ?? [];

  const result: RouteResult = {
    geometry: {
      path:
        route.path?.map((point) => ({
          latitude: point.lat,
          longitude: point.lng,
        })) ?? [],
    },

    summary: {
      distanceMeters: route.distanceMeters ?? 0,
      durationMillis: route.durationMillis ?? 0,
      travelMode: TravelMode.Driving,
    },

    legs,
  };

  routeCache.set(cacheKey, result);
  return result;
}