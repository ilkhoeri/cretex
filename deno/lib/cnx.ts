type cnxMap = Record<string, any>;

export type cnxValues = cnxMap | cnxMap[] | cnxValues[] | string | number | null | boolean | undefined | (() => cnxValues);

/**
 * A utility function for creating concatenating strings based on various input types.
 *
 * This function accepts multiple arguments of different types and processes them to return a single string.
 * It supports strings, numbers, arrays, objects, functions, and even nested values.
 *
 * @param {...cnxValues[]} inputs The inputs to process. Each input can be:
 *   - A `string` or `number`: Included directly in the result.
 *   - An `object`: Keys with truthy values are included in the result.
 *   - An `array`: Processed recursively.
 *   - A `function`: Invoked to obtain a value, which is then processed recursively.
 *   - Other falsy values (e.g., `null`, `undefined`, `false`): Ignored.
 *
 * @returns {string} A concatenated string of values derived from the inputs.
 *
 * @example
 * // Simple usage with strings and numbers
 * cnx('foo', 'bar', 42);
 * // Returns: "foo bar 42"
 *
 * @example
 * // Using objects with truthy and falsy values
 * cnx({ active: true, disabled: false });
 * // Returns: "active"
 *
 * @example
 * // Using functions as inputs
 * cnx(() => 'dynamic-class');
 * // Returns: "dynamic-class"
 *
 * @example
 * // Complex combination
 * cnx('header', { sticky: true }, [null, 'shadow'], () => ['dynamic', { visible: true }]);
 * // Returns: "header sticky shadow dynamic visible"
 */
export function cnx(...inputs: cnxValues[]): string {
  const merged = inputs.reduce<string[]>((acc, input) => {
    if (!input) return acc;

    if (typeof input === 'string' || typeof input === 'number') return [...acc, String(input)];

    if (Array.isArray(input)) return [...acc, cnx(...input)];

    if (typeof input === 'object')
      return [
        ...acc,
        ...Object.entries(input)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
      ];

    if (typeof input === 'function') return [...acc, cnx(input())];
    return acc;
  }, []);

  return merged.join(' ').trim();
}
