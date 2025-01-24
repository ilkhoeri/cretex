type cnxMap = Record<string, any>;
export type cnxValues = cnxMap | cnxMap[] | cnxValues[] | string | number | null | boolean | undefined | (() => cnxValues);
export declare function cnx(...inputs: cnxValues[]): string;
export {};
