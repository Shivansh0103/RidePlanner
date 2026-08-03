import { useCallback, useEffect, useRef } from "react";

export function useScrollToSelection(selectedStopId?: string | null) {
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const registerRef = useCallback(
    (stopId: string) => (element: HTMLDivElement | null) => {
      elementRefs.current[stopId] = element;
    },
    [],
  );

  useEffect(() => {
    if (!selectedStopId) {
      return;
    }

    elementRefs.current[selectedStopId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [selectedStopId]);

  return {
    registerRef,
  };
}