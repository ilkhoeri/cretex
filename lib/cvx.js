"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvx = cvx;
function cvx(keys) {
    return (result = {}) => {
        const mergedVariant = { ...keys.defaultVariants, ...result };
        const variants = Object.keys(keys.variants)
            .map(key => {
            var _a;
            const variantKey = mergedVariant[key] || ((_a = keys.defaultVariants) === null || _a === void 0 ? void 0 : _a[key]);
            return variantKey ? keys.variants[key][variantKey] : undefined;
        })
            .filter(Boolean)
            .join(' ');
        return keys.assign ? [keys.assign, variants].join(' ').trim() : variants;
    };
}
