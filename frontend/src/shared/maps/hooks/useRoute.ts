import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import { computeDrivingRoute } from "../services/routeService";
import type { MapStop } from "../types/map";
import type { RouteResult } from "../types/route";

export function useRoute(stops: MapStop[]) {
  const routesLibrary = useMapsLibrary("routes");
  const [route, setRoute] = useState<RouteResult | null>(null);

  const stopsKey = stops
    .map((s) => `${s.id}:${s.latitude},${s.longitude}`)
    .join("|");

  useEffect(() => {
    async function loadRoute() {
      if (!routesLibrary || stops.length < 2) {
        setRoute(null);
        return;
      }

      try {
        const result = await computeDrivingRoute({
          Route: routesLibrary.Route,
          stops,
        });

        setRoute(result);
      } catch (err) {
        console.error("Failed to load route", err);
        setRoute(null);
      }
    }

    loadRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routesLibrary, stopsKey]);

  return { route };
}