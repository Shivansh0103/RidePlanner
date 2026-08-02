import { Map as GoogleMap } from "@vis.gl/react-google-maps";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../constants";

export interface MapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  style?: React.CSSProperties;
}

export function Map({ center = DEFAULT_MAP_CENTER, zoom = DEFAULT_MAP_ZOOM, style }: MapProps) {
  return (
    <GoogleMap
      defaultCenter={center}
      defaultZoom={zoom}
      gestureHandling="greedy"
      disableDefaultUI={false}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
}
