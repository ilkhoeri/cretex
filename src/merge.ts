import { twMerge } from 'tailwind-merge';
import { cnx, type cnxValues } from './cnx';

export function merge(...merge: cnxValues[]): string {
  return twMerge(cnx(...merge));
}

/** @deprecated Use `merge()` instead. */
export const cn = merge;
