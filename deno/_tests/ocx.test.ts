// @ts-ignore TS6133
import { expect } from 'https://deno.land/x/expect@v0.2.6/mod.ts';
const test = Deno.test;

import { ocx, cleanFalsy } from '../lib/ocx.ts'; // Named export
import * as x from '../lib/index.ts'; // Test for namespace imports

test('should return the accumulator unchanged for falsy values', () => {
  expect(ocx({ key: 'value' }, null, undefined, false, 0, '')).toEqual({ key: 'value' });
});

test('should return an empty object when no valid input is provided', () => {
  expect(ocx(null, undefined, false, 0, '')).toEqual({});
});

test('should skip falsy values like null, undefined, or false', () => {
  expect(ocx(0)).toEqual({});
});

test('should return an empty object if no valid inputs are provided', () => {
  expect(ocx(null, undefined, false)).toEqual({});
});

test('should return the accumulator when input is null', () => {
  expect(ocx(null)).toEqual({});
});

test('should return the accumulator when input is undefined', () => {
  expect(ocx(undefined)).toEqual({});
});

test('should return the accumulator when input is falsy', () => {
  expect(ocx(false)).toEqual({});
});

test('should return the accumulator when input is falsy', () => {
  expect(ocx('ignore')).toEqual({});
});

test('should return the accumulator when input is falsy', () => {
  expect(ocx({})).toEqual({});
});

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

test('should handle arrays of objects', () => {
  const input = [{ key1: 'value1' }, { key2: 'value2' }];
  expect(ocx(input)).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle nested arrays of objects', () => {
  const input = [[{ key1: 'value1' }], { key2: 'value2' }];
  expect(ocx(input)).toEqual({ key1: 'value1', key2: 'value2' });
});

test('should handle functions returning objects', () => {
  const input = () => ({ key1: 'value1' });
  expect(ocx(input)).toEqual({ key1: 'value1' });
});

test('should handle nested functions returning objects', () => {
  const input = () => () => ({ key1: 'value1' });
  expect(ocx(input)).toEqual({ key1: 'value1' });
});

test('should handle functions returning falsy values', () => {
  const input = () => null;
  expect(ocx(input)).toEqual({});
});

test('should handle mixed objects, arrays, and functions', () => {
  const obj = { key1: 'value1' };
  const arr = [{ key2: 'value2' }, { key3: 'value3' }];
  const fn = () => ({ key4: 'value4' });
  expect(ocx(obj, arr, fn)).toEqual({
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
    key4: 'value4'
  });
});

test('should handle deeply nested mixed inputs', () => {
  const obj = { key1: { nestedKey: 'value1' } };
  const arr = [[{ key2: 'value2' }], { key3: 'value3' }];
  const fn = () => ({ key4: { nestedKey: 'value4' } });
  expect(ocx(obj, arr, fn)).toEqual({
    key1: { nestedKey: 'value1' },
    key2: 'value2',
    key3: 'value3',
    key4: { nestedKey: 'value4' }
  });
});

test('should handle mixed objects, arrays, and functions', () => {
  const obj = { key1: false };
  const arr = [{ key2: undefined }, { key3: null }];
  const fn = () => ({ key4: 'value4' });
  expect(cleanFalsy(ocx(obj, arr, fn))).toEqual({ key4: 'value4' });
});

test('should handle deeply nested mixed inputs', () => {
  const obj = { key1: !true && { nestedKey: 'value1' } };
  const arr = [[{ key2: 'value2' }], false && { key3: 'value3' }];
  const fn = () => ({ key4: { nestedKey: 'value4' } });
  expect(cleanFalsy(ocx(obj, arr, fn))).toEqual({
    key2: 'value2',
    key4: { nestedKey: 'value4' }
  });
});

test('should handle mixed objects, arrays, and functions', () => {
  const obj = { key1: false };
  const arr = [{ key2: undefined }, { key3: null }];
  const fn = () => ({ key4: 'value4' });
  expect(ocx.clean(obj, arr, fn)).toEqual({ key4: 'value4' });
});

test('should handle deeply nested mixed inputs', () => {
  const obj = { key1: !true && { nestedKey: 'value1' } };
  const arr = [[{ key2: 'value2' }], false && { key3: 'value3' }];
  const fn = () => ({ key4: { nestedKey: 'value4' } });
  expect(ocx.clean(obj, arr, fn)).toEqual({
    key2: 'value2',
    key4: { nestedKey: 'value4' }
  });
});

test('should merge nested objects with the same key (direct objects)', () => {
  const obj1 = { key1: { nestedKey: 'value1' } };
  const obj2 = { key1: { nestedKey2: 'value2' } };

  const result = ocx(obj1, obj2);

  expect(result).toEqual({
    key1: {
      nestedKey: 'value1',
      nestedKey2: 'value2' // Deep merge terjadi di sini
    }
  });
});

test('should merge nested objects with the same key (via functions)', () => {
  const obj1 = { key1: { nestedKey: 'value1' } };
  const objFn = () => ({ key1: { nestedKey2: 'value2' } });

  const result = ocx(obj1, objFn);

  expect(result).toEqual({
    key1: {
      nestedKey: 'value1',
      nestedKey2: 'value2' // Deep merge terjadi di sini
    }
  });
});

test('should merge nested objects in multiple layers', () => {
  const obj1 = { key1: { nestedKey1: { subKey: 'value1' } } };
  const obj2 = { key1: { nestedKey1: { subKey2: 'value2' } } };

  const result = ocx(obj1, obj2);

  expect(result).toEqual({
    key1: {
      nestedKey1: {
        subKey: 'value1',
        subKey2: 'value2' // Deep merge recursive terjadi di sini
      }
    }
  });
});

test('should merge multiple layers with functions and objects', () => {
  const obj1 = { key1: { nestedKey1: { subKey: 'value1' } } };
  const objFn = () => ({ key1: { nestedKey1: { subKey2: 'value2' } } });

  const result = ocx(obj1, objFn);

  expect(result).toEqual({
    key1: {
      nestedKey1: {
        subKey: 'value1',
        subKey2: 'value2' // Deep merge recursive dengan fungsi
      }
    }
  });
});

test('should handle empty inputs', () => {
  expect(ocx()).toEqual({});
});

test('should handle circular references gracefully', () => {
  const obj: any = {};
  obj.self = obj;
  expect(() => ocx(obj)).not.toThrow();
});

test('should handle symbols as keys', () => {
  const sym = Symbol('key');
  const obj = { [sym]: 'value' };
  expect(ocx(obj)).toEqual({ [sym]: 'value' });
});

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
  expect(x).toHaveProperty('ocx');
  expect(x.ocx).toBe(ocx);
});

test('should include the default export alias in the namespace export', () => {
  expect(x).toHaveProperty('default');
  expect(x.ocx).toBe(ocx);
});

test('should correctly export cleanFalsy as a named export', () => {
  expect(cleanFalsy).toBeDefined();
  expect(typeof cleanFalsy).toBe('function');
});

test('should correctly export cleanFalsy as the default export (alias x)', () => {
  expect(x.cleanFalsy).toBeDefined();
  expect(typeof x.cleanFalsy).toBe('function');
  expect(x.cleanFalsy).toBe(cleanFalsy); // Ensure both exports point to the same function
});

test('should include cleanFalsy in the namespace export', () => {
  expect(x).toHaveProperty('cleanFalsy');
  expect(x.cleanFalsy).toBe(cleanFalsy);
});

test('should include the default export alias in the namespace export', () => {
  expect(x).toHaveProperty('default');
  expect(x.cleanFalsy).toBe(cleanFalsy);
});
