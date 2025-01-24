"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocx = ocx;
function ocx(...obj) {
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
}
