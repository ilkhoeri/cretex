"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = void 0;
exports.merge = merge;
const tailwind_merge_1 = require("tailwind-merge");
const cnx_1 = require("./cnx");
function merge(...merge) {
    return (0, tailwind_merge_1.twMerge)((0, cnx_1.cnx)(...merge));
}
/** @deprecated Use `merge()` instead. */
exports.cn = merge;
