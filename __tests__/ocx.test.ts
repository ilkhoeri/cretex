// @ts-ignore TS6133
import { expect, test } from '@jest/globals';

import { ocx } from '../src'; // Named export
import x from '../src/index'; // Default export alias
import * as cretex from '../src/index'; // Test for namespace imports

describe('ocx function', () => {
  test('should merge multiple objects', () => {
    const obj1 = { key1: 'value1' };
    const obj2 = { key2: 'value2' };
    const result = ocx(obj1, obj2);
    expect(result).toEqual({ key1: 'value1', key2: 'value2' });
  });

  test('should handle nested objects', () => {
    const obj1 = { key1: { nestedKey: 'nestedValue' } };
    const obj2 = { key2: 'value2' };
    const result = ocx(obj1, obj2);
    expect(result).toEqual({ key1: { nestedKey: 'nestedValue' }, key2: 'value2' });
  });

  test('should handle arrays of objects', () => {
    const input = [{ key1: 'value1' }, { key2: 'value2' }];
    const result = ocx(input);
    expect(result).toEqual({ key1: 'value1', key2: 'value2' });
  });

  test('should handle nested arrays of objects', () => {
    const input = [[{ key1: 'value1' }], { key2: 'value2' }];
    const result = ocx(input);
    expect(result).toEqual({ key1: 'value1', key2: 'value2' });
  });

  test('should handle functions returning objects', () => {
    const input = () => ({ key1: 'value1' });
    const result = ocx(input);
    expect(result).toEqual({ key1: 'value1' });
  });

  test('should handle nested functions', () => {
    const input = () => () => ({ key1: 'value1' });
    const result = ocx(input);
    expect(result).toEqual({ key1: 'value1' });
  });

  test('should handle mixed inputs (objects, arrays, functions)', () => {
    const obj1 = { key1: 'value1' };
    const arr = [{ key2: 'value2' }, { key3: 'value3' }];
    const fn = () => ({ key4: 'value4' });
    const result = ocx(obj1, arr, fn);
    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4'
    });
  });

  test('should skip falsy values like null, undefined, or false', () => {
    const obj1 = { key1: 'value1' };
    const result = ocx(obj1, null, undefined, false);
    expect(result).toEqual({ key1: 'value1' });
  });

  test('should return an empty object if no valid inputs are provided', () => {
    const result = ocx(null, undefined, false);
    expect(result).toEqual({});
  });
});

describe('export validation', () => {
  test('should correctly export ocx as a named export', () => {
    expect(ocx).toBeDefined();
    expect(typeof ocx).toBe('function');
  });

  test('should correctly export ocx as the default export (alias x)', () => {
    expect(x.ocx).toBeDefined();
    expect(typeof x.ocx).toBe('function');
    expect(x.ocx).toBe(ocx); // Ensure both exports point to the same function
  });

  test('should include ocx in the namespace export', () => {
    expect(cretex).toHaveProperty('ocx');
    expect(cretex.ocx).toBe(ocx);
  });

  test('should include the default export alias in the namespace export', () => {
    expect(cretex).toHaveProperty('default');
    expect(cretex.ocx).toBe(ocx);
  });
});
