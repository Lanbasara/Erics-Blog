"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppList = exports.setAppList = void 0;
var enums_1 = require("../enums");
var appList = [];
var setAppList = function (list) {
    appList = list;
    appList.map(function (app) {
        app.status = enums_1.AppStatus.NOT_LOADED;
    });
};
exports.setAppList = setAppList;
var getAppList = function () {
    return appList;
};
exports.getAppList = getAppList;
