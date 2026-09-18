export function formatLegDistance(distanceMeters: number): string {
  const km = distanceMeters / 1000;
  if (km < 1) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

export function formatLegDuration(durationMillis: number): string {
  const totalMinutes = Math.round(durationMillis / (1000 * 60));
  if (totalMinutes < 60) {
    return `${totalMinutes} mins`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}
