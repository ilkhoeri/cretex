type ocxKey = Record<string, any>;
export type ocxAcc<T> = T & ocxKey;
export type ocxMap = ocxKey | ocxKey[] | ocxMap[] | string | number | null | boolean | undefined | (() => ocxMap);
export type ocxObj<T> = T | ocxMap | ocxAcc<T>;
export declare function ocx<T extends ocxKey>(...obj: ocxObj<T>[]): ocxAcc<T>;
export {};
