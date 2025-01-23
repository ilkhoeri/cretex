import { cnx } from './cnx';
import { cvx } from './cvx';
import { ocx } from './ocx';
import { cn, merge } from './merge';
import { px, rem, em, createConverter } from './converters';

import type { cnxValues } from './cnx';
import type { cvxRecord, cvxResult, cvxProps, cvxKeys } from './cvx';
import type { ocxAcc, ocxMap, ocxObj } from './ocx';
import type { inferType } from './types';

import * as tw from 'tailwind-merge';

const twMerge = tw.twMerge;
const twJoin = tw.twJoin;

export { cnx, cvx, ocx, cn, merge, px, rem, em, createConverter, twMerge, twJoin, tw };
export type { cvxRecord, cvxResult, cvxProps, cvxKeys, cnxValues, ocxAcc, ocxMap, ocxObj, inferType };
