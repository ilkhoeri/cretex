type ocxKey = Record<string, any>;

export type ocxAcc<T> = T & ocxKey;

export type ocxMap = ocxKey | ocxKey[] | ocxMap[] | string | number | null | boolean | undefined | (() => ocxMap);

export type ocxObj<T> = T | ocxMap | ocxAcc<T>;

export function ocx<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T> {
  return obj.reduce<ocxAcc<T>>((acc, input) => {
    if (!input) return acc;

    if (typeof input === 'function') return { ...acc, ...ocx(input()) };

    if (Array.isArray(input)) return { ...acc, ...ocx(...input) };

    if (typeof input === 'object') return { ...acc, ...input };

    return acc;
  }, {} as ocxAcc<T>);
}
