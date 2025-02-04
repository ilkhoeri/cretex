import { clean } from './clean.ts';

/** A type alias representing an object with string keys and values of any type. */
export type ocxKey = { [key: string]: any };

/** A generic type that extends `T` with `ocxKey`, allowing `T` to have arbitrary key-value pairs. */
export type ocxAcc<T> = T & ocxKey;
/**
 * A flexible mapping type that can be an:
 * - plain object (`ocxKey`)
 * - array of objects (`ocxKey[]`)
 * - recursive mapping (`ocxMap[]`)
 * - primitive value (`string`, `number`, `null`, `boolean`, `undefined`)
 * - function that takes an optional object (`ocxKey`) and returns an `ocxMap`. */
export type ocxMap = ocxKey | ocxKey[] | ocxMap[] | string | number | null | boolean | undefined | ((key?: ocxKey) => ocxMap);

/** An object that can be processed by `ocx`. */
export type ocxObj<T> = T | ocxMap | ocxAcc<T>;

function isPlainObject(value: unknown): value is ocxKey {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Merges multiple objects deeply, handling arrays and functions gracefully.
 * @template T - The base object type.
 * @param obj - One or more objects to merge.
 * @returns The deeply merged object.
 */
function baseOcx<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T> {
  const seen = new WeakMap<object, object>(); // Use WeakMap to store processed objects

  function merge<T extends ocxKey>(acc: ocxAcc<T>, input: ocxObj<T>): ocxAcc<T> {
    if (!input) return acc;

    if (isPlainObject(input)) {
      if (seen.has(input)) return seen.get(input) as ocxAcc<T>; // If there is one, use previous result.
      const newAcc = { ...acc }; // Copy acc so as not to change direct references
      seen.set(input, newAcc); // Mark objects as processed
      acc = newAcc; // Use copied version
    }

    if (Array.isArray(input)) return { ...acc, ...baseOcx(...input) };

    if (typeof input === 'function') {
      const result = input(acc);
      return isPlainObject(result) ? merge(acc, result) : { ...acc, ...baseOcx(result) };
    }

    if (isPlainObject(input)) {
      Reflect.ownKeys(input).forEach(key => {
        const value = (input as any)[key];
        if (isPlainObject(value) && isPlainObject(acc[key as keyof T])) {
          acc[key as keyof T] = merge(acc[key as keyof T], value);
        } else {
          acc[key as keyof T] = value;
        }
      });
      return acc;
    }

    return acc;
  }

  return obj.reduce<ocxAcc<T>>((acc, input) => merge(acc, input), {} as ocxAcc<T>);
}

/**
 * Merges multiple objects deeply, handling arrays and functions gracefully **without overwriting**.
 * @template T - The base object type.
 * @param obj - One or more objects to merge.
 * @returns The deeply merged object **without overwriting** the value at the first key, only change the value if it does not exist.
 */
function preserveRoot<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T> {
  const seen = new WeakMap<object, object>();

  function merge<T extends ocxKey>(acc: ocxAcc<T>, input: ocxObj<T>): ocxAcc<T> {
    if (!input) return acc;

    if (isPlainObject(input)) {
      if (seen.has(input)) return seen.get(input) as ocxAcc<T>;
      const newAcc = { ...acc };
      seen.set(input, newAcc);
      acc = newAcc;
    }

    if (Array.isArray(input)) return { ...acc, ...preserveRoot(...input) };

    if (typeof input === 'function') {
      const result = input(acc);
      return isPlainObject(result) ? merge(acc, result) : { ...acc, ...preserveRoot(result) };
    }

    if (isPlainObject(input)) {
      Reflect.ownKeys(input).forEach(key => {
        const value = (input as any)[key];
        if (acc[key as keyof T] === undefined) {
          acc[key as keyof T] = value; // Only change the value if it does not exist
        } else if (isPlainObject(value) && isPlainObject(acc[key as keyof T])) {
          acc[key as keyof T] = merge(acc[key as keyof T], value);
        }
      });
      return acc;
    }

    return acc;
  }

  return obj.reduce<ocxAcc<T>>((acc, input) => merge(acc, input), {} as ocxAcc<T>);
}

interface ocxFn {
  /**
   * Merges multiple objects and removes falsy values by default.
   * @template T - The base object type.
   * @param obj - One or more objects to merge.
   * @returns The deeply merged object with falsy values removed.
   */
  <T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T>;
  /** A version of `ocx` that performs deep merging **without** removing falsy values. */
  raw: typeof baseOcx;
  /** A version of `ocx` that performs a deep join **without overwriting** the value at the first key, only change the value if it does not exist. */
  preserve: typeof preserveRoot;
}

/**
 * Recursively merge objects with support for arrays, dynamic functions, and non falsy properties into a single object.
 *
 * Provides a chaining:
 * - {@link baseOcx raw} method to **get falsy values** from the result.
 * - {@link preserveRoot preserve} method to join **without overwriting** first value.
 * @example
 * @see {@link https://ilkhoeri.github.io/cretex/?id=ocx Docs}
 */
export const ocx: ocxFn = (...obj) => clean(baseOcx(...obj), [0]);

ocx.raw = baseOcx as typeof baseOcx;
ocx.preserve = preserveRoot as typeof preserveRoot;
