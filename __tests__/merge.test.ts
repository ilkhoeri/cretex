// @ts-ignore TS6133
import { expect, test } from '@jest/globals';

import { merge, cn } from '../src'; // Named exports
import x from '../src/index'; // Default export alias
import * as cretex from '../src/index'; // Namespace import

describe('merge function', () => {
  test('should combine Tailwind classes without conflicts', () => {
    expect(merge('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  test('should handle conflicting Tailwind classes and retain the last one', () => {
    expect(merge('text-red-500', 'font-bold', 'text-blue-500')).toBe('font-bold text-blue-500');
  });

  test('should skip falsy values like null, undefined, false, and empty strings', () => {
    expect(merge('bg-white', null, undefined, '', false, 'border')).toBe('bg-white border');
  });

  test('should handle arrays of Tailwind classes', () => {
    expect(merge(['p-4', 'm-2', 'text-gray-700'])).toBe('p-4 m-2 text-gray-700');
  });

  test('should handle nested arrays of classes', () => {
    expect(merge(['p-4', ['m-2', ['text-gray-700', 'font-medium']]])).toBe('p-4 m-2 text-gray-700 font-medium');
  });

  test('should handle objects with truthy values', () => {
    const input = { 'text-lg': true, 'font-bold': false, 'text-gray-700': 1, 'bg-red-500': null };
    expect(merge(input)).toBe('text-lg text-gray-700');
  });

  test('should handle arrays of objects', () => {
    const input = [
      { 'text-sm': true, 'font-light': false },
      { 'bg-green-500': true, 'text-red-500': 0 }
    ];
    expect(merge(input)).toBe('text-sm bg-green-500');
  });

  test('should call functions and concatenate their results', () => {
    const input = () => 'text-indigo-500';
    expect(merge(input)).toBe('text-indigo-500');
  });

  test('should handle nested functions returning classes', () => {
    const input = () => () => 'text-indigo-500 font-bold';
    expect(merge(input)).toBe('text-indigo-500 font-bold');
  });

  test('should handle complex nested inputs with Tailwind classes', () => {
    const complexInput = [
      'bg-white',
      { 'text-gray-500': true, 'font-medium': false },
      ['p-4', { 'm-2': true }],
      () => 'hover:bg-gray-200',
      () => ({ 'focus:ring-2': true })
    ];
    expect(merge(complexInput)).toBe('bg-white text-gray-500 p-4 m-2 hover:bg-gray-200 focus:ring-2');
  });

  test('should return an empty string if no valid inputs are provided', () => {
    expect(merge(null, undefined, false, '')).toBe('');
  });

  test('should handle Tailwind merging with aliases (`cn`)', () => {
    expect(cn('text-red-500', 'text-blue-500', 'font-bold')).toBe('text-blue-500 font-bold');
  });
});

describe('export validation', () => {
  test('should correctly export merge as a named export', () => {
    expect(merge).toBeDefined();
    expect(typeof merge).toBe('function');
  });

  test('should correctly export cn as a named export (alias for merge)', () => {
    expect(cn).toBeDefined();
    expect(typeof cn).toBe('function');
    expect(cn).toBe(merge); // Ensure both refer to the same function
  });

  test('should correctly export merge as part of the default export alias', () => {
    expect(x.merge).toBeDefined();
    expect(typeof x.merge).toBe('function');
    expect(x.merge).toBe(merge);
  });

  test('should include merge and cn in the namespace export', () => {
    expect(cretex).toHaveProperty('merge');
    expect(cretex).toHaveProperty('cn');
    expect(cretex.merge).toBe(merge);
    expect(cretex.cn).toBe(merge);
  });
});
