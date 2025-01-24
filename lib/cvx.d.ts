type ExcludeKeys = 'defaultVariants' | '';
type Undefined<T> = T extends undefined ? never : T;
export type cvxProps<T extends (...keys: any) => any> = Omit<Undefined<Parameters<T>[0]>, ExcludeKeys>;
export type cvxKeys = {
    [key: string]: {
        [key: string]: string;
    };
};
export type cvxResult<T extends cvxKeys> = {
    [K in keyof T]?: keyof T[K];
};
export interface cvxRecord<T extends cvxKeys> {
    assign?: string;
    variants: T;
    defaultVariants?: cvxResult<T>;
}
export declare function cvx<T extends cvxKeys>(keys: cvxRecord<T>): (result?: cvxResult<T>) => string;
export {};
