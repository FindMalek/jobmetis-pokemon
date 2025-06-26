import { useEffect, useState } from "react"

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup timeout if value changes before delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for debouncing search queries specifically
 * @param searchTerm - The search term to debounce
 * @param delay - The delay in milliseconds (default 300ms)
 * @returns The debounced search term
 */
export function useDebouncedSearch(
  searchTerm: string,
  delay: number = 300
): string {
  return useDebouncedValue(searchTerm, delay)
}
