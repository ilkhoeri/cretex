import { type cnxValues } from './cnx';
export declare function merge(...merge: cnxValues[]): string;
/** @deprecated Use `merge()` instead. */
export declare const cn: typeof merge;
