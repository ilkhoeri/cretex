type ocxKey = { [key: string]: any };

/**
 * Represents an accumulated result object combining properties.
 *
 * @template T - A generic type extending ocxKey.
 */
export type ocxAcc<T> = T & ocxKey;

/**
 * Represents possible input types for the `ocx` function.
 * Includes objects, arrays, nested arrays, primitive types, or functions returning these types.
 */
export type ocxMap = ocxKey | ocxKey[] | ocxMap[] | string | number | null | boolean | undefined | ((key?: ocxKey) => ocxMap);

/**
 * Represents the generic object types that can be passed to the `ocx` function.
 * Includes types extending `ocxKey`, as well as nested input types.
 */
export type ocxObj<T> = T | ocxMap | ocxAcc<T>;

/**
 * Determines whether a value is a plain object.
 *
 * @param value - The value to check.
 * @returns True if the value is a plain object, otherwise false.
 */
function isPlainObject(value: unknown): value is ocxKey {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Recursively removes properties with falsy values (except `0`) from an object.
 *
 * @template T - A generic type extending ocxKey.
 * @param obj - The object to clean.
 * @returns A new object without falsy properties.
 */
export function cleanFalsy<T extends ocxKey>(obj: T): T {
  return Object.entries(obj).reduce<T>((acc, [key, value]) => {
    if (value || value === 0) {
      (acc as ocxKey)[key] = isPlainObject(value) ? cleanFalsy(value) : value;
    }
    return acc;
  }, {} as T);
}

/**
 * The base implementation of the `ocx` function.
 * Combines various input types into a single object with deep merging capabilities.
 *
 * @template T - A generic type extending ocxKey.
 * @param obj - A list of objects, arrays, functions, or values to combine.
 * @returns The accumulated object after merging all inputs.
 */
function baseOcx<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T> {
  const seen = new WeakSet<object>(); // To track objects that have been visited

  return obj.reduce<ocxAcc<T>>((acc, input) => {
    if (!input || (typeof input === 'object' && seen.has(input))) return acc;
    if (typeof input === 'object' && input !== null) {
      seen.add(input);
    }

    if (Array.isArray(input)) return { ...acc, ...baseOcx(...input) };

    if (typeof input === 'function') {
      const result = input(acc);
      if (isPlainObject(result)) {
        for (const [key, value] of Object.entries(result)) {
          if (isPlainObject(value) && isPlainObject(acc[key])) {
            (acc as ocxKey)[key] = baseOcx(acc[key], value); // Deep merge if property already exists
          } else {
            (acc as ocxKey)[key] = value;
          }
        }
        return acc;
      }
      return { ...acc, ...baseOcx(result) };
    }

    if (isPlainObject(input)) {
      Reflect.ownKeys(input).forEach(key => {
        const value = (input as any)[key];
        if (isPlainObject(value) && isPlainObject(acc[key as keyof T])) {
          acc[key as keyof T] = baseOcx(acc[key as keyof T], value);
        } else {
          acc[key as keyof T] = value;
        }
      });
      return acc;
    }

    return acc;
  }, {} as ocxAcc<T>);
}

/**
 * A utility function to combine objects with deep merging and remove falsy values.
 *
 * @template T - A generic type extending ocxKey.
 * @param obj - A list of objects, arrays, functions, or values to combine.
 * @returns A cleaned object with all falsy values removed.
 */
function clean<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T> {
  return cleanFalsy(baseOcx(...obj));
}

/**
 * Interface representing the `ocx` function with `clean` as a nested utility.
 */
interface ocxFn {
  <T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T>;
  clean: typeof clean;
}

/**
 * Recursively merge objects with support for arrays, dynamic functions, and falsy properties into a single object.
 *
 * Provides a `.clean()` method to remove falsy values from the result.
 *
 * @example
 * const result = ocx(
 *   { a: 1, b: { b1: 'b1' } },
 *   { b: { b2: 'b2' }, c: null },
 *   key => key?.b && { d: 'dynamic' }
 * );
 * console.log(result);
 * // Output: { a: 1, b: { b1: 'b1', b2: 'b2' }, d: 'dynamic' }
 *
 * @example
 * const cleaned = ocx.clean({ a: 1, b: { b1: 'b1' }, c: null, d: undefined });
 * console.log(cleaned);
 * // Output: { a: 1, b: { b1: 'b1' } }
 */
export const ocx = baseOcx as ocxFn;

ocx.clean = clean;
