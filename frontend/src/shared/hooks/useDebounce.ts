import { useEffect, useState } from "react";

/**
 * Custom hook that delays updating the returned value until after a specified delay.
 * Useful for throttling expensive operations like search queries, autocomplete, or API requests.
 *
 * @param value The value to debounce.
 * @param delayMs The debounce delay in milliseconds (default: 300ms).
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
