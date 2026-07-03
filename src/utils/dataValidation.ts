/**
 * Shared data validation utilities
 * Consolidates common validation patterns
 */

/**
 * Checks if value is not null and not undefined
 * @param value - Value to check
 * @returns True if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Validates that required fields exist in an object
 * @param obj - Object to validate
 * @param requiredFields - Array of field names that must exist
 * @returns True if all required fields are present and not null/undefined
 */
export function hasRequiredFields(
  obj: Record<string, unknown>,
  requiredFields: string[],
): boolean {
  return requiredFields.every((field) => isDefined(obj[field]))
}

/**
 * Validates numeric value is within expected range
 * @param value - Value to check
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns True if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validates percentage value (0-100)
 * @param value - Value to check
 * @returns True if value is valid percentage
 */
export function isValidPercentage(value: unknown): value is number {
  return typeof value === 'number' && isInRange(value, 0, 100)
}

/**
 * Filters array removing null/undefined values with type narrowing
 * @param array - Array that may contain null/undefined
 * @returns Array with only defined values
 */
export function filterDefined<T>(array: (T | null | undefined)[]): T[] {
  return array.filter(isDefined)
}
