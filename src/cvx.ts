/**
 *@type {ExcludeKeys} - Keys to exclude from variant configurations. Currently includes `'defaultVariants'` and `''`.
 */
type ExcludeKeys = 'defaultVariants' | '';
/**
 * @type {Undefined<T>} - Utility type to exclude `undefined` from a given type `T`.
 */
type Undefined<T> = T extends undefined ? never : T;

/**
 * @type {cvxProps<T>} - Extracts the properties of the first argument of a given function type `T`, excluding `ExcludeKeys`.
 *
 * @example
 * const classes = cvx({
 *  variants: {
 *    selector: { header: "", content: "", footer: "" }
 *  }
 * });
 *
 * type Selector = NonNullable<cvxProps<typeof classes>["selector"]>;
 * // Returns: type Selector = "header" | "content" | "footer";
 */
export type cvxProps<T extends (...keys: any) => any> = Omit<Undefined<Parameters<T>[0]>, ExcludeKeys>;

/**
 * @type {cvxKeys} - Describes a structure for variant configurations, where each key maps to a set of possible string values.
 */
export type cvxKeys = { [key: string]: { [key: string]: string } };

/**
 * @type {cvxResult<T>} - Represents a mapping of variant keys to one of their possible values.
 */
export type cvxResult<T extends cvxKeys> = { [K in keyof T]?: keyof T[K] };

/**
 * @interface `cvxRecord<T>` - Configuration object for defining variants and their options.
 * @property `string` `[assign]` - An optional base class name to prepend to the generated string.
 * @property `T` variants - Defines the variant keys and their possible values.
 * @property `cvxResult<T>` `[defaultVariants]` - Optional default variant mappings.
 */
export interface cvxRecord<T extends cvxKeys> {
  assign?: string;
  variants: T;
  defaultVariants?: cvxResult<T>;
}

/**
 * A utility function for managing values based on variant configurations.
 *
 * This function simplifies the handling of value generation with support for variants, default values, and dynamic overrides.
 *
 * @template T - The type of variant keys and their possible values.
 *
 * @param {cvxRecord<T>} keys - The configuration object containing:
 *   - `assign` (optional): A base value to always include.
 *   - `variants`: An object defining variant keys and their possible values as classes.
 *   - `defaultVariants` (optional): Default variant values for each variant key.
 *
 * @returns {(result?: cvxResult<T>) => string} - A function that takes a `result` object to override default variants
 * and generates a class name string.
 *
 * @example
 * const variantConfig = cvx({
 *   assign: 'foo', // optional
 *   variants: {
 *     variant: { primary: 'bar', secondary: 'baz' },
 *     size: { sm: 'small', lg: 'large' }
 *   },
 *   defaultVariants: { variant: 'primary', size: 'sm' } // optional
 * });
 *
 * variantConfig();
 * // Returns: "foo bar small"
 *
 * variantConfig({ variant: 'secondary', size: 'lg' });
 * // Returns: "foo baz large"
 */
export function cvx<T extends cvxKeys>(keys: cvxRecord<T>): (result?: cvxResult<T>) => string {
  return (result: cvxResult<T> = {}) => {
    const mergedVariant = { ...keys.defaultVariants, ...result } as {
      [K in keyof T]?: keyof T[K];
    };

    const variants = Object.keys(keys.variants)
      .map(key => {
        const variantKey = mergedVariant[key as keyof T] || keys.defaultVariants?.[key as keyof T];
        return variantKey ? keys.variants[key as keyof T][variantKey as keyof T[keyof T]] : undefined;
      })
      .filter(Boolean)
      .join(' ')
      .trim();

    return keys.assign ? [keys.assign, variants].join(' ').trim() : variants;
  };
}
