// @ts-ignore TS6133
import { expect } from 'https://deno.land/x/expect@v0.2.6/mod.ts';
const test = Deno.test;

import { cvx } from '../lib/cvx.ts'; // Named export
import * as x from '../lib/index.ts'; // Test for namespace imports

const variants = {
  size: { small: 'text-sm', large: 'text-lg' },
  color: { primary: 'text-primary', secondary: 'text-secondary' }
};

const defaultVariants: x.cvxResult<typeof variants> = { size: 'small', color: 'primary' };

test('should use defaultVariants if result does not include key', () => {
  const fn = cvx({
    assign: 'base-class',
    variants: {
      color: { primary: 'text-blue', secondary: 'text-green' },
      size: { large: 'text-lg', small: 'text-sm' }
    },
    defaultVariants: {
      color: 'primary'
    }
  });
  expect(fn()).toBe('base-class text-blue');
});

test('should merge result with defaultVariants', () => {
  const fn = cvx({
    assign: 'base-class',
    variants: {
      color: { primary: 'text-blue', secondary: 'text-green' },
      size: { large: 'text-lg', small: 'text-sm' }
    },
    defaultVariants: {
      color: 'primary'
    }
  });
  expect(fn({ size: 'large' })).toBe('base-class text-blue text-lg');
});

test('should prioritize result over defaultVariants', () => {
  const fn = cvx({
    assign: 'base-class',
    variants: {
      color: { primary: 'text-blue', secondary: 'text-green' },
      size: { large: 'text-lg', small: 'text-sm' }
    },
    defaultVariants: {
      color: 'primary'
    }
  });
  expect(fn({ color: 'secondary', size: 'small' })).toBe('base-class text-green text-sm');
});

test('should handle missing defaultVariants gracefully', () => {
  const keysWithoutDefaults = {
    assign: 'base-class',
    variants: {
      color: { primary: 'text-blue', secondary: 'text-green' },
      size: { large: 'text-lg', small: 'text-sm' }
    }
  };
  const fnWithoutDefaults = cvx(keysWithoutDefaults);
  expect(fnWithoutDefaults({ size: 'small' })).toBe('base-class text-sm');
});

test('should return default variants when no input is provided', () => {
  const cvxFn = cvx({ variants, defaultVariants });
  expect(cvxFn()).toBe('text-sm text-primary');
});

test('should override default variants with provided result', () => {
  const cvxFn = cvx({ variants, defaultVariants });
  const result = cvxFn({ size: 'large', color: 'secondary' });
  expect(result).toBe('text-lg text-secondary');
});

test('should handle partial overrides of default variants', () => {
  const cvxFn = cvx({ variants, defaultVariants });
  const result = cvxFn({ size: 'large' });
  expect(result).toBe('text-lg text-primary');
});

test('should handle additional assignment string', () => {
  const cvxFn = cvx({ variants, defaultVariants, assign: 'base-class' });
  expect(cvxFn()).toBe('base-class text-sm text-primary');
});

test('should return empty string if no defaultVariants or result is provided', () => {
  const cvxFn = cvx({ variants });
  expect(cvxFn()).toBe('');
});

test('should correctly combine assignment string and overrides', () => {
  const cvxFn = cvx({ variants, defaultVariants, assign: 'base-class' });
  const result = cvxFn({ size: 'large' });
  expect(result).toBe('base-class text-lg text-primary');
});

test('should ignore unknown keys in the result', () => {
  const cvxFn = cvx({ variants, defaultVariants });
  // @ts-ignore: Simulate invalid input
  const result = cvxFn({ unknown: 'value' });
  expect(result).toBe('text-sm text-primary');
});

test('should handle variants with no defaultVariants', () => {
  const cvxFn = cvx({ variants, assign: 'base-class' });
  const result = cvxFn({ size: 'large', color: 'secondary' });
  expect(result).toBe('base-class text-lg text-secondary');
});

test('should handle empty variants object gracefully', () => {
  const cvxFn = cvx({ variants: {}, assign: 'base-class' });
  expect(cvxFn()).toBe('base-class');
});

test('should return only assignment string if no variants or result is provided', () => {
  const cvxFn = cvx({ variants: {}, assign: 'base-class' });
  const result = cvxFn({}); // Empty result
  expect(result).toBe('base-class');
});

test('should correctly export cvx as a named export', () => {
  expect(cvx).toBeDefined();
  expect(typeof cvx).toBe('function');
});

test('should correctly export cvx as the default export (alias x)', () => {
  expect(x.cvx).toBeDefined();
  expect(typeof x.cvx).toBe('function');
  expect(x.cvx).toBe(cvx); // Ensure both exports point to the same function
});

test('should include cvx in the namespace export', () => {
  expect(x).toHaveProperty('cvx');
  expect(x.cvx).toBe(cvx);
});

test('should include the default export alias in the namespace export', () => {
  expect(x).toHaveProperty('default');
  expect(x.cvx).toBe(cvx);
});
