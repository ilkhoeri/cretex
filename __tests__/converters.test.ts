// @ts-ignore TS6133
import { describe, test, expect, it } from '@jest/globals';

import { rem, em, px, createConverter } from '../src'; // Named exports
import x from '../src/index'; // Default export alias
import * as cretex from '../src/index'; // Namespace import

describe('px function', () => {
  test('should return correct px value for numbers', () => {
    expect(px(16)).toBe(16);
    expect(px(32)).toBe(32);
  });

  test('should transform rem units to px', () => {
    expect(px('1rem')).toBe(16);
    expect(px('2rem')).toBe(32);
  });

  test('should transform em units to px', () => {
    expect(px('1em')).toBe(16);
    expect(px('2em')).toBe(32);
  });

  test('should return original value for calc and var expressions', () => {
    expect(px('calc(100% - 16px)')).toBe('calc(100% - 16px)');
    expect(px('calc(100% - 20px)')).toBe('calc(100% - 20px)');
    expect(px('var(--size)')).toBe('var(--size)');
  });

  test('should return numeric value for valid numeric strings', () => {
    expect(px('16')).toBe(16);
    expect(px('32')).toBe(32);
  });

  test('should return number for calc(var()) values', () => {
    expect(px('calc(1rem * var(--viewport-scale))')).toBe(16);
  });

  test('should return calc() values', () => {
    expect(px('calc(1rem * 1)')).toEqual('calc(1rem * 1)');
  });

  it('converts rem string to px number', () => {
    expect(px('1rem')).toBe(16);
    expect(px('1.25rem')).toBe(20);
  });

  it('converts em string to px number', () => {
    expect(px('1em')).toBe(16);
    expect(px('1.25em')).toBe(20);
  });

  it('converts px string to px number', () => {
    expect(px('12px')).toBe(12);
  });

  it('returns number if function received number as an argument', () => {
    expect(px(16)).toBe(16);
    expect(px('16')).toBe(16);
  });

  it('returns NaN if value cannot be parsed', () => {
    expect(px('12p')).toBe(NaN);
    expect(px('12re')).toBe(NaN);
    expect(px('12%')).toBe(NaN);
    expect(px('12vh')).toBe(NaN);
    expect(px({})).toBe(NaN);
    expect(px([])).toBe(NaN);
    expect(px(null)).toBe(NaN);
    expect(px(undefined)).toBe(NaN);
  });

  test('converts scaled rem values', () => {
    expect(px('calc(1rem * var(--viewport-scale))')).toBe(16);
    expect(px('calc(1.25rem * var(--viewport-scale))')).toBe(20);
    expect(px('calc(10rem + 1vh)')).toBe('calc(10rem + 1vh)');
  });

  test('converts calc() to calc?.group[1]', () => {
    expect(px('calc(calc(var(--example-scale) + 2) * calc(var(--scale) / 2))')).toBe('calc(var(--example-scale) + 2)');
    expect(px('calc(var(--example-scale) + 2) * calc(var(--scale) / 2)')).toBe('var(--example-scale) + 2)');
    expect(px('calc(var(--scale) * 3)')).toBe('var(--scale)');
  });

  test('should return NaN for undefined values', () => {
    expect(px(undefined)).toEqual(NaN);
  });

  test('should return NaN for unsupported strings', () => {
    expect(px('unsupported')).toEqual(NaN);
  });

  test('should return NaN for random strings', () => {
    expect(px('random')).toEqual(NaN);
  });

  test('should return NaN for invalid strings', () => {
    expect(px('invalid')).toEqual(NaN);
  });
});

describe('createConverter function', () => {
  const remConverter = createConverter('rem');
  const emConverter = createConverter('em', { shouldScale: true });

  test('should convert numbers to rem units', () => {
    expect(remConverter(16)).toBe('1rem');
    expect(remConverter(32)).toBe('2rem');
  });

  test('should scale rem values when shouldScale is true', () => {
    expect(emConverter(16)).toBe('1em');
    expect(emConverter(32)).toBe('2em');
  });

  test('should handle 0 correctly', () => {
    expect(remConverter(0)).toBe('0rem');
    expect(remConverter('0')).toBe('0rem');
  });

  test('should convert px values in strings', () => {
    expect(remConverter('16px')).toBe('1rem');
    expect(remConverter('32px')).toBe('2rem');
  });

  test('should return calc expressions unchanged', () => {
    expect(remConverter('calc(100% - 20px)')).toBe('calc(100% - 20px)');
  });

  test('should handle comma-separated values', () => {
    expect(remConverter('16px, 32px')).toBe('1rem, 2rem');
  });

  test('should handle space-separated values', () => {
    expect(remConverter('16px 32px')).toBe('1rem 2rem');
  });

  test('should handle nested comma-separated and space-separated values', () => {
    expect(remConverter('16px, 32px 64px')).toBe('1rem, 2rem 4rem');
  });

  test('should handle already converted units', () => {
    expect(remConverter('1rem')).toBe('1rem');
  });

  test('should handle strings with calc() and clamp()', () => {
    const remConverter = createConverter('rem');
    expect(remConverter('calc(100% - 16px)')).toBe('calc(100% - 16px)');
    expect(remConverter('clamp(1rem, 2vw, 3rem)')).toBe('clamp(1rem, 2vw, 3rem)');
  });

  test('should handle comma-separated values', () => {
    const remConverter = createConverter('rem');
    expect(remConverter('16px, 32px')).toBe('1rem, 2rem');
  });

  test('should handle space-separated values', () => {
    const remConverter = createConverter('rem');
    expect(remConverter('16px 32px')).toBe('1rem 2rem');
  });

  test('should return original value for invalid inputs', () => {
    expect(remConverter('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)');
    expect(remConverter('')).toBe('');
  });

  test('should return raw value for unsupported cases', () => {
    const remConverter = createConverter('rem');
    expect(remConverter('unsupported')).toBe('unsupported');
    expect(remConverter('rgba(255, 0, 0, 1)')).toBe('rgba(255, 0, 0, 1)');
  });
});

describe('rem converters', () => {
  test('rem should convert numbers and strings correctly', () => {
    expect(rem('0rem')).toEqual('0rem');
    expect(rem(16)).toBe('1rem');
    expect(rem('16px')).toBe('1rem');
    expect(rem('32px')).toBe('2rem');
  });

  test('should return 0rem for 0 values', () => {
    expect(rem(0)).toBe('0rem');
    expect(rem('0')).toBe('0rem');
  });

  test('should handle calc() values', () => {
    expect(rem('calc(100% - 16px)')).toBe('calc(100% - 16px)');
    expect(rem('calc(100% - 20px)')).toBe('calc(100% - 20px)');
  });

  test('should return NaN for undefined values', () => {
    expect(rem('calc(1rem * var(--viewport-scale))')).toEqual('calc(1rem * var(--viewport-scale))');
  });
});

describe('em converters', () => {
  test('em should scale and convert values correctly', () => {
    expect(em(16)).toBe('1em');
    expect(em('32px')).toBe('2em');
  });

  test('should handle calc() values', () => {
    expect(em('calc(100% - 20px)')).toBe('calc(100% - 20px)');
    expect(em('calc(100% - 16px)')).toBe('calc(100% - 16px)');
  });

  test('should return 0em for 0 values', () => {
    expect(em(0)).toBe('0em');
    expect(em('0')).toBe('0em');
  });
});

describe('export validation', () => {
  test('should correctly export named functions', () => {
    expect(rem).toBeDefined();
    expect(em).toBeDefined();
    expect(px).toBeDefined();
    expect(createConverter).toBeDefined();
  });

  test('should correctly export default alias', () => {
    expect(x.rem).toBe(rem);
    expect(x.em).toBe(em);
    expect(x.px).toBe(px);
    expect(x.createConverter).toBe(createConverter);
  });

  test('should include functions in namespace export', () => {
    expect(cretex.rem).toBe(rem);
    expect(cretex.em).toBe(em);
    expect(cretex.px).toBe(px);
    expect(cretex.createConverter).toBe(createConverter);
  });
});
