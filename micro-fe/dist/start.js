"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.registerMicroApps = void 0;
var appList_1 = require("./appList");
var lifeCycle_1 = require("./lifeCycle");
var route_1 = require("./route");
var enums_1 = require("./enums");
var utils_1 = require("./utils");
var registerMicroApps = function (appList, lifeCycle) {
    (0, appList_1.setAppList)(appList);
    lifeCycle && (0, lifeCycle_1.setLifeCycle)(lifeCycle);
};
exports.registerMicroApps = registerMicroApps;
var start = function () {
    var list = (0, appList_1.getAppList)();
    if (!list.length) {
        throw new Error('Please register app first');
    }
    (0, route_1.hijackRoute)();
    (0, route_1.reroute)(window.location.href);
    list.forEach(function (app) {
        if (app.status === enums_1.AppStatus.NOT_LOADED) {
            (0, utils_1.prefetch)(app);
        }
    });
};
exports.start = start;
