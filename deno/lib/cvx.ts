type ExcludeKeys = 'defaultVariants' | '';
type Undefined<T> = T extends undefined ? never : T;

export type cvxProps<T extends (...keys: any) => any> = Omit<Undefined<Parameters<T>[0]>, ExcludeKeys>;

export type cvxKeys = { [key: string]: { [key: string]: string } };

export type cvxResult<T extends cvxKeys> = { [K in keyof T]?: keyof T[K] };

export interface cvxRecord<T extends cvxKeys> {
  assign?: string;
  variants: T;
  defaultVariants?: cvxResult<T>;
}

export function cvx<T extends cvxKeys>(keys: cvxRecord<T>) {
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
      .join(' ');

    return keys.assign ? [keys.assign, variants].join(' ').trim() : variants;
  };
}
