export declare const rem: (value: unknown) => string;
export declare const em: (value: unknown) => string;
export declare function px(value: unknown): string | number;
export declare function createConverter(units: string, { shouldScale }?: {
    shouldScale?: boolean | undefined;
}): (value: unknown) => string;
