import { APIProvider } from "@vis.gl/react-google-maps";
import type { PropsWithChildren } from "react";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function MapProvider({ children }: PropsWithChildren) {
  return (
    <APIProvider apiKey={apiKey}>
      {children}
    </APIProvider>
  );
}
