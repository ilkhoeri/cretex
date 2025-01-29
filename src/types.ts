/**
 * A utility type that infers the return type of a given function type.
 *
 * @template T - The input type, which should ideally be a function.
 * @returns The inferred return type of the function if `T` is a function type; otherwise, `never`.
 *
 * @example
 * const MyFunction = () => '';
 * type Result = inferType<typeof MyFunction>; // Result will be `string`.
 *
 * @example
 * type NotAFunction = string | number;
 * type Result = inferType<NotAFunction>; // Result will be `never`.
 */
export type inferType<T> = T extends (...args: any[]) => infer R ? R : never;
