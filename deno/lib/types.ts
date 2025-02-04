/**
 * A utility type that infers the return type of a given function type.
 *
 * @template T - The input type, which should ideally be a function.
 * @returns The inferred return type of the function if `T` is a function type; otherwise, `never`.
 *
 * @see {@link https://ilkhoeri.github.io/cretex/types#infertype Docs}
 */
export type inferType<T> = T extends (...args: any[]) => infer R ? R : never;
