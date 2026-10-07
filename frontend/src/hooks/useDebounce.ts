import { useEffect, useState } from "react";

/**
 * Hook to debounce any fast-changing value.
 * Used for Level 2 UI Keystroke Debounce (300ms delay) per RFC Option B.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
