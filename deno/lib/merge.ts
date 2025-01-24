import { twMerge } from 'tailwind-merge';
import { cnx, type cnxValues } from './cnx.ts';

export function merge(...merge: cnxValues[]) {
  return twMerge(cnx(...merge));
}

/** @deprecated Use `merge()` instead. */
export const cn = merge;
