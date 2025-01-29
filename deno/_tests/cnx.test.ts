// @ts-ignore TS6133
import { expect } from 'https://deno.land/x/expect@v0.2.6/mod.ts';
const test = Deno.test;

import { cnx } from '../lib/index.ts'; // Named export
import * as x from '../lib/index.ts'; // Test for namespace imports

test('should return an empty string when inputs are null or undefined', () => {
  expect(cnx(null, NaN, undefined)).toBe('');
});

test('should ignore boolean values', () => {
  expect(cnx(true, false)).toBe('');
});

test('should handle unsupported types gracefully', () => {
  expect(cnx(() => Symbol('test'))).toBe('');
});

test('should combine valid and invalid values correctly', () => {
  expect(cnx('valid', null, 42, false)).toBe('valid 42');
});

test('cnx handles falsy values correctly', () => {
  expect(cnx(null, NaN, undefined)).toEqual('');
});

test('cnx handles falsy values correctly', () => {
  expect(cnx()).toEqual('');
});

test('cnx handles falsy values correctly', () => {
  expect(cnx({}, false, () => {}, [])).toEqual('');
});

test('cnx handles [][] values', () => {
  expect(cnx([], [], [])).toEqual('');
});

test('cnx handles falsy values correctly', () => {
  expect(cnx(null, undefined, false)).toBe('');
});

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
  expect(x).toHaveProperty('cnx');
  expect(x.cnx).toBe(cnx);
});

test('should include the default export alias in the namespace export', () => {
  expect(x).toHaveProperty('default');
  expect(x.cnx).toBe(cnx);
});
