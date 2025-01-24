// @ts-ignore TS6133
import { expect, test } from '@jest/globals';

import { cvx } from '../src'; // Named export
import x from '../src/index'; // Default export alias
import * as cretex from '../src/index'; // Test for namespace imports

describe('cvx function', () => {
  const variants = {
    size: { small: 'text-sm', large: 'text-lg' },
    color: { primary: 'text-primary', secondary: 'text-secondary' }
  };

  const defaultVariants: x.cvxResult<typeof variants> = { size: 'small', color: 'primary' };

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
});

describe('export validation', () => {
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
    expect(cretex).toHaveProperty('cvx');
    expect(cretex.cvx).toBe(cvx);
  });

  test('should include the default export alias in the namespace export', () => {
    expect(cretex).toHaveProperty('default');
    expect(cretex.cvx).toBe(cvx);
  });
});
