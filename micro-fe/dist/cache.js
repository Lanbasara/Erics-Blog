"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.setCatch = void 0;
var cache = {};
var setCatch = function (key, url, value) {
    var _a;
    cache[key] = __assign(__assign({}, cache[key]), (_a = {}, _a[url] = value, _a));
};
exports.setCatch = setCatch;
var getCache = function (key, url) {
    if (cache[key]) {
        return cache[key][url];
    }
};
exports.getCache = getCache;
