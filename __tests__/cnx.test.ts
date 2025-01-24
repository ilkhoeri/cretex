// @ts-ignore TS6133
import { expect, test } from '@jest/globals';

import { cnx } from '../src'; // Named export
import x from '../src/index'; // Default export alias
import * as cretex from '../src/index'; // Test for namespace imports

describe('cnx function', () => {
  test('should concatenate string and number inputs', () => {
    expect(cnx('class1', 'class2', 123)).toBe('class1 class2 123');
  });

  test('should skip falsy values like null, undefined, false, and empty strings', () => {
    expect(cnx('class1', null, undefined, '', false, 'class2')).toBe('class1 class2');
  });

  test('should handle arrays of strings and numbers', () => {
    expect(cnx(['class1', 'class2', 123])).toBe('class1 class2 123');
  });

  test('should handle nested arrays', () => {
    expect(cnx(['class1', ['class2', ['class3', 456]], 'class4'])).toBe('class1 class2 class3 456 class4');
  });

  test('should handle objects with truthy values', () => {
    const input = { class1: true, class2: false, class3: 1, class4: null, class5: 'value' };
    expect(cnx(input)).toBe('class1 class3 class5');
  });

  test('should handle arrays of objects', () => {
    const input = [
      { class1: true, class2: false },
      { class3: true, class4: 0 }
    ];
    expect(cnx(input)).toBe('class1 class3');
  });

  test('should call functions and concatenate their results', () => {
    const input = () => 'classFromFunction';
    expect(cnx(input)).toBe('classFromFunction');
  });

  test('should handle nested functions', () => {
    const input = () => () => 'nestedClass';
    expect(cnx(input)).toBe('nestedClass');
  });

  test('should handle complex nested inputs', () => {
    const complexInput = ['class1', { class2: true, class3: false }, ['class4', { class5: true }], () => 'class6', () => ({ class7: true })];
    expect(cnx(complexInput)).toBe('class1 class2 class4 class5 class6 class7');
  });

  test('should return an empty string if no valid inputs are provided', () => {
    expect(cnx(null, undefined, false, '')).toBe('');
  });
});

describe('export validation', () => {
  test('should correctly export cnx as a named export', () => {
    expect(cnx).toBeDefined();
    expect(typeof cnx).toBe('function');
  });

  test('should correctly export cnx as the default export (alias x)', () => {
    expect(x.cnx).toBeDefined();
    expect(typeof x.cnx).toBe('function');
    expect(x.cnx).toBe(cnx); // Ensure both exports point to the same function
  });

  test('should include cnx in the namespace export', () => {
    expect(cretex).toHaveProperty('cnx');
    expect(cretex.cnx).toBe(cnx);
  });

  test('should include the default export alias in the namespace export', () => {
    expect(cretex).toHaveProperty('default');
    expect(cretex.cnx).toBe(cnx);
  });
});
