type cnxMap = Record<string, any>;

export type cnxValues = cnxMap | cnxMap[] | cnxValues[] | string | number | null | boolean | undefined | (() => cnxValues);

export function cnx(...inputs: cnxValues[]): string {
  return inputs
    .reduce<string[]>((acc, input) => {
      if (!input) return acc;

      if (typeof input === 'string' || typeof input === 'number') return [...acc, String(input)];

      if (Array.isArray(input)) return [...acc, cnx(...input)];

      if (typeof input === 'object')
        return [
          ...acc,
          ...Object.entries(input)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
        ];

      if (typeof input === 'function') return [...acc, cnx(input())];
      return acc;
    }, [])
    .join(' ');
}
