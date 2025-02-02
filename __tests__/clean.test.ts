// @ts-ignore TS6133
import { describe, test, expect } from '@jest/globals';

import { ocx, clean } from '../src'; // Named export
import x from '../src/index'; // Default export alias
import * as cretex from '../src/index'; // Test for namespace imports

describe('clean Mixed inputs', () => {
  test('should handle mixed objects, arrays, and functions', () => {
    const obj = { key1: false };
    const arr = [{ key2: undefined }, { key3: null }];
    const fn = () => ({ key4: 'value4' });
    expect(clean(ocx(obj, arr, fn))).toEqual({ key4: 'value4' });
  });

  test('should handle deeply nested mixed inputs', () => {
    const obj = { key1: !true && { nestedKey: 'value1' } };
    const arr = [[{ key2: 'value2' }], false && { key3: 'value3' }];
    const fn = () => ({ key4: { nestedKey: 'value4' } });
    expect(clean(ocx(obj, arr, fn))).toEqual({
      key2: 'value2',
      key4: { nestedKey: 'value4' }
    });
  });

  test('should clean falsy values in arrays with exclude [0]', () => {
    const input = {
      arr: [null, false, '', 0, 'valid', undefined, { nested: false }]
    };
    const output = clean(input, [0]);
    expect(output).toEqual({ arr: [0, 'valid'] });
  });

  test('should remove empty objects and arrays', () => {
    const input = {
      a: { b: { c: null }, d: [] },
      e: []
    };
    const output = clean(input);
    expect(output).toEqual({});
  });

  test('should handle mixed arrays with objects', () => {
    const input = {
      arr: [false, '', { a: 0, b: '' }, 42]
    };
    const output = clean(input);
    expect(output).toEqual({ arr: [42] });
  });

  test('should handle mixed arrays with objects and exclude [0]', () => {
    const input = {
      arr: [false, '', { a: 0, b: '' }, 42]
    };
    const output = clean(input, [0]);
    expect(output).toEqual({ arr: [{ a: 0 }, 42] });
  });

  test('should remove falsy values but keep 0 by default', () => {
    const input = {
      a: null,
      b: undefined,
      c: false,
      d: 0,
      e: '',
      f: 'valid'
    };
    const output = clean(input, [0]);
    expect(output).toEqual({ d: 0, f: 'valid' });
  });

  test('should remove falsy values but keep 0', () => {
    const input = {
      a: null,
      b: undefined,
      c: false,
      d: 0,
      e: '',
      f: 'valid'
    };
    const output = clean(input);
    expect(output).toEqual({ f: 'valid' });
  });

  test('should clean deeply nested objects', () => {
    const input = {
      a: {
        b: {
          c: false,
          d: '',
          e: 0,
          f: 'valid'
        }
      }
    };
    const output = clean(input, [0]);
    expect(output).toEqual({ a: { b: { e: 0, f: 'valid' } } });
  });

  test('should remove empty objects and arrays', () => {
    const input = {
      a: { b: { c: null }, d: [] },
      e: []
    };
    const output = clean(input);
    expect(output).toEqual({});
  });

  test('should allow keeping custom falsy values', () => {
    const input = {
      a: null,
      b: undefined,
      c: false,
      d: 0,
      e: '',
      f: 'valid'
    };

    const output = clean(input, [0, false, '']);
    expect(output).toEqual({ c: false, d: 0, e: '', f: 'valid' });
  });

  test("should allow removing 0 if not included in the 'include' list", () => {
    const input = {
      num: 0,
      str: '',
      bool: false
    };

    const output = clean(input, ['']);
    expect(output).toEqual({ str: '' });
  });
});

describe('export validation clean()', () => {
  test('should correctly export clean as a named export', () => {
    expect(clean).toBeDefined();
    expect(typeof clean).toBe('function');
  });

  test('should correctly export clean as the default export (alias x)', () => {
    expect(x.clean).toBeDefined();
    expect(typeof x.clean).toBe('function');
    expect(x.clean).toBe(clean); // Ensure both exports point to the same function
  });

  test('should include clean in the namespace export', () => {
    expect(cretex).toHaveProperty('clean');
    expect(cretex.clean).toBe(clean);
  });

  test('should include the default export alias in the namespace export', () => {
    expect(cretex).toHaveProperty('default');
    expect(cretex.clean).toBe(clean);
  });
});
