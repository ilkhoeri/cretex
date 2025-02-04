type objKey = { [key: string]: any };

function isPlainObject(value: unknown): value is objKey {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Recursively removes falsy values from an object, except those specified in `exclude`.
 * @template T - The object type.
 * @param obj - The object to clean.
 * @param exclude - An array of values to be preserved even if they are falsy (default: `[]`).
 * @param seen - To detect cyclic references (default: `new WeakSet<object>()`).
 * @returns A new object without the falsy values.
 * @example
 * @see {@link https://ilkhoeri.github.io/cretex/clean Docs}
 */
export function clean<T extends objKey>(obj: T, exclude: unknown[] = [], seen: WeakSet<object> = new WeakSet<object>()): T {
  const excludeSet = new Set(exclude);

  if (seen.has(obj)) return obj; // Avoid infinite loops
  seen.add(obj); // Mark object as visited

  return Reflect.ownKeys(obj).reduce<T>((acc, key) => {
    const value = (obj as any)[key];

    if (isPlainObject(value)) {
      const cleanedObject = clean(value, exclude, seen); // Clean objects recursively
      // Ensure the object is not empty before inserting
      if (Object.keys(cleanedObject).length > 0 || typeof key === 'symbol') (acc as any)[key] = cleanedObject;
    } else if (Array.isArray(value)) {
      // Clear every element in the array, remove empty objects
      const cleanedArray = value
        .map(item => (isPlainObject(item) ? clean(item, exclude, seen) : item))
        .filter(item => (item && !(isPlainObject(item) && Object.keys(item).length === 0)) || excludeSet.has(item));

      if (cleanedArray.length > 0) (acc as any)[key] = cleanedArray;
    } else if (value || excludeSet.has(value) || typeof key === 'symbol') {
      // Save the value if it is not falsy or belongs to `excludeSet`
      (acc as any)[key] = value;
    }

    return acc;
  }, {} as T);
}
