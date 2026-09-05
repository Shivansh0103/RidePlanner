const CURRENCY_LOCALES: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

/**
 * Formats a distance in meters to a human-readable string.
 * Supports optional distance presentation unit ('Kilometers' | 'Miles').
 * Canonical storage remains in meters/kilometres.
 * Examples:
 *   842400 -> "842.4 km" (or "523.4 mi" in Miles)
 *   500 -> "500 m"
 */
export function formatDistance(
  distanceMeters: number,
  unit: "Kilometers" | "Miles" = "Kilometers"
): string {
  if (!distanceMeters || distanceMeters < 0) {
    return unit === "Miles" ? "0 mi" : "0 m";
  }

  if (unit === "Miles") {
    const miles = (distanceMeters / 1000) * 0.621371;
    return `${miles.toFixed(1)} mi`;
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

/**
 * Formats an amount with an explicit currency code.
 * Defaults to INR for historical consistency with existing trip and budget data (ADR-0019).
 * Examples:
 *   14000 -> "₹14,000"
 *   250, "USD" -> "$250"
 *   4200.5 -> "₹4,200.50"
 */
export function formatCurrency(amount: number, currencyCode: string = "INR"): string {
  const normalizedCurrency = currencyCode?.trim().toUpperCase() || "INR";
  const locale = CURRENCY_LOCALES[normalizedCurrency] || "en-IN";

  if (amount === undefined || amount === null || isNaN(amount)) {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: normalizedCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(0);
    } catch {
      return "₹0";
    }
  }

  const hasDecimals = amount % 1 !== 0;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}
