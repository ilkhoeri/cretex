"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cnx = cnx;
function cnx(...inputs) {
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
}
