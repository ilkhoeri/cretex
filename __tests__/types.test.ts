import { describe, test, expect } from '@jest/globals';

import { inferType } from '../src'; // Named export

describe('inferType Utility Type', () => {
  test('should infer the return type of a function', () => {
    type Fn = () => string;
    type Result = inferType<Fn>;
    const result: Result = 'Hello, world!'; // This should be valid
    expect(typeof result).toBe('string');
  });

  test('should infer return type for functions with arguments', () => {
    type Fn = (arg: number) => boolean;
    type Result = inferType<Fn>;
    const result: Result = true; // This should be valid
    expect(typeof result).toBe('boolean');
  });

  test('should handle complex function types', () => {
    type ComplexFn = (a: string, b: number) => { value: number };
    type Result = inferType<ComplexFn>;
    const result: Result = { value: 42 }; // This should be valid
    expect(result.value).toBe(42);
  });

  test('should work with async functions', () => {
    type AsyncFn = () => Promise<number>;
    type Result = inferType<AsyncFn>;
    const result: Result = Promise.resolve(123); // This should be valid
    return result.then(value => {
      expect(value).toBe(123);
    });
  });
});
