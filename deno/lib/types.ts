export type inferType<T> = T extends (...args: any[]) => infer R ? R : never;
