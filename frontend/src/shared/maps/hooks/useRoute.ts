import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import type { MapStop } from "../Map";
import { computeDrivingRoute } from "../services/routeService";
import type { RouteResult } from "../types/route";

export function useRoute(stops: MapStop[]) {
  const routesLibrary = useMapsLibrary("routes");

  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const stopsKey = JSON.stringify(
    stops.map((s) => ({ id: s.id, lat: s.latitude, lng: s.longitude }))
  );

  useEffect(() => {
    async function loadRoute() {
      if (!routesLibrary || stops.length < 2) {
        setRoute(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await computeDrivingRoute({
          Route: routesLibrary.Route,
          stops,
        });

        setRoute(result);
      } catch (err) {
        console.error(err);

        setError(err as Error);
        setRoute(null);
      } finally {
        setLoading(false);
      }
    }

    loadRoute();
  }, [routesLibrary, stopsKey]);

  return {
    route,
    loading,
    error,
  };
}