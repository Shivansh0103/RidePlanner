/**
 * Formats a distance in meters to a human-readable string.
 * Examples:
 *   842400 -> "842.4 km"
 *   500 -> "500 m"
 */
export function formatDistance(distanceMeters: number): string {
  if (!distanceMeters || distanceMeters < 0) {
    return "0 m";
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  const km = distanceMeters / 1000;
  return `${km.toFixed(1)} km`;
}

/**
 * Formats a duration in milliseconds to a human-readable string.
 * Examples:
 *   48300000 -> "13 hr 25 min"
 *   2700000 -> "45 min"
 *   3600000 -> "1 hr"
 */
export function formatDuration(durationMillis: number): string {
  if (!durationMillis || durationMillis <= 0) {
    return "0 min";
  }

  const totalMinutes = Math.round(durationMillis / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}
