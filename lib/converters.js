"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.em = exports.rem = void 0;
exports.px = px;
exports.createConverter = createConverter;
exports.rem = createConverter('rem', { shouldScale: true });
exports.em = createConverter('em');
function px(value) {
    const transformedValue = getTransformedScaledValue(value);
    if (typeof transformedValue === 'number') {
        return transformedValue;
    }
    if (typeof transformedValue === 'string') {
        if (transformedValue.includes('calc') || transformedValue.includes('var')) {
            return transformedValue;
        }
        const unitMap = { px: 1, rem: 16, em: 16 };
        const matchedUnit = Object.keys(unitMap).find(unit => transformedValue.includes(unit));
        if (matchedUnit) {
            return parseFloat(transformedValue.replace(matchedUnit, '')) * unitMap[matchedUnit];
        }
        const numericValue = Number(transformedValue);
        return !isNaN(numericValue) ? numericValue : NaN;
    }
    return NaN;
}
function createConverter(units, { shouldScale = false } = {}) {
    function converter(value) {
        if (value === 0 || value === '0')
            return `0${units}`;
        if (typeof value === 'number') {
            const val = `${value / 16}${units}`;
            return shouldScale ? scaleRem(val) : val;
        }
        if (typeof value === 'string') {
            if (value === '')
                return value;
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
        return value;
    }
    return converter;
}
function scaleRem(value) {
    if (value === '0rem')
        return '0rem';
    return value;
}
function getTransformedScaledValue(value) {
    var _a;
    if (typeof value !== 'string' || !/var\(--.*?scale\)/.test(value)) {
        return value;
    }
    return (_a = value
        .match(/^calc\((.*?)\)$/)) === null || _a === void 0 ? void 0 : _a[1].split('*')[0].trim();
}
