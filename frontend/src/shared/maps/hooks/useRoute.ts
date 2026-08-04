import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { computeDrivingRoute, getCachedRoute, getRouteCacheKey } from "../services/routeService";
import type { MapStop } from "../types/map";
import type { RouteResult } from "../types/route";

export function useRoute(stops: MapStop[]) {
  const routesLibrary = useMapsLibrary("routes");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);

  const stopsKey = getRouteCacheKey(stops);

  useEffect(() => {
    let isCancelled = false;

    async function loadRoute() {
      if (!routesLibrary || stops.length < 2) {
        setRoute(null);
        setLoading(false);
        return;
      }

      const cached = getCachedRoute(stopsKey);
      if (cached) {
        setRoute(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await computeDrivingRoute({
          Route: routesLibrary.Route,
          stops,
        });

        if (isCancelled) {
          return;
        }

        setRoute(result);
      } catch (err) {
        if (isCancelled) {
          return;
        }

        console.error("Failed to calculate route:", err);
        toast.error("Unable to calculate route.");
        setRoute(null);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadRoute();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routesLibrary, stopsKey]);

  return { route, loading };
}