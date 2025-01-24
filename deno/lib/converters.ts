export const rem = createConverter('rem', { shouldScale: true });
export const em = createConverter('em');

export function px(value: unknown): string | number {
  const transformedValue = getTransformedScaledValue(value);

  if (typeof transformedValue === 'number') {
    return transformedValue;
  }

  if (typeof transformedValue === 'string') {
    if (transformedValue.includes('calc') || transformedValue.includes('var')) {
      return transformedValue;
    }

    const unitMap: Record<string, number> = { px: 1, rem: 16, em: 16 };
    const matchedUnit = Object.keys(unitMap).find(unit => transformedValue.includes(unit));

    if (matchedUnit) {
      return parseFloat(transformedValue.replace(matchedUnit, '')) * unitMap[matchedUnit];
    }

    const numericValue = Number(transformedValue);
    return !isNaN(numericValue) ? numericValue : NaN;
  }
  return NaN;
}

export function createConverter(units: string, { shouldScale = false } = {}) {
  function converter(value: unknown): string {
    if (value === 0 || value === '0') return `0${units}`;

    if (typeof value === 'number') {
      const val = `${value / 16}${units}`;
      return shouldScale ? scaleRem(val) : val;
    }

    if (typeof value === 'string') {
      if (value === '') return value;

      if (value.startsWith('calc(') || value.startsWith('clamp(') || value.includes('rgba(')) {
        return value;
      }

      if (value.includes(',')) {
        return value
          .split(',')
          .map(val => converter(val))
          .join(',');
      }

      if (value.includes(' ')) {
        return value
          .split(' ')
          .map(val => converter(val))
          .join(' ');
      }

      if (value.includes(units)) {
        return shouldScale ? scaleRem(value) : value;
      }

      const replaced = value.replace('px', '');
      if (!Number.isNaN(Number(replaced))) {
        const val = `${Number(replaced) / 16}${units}`;
        return shouldScale ? scaleRem(val) : val;
      }
    }

    return value as string;
  }

  return converter;
}

function scaleRem(value: string): string {
  if (value === '0rem') return '0rem';

  return value;
}

function getTransformedScaledValue(value: unknown) {
  if (typeof value !== 'string' || !/var\(--.*?scale\)/.test(value)) {
    return value;
  }

  return value
    .match(/^calc\((.*?)\)$/)?.[1]
    .split('*')[0]
    .trim();
}
