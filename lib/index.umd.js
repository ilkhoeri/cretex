(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('tailwind-merge')):typeof define==='function'&&define.amd?define(['exports','tailwind-merge'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.Cretex={},g.tailwindMerge));})(this,(function(exports,tailwindMerge){'use strict';function _interopNamespaceDefault(e){var n=Object.create(null);if(e){Object.keys(e).forEach(function(k){if(k!=='default'){var d=Object.getOwnPropertyDescriptor(e,k);Object.defineProperty(n,k,d.get?d:{enumerable:true,get:function(){return e[k]}});}})}n.default=e;return Object.freeze(n)}var tailwindMerge__namespace=/*#__PURE__*/_interopNamespaceDefault(tailwindMerge);function cnx(...inputs) {
    return inputs
        .reduce((acc, input) => {
        if (!input)
            return acc;
        if (typeof input === 'string' || typeof input === 'number')
            return [...acc, String(input)];
        if (Array.isArray(input))
            return [...acc, cnx(...input)];
        if (typeof input === 'object')
            return [
                ...acc,
                ...Object.entries(input)
                    .filter(([, value]) => Boolean(value))
                    .map(([key]) => key)
            ];
        if (typeof input === 'function')
            return [...acc, cnx(input())];
        return acc;
    }, [])
        .join(' ');
}function cvx(keys) {
    return (result = {}) => {
        const mergedVariant = { ...keys.defaultVariants, ...result };
        const variants = Object.keys(keys.variants)
            .map(key => {
            var _a;
            const variantKey = mergedVariant[key] || ((_a = keys.defaultVariants) === null || _a === undefined ? undefined : _a[key]);
            return variantKey ? keys.variants[key][variantKey] : undefined;
        })
            .filter(Boolean)
            .join(' ');
        return keys.assign ? [keys.assign, variants].join(' ').trim() : variants;
    };
}function ocx(...obj) {
    return obj.reduce((acc, input) => {
        if (!input)
            return acc;
        if (typeof input === 'function')
            return { ...acc, ...ocx(input()) };
        if (Array.isArray(input))
            return { ...acc, ...ocx(...input) };
        if (typeof input === 'object')
            return { ...acc, ...input };
        return acc;
    }, {});
}function merge(...merge) {
    return tailwindMerge.twMerge(cnx(...merge));
}
/** @deprecated Use `merge()` instead. */
const cn = merge;const rem = createConverter('rem', { shouldScale: true });
const em = createConverter('em');
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
        .match(/^calc\((.*?)\)$/)) === null || _a === undefined ? undefined : _a[1].split('*')[0].trim();
}var x=/*#__PURE__*/Object.freeze({__proto__:null,cn:cn,cnx:cnx,createConverter:createConverter,cvx:cvx,em:em,merge:merge,ocx:ocx,px:px,rem:rem,tw:tailwindMerge__namespace});exports.tw=tailwindMerge__namespace;exports.cn=cn;exports.cnx=cnx;exports.createConverter=createConverter;exports.cvx=cvx;exports.default=x;exports.em=em;exports.merge=merge;exports.ocx=ocx;exports.px=px;exports.rem=rem;exports.x=x;Object.defineProperty(exports,'__esModule',{value:true});}));