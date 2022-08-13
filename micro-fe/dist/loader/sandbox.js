"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxySandBox = void 0;
var ProxySandBox = /** @class */ (function () {
    function ProxySandBox() {
        var _this = this;
        this.running = false;
        var fakeWindow = Object.create(null);
        var proxy = new Proxy(fakeWindow, {
            set: function (target, p, value) {
                if (_this.running) {
                    target[p] = value;
                }
                return true;
            },
            get: function (target, p) {
                switch (p) {
                    // window上的这三个属性都指向window自己
                    case 'window':
                    case 'self':
                    case 'globalThis':
                        return proxy;
                }
                if (!Object.hasOwnProperty.call(target, p) && window.hasOwnProperty(p)) {
                    // @ts-ignore
                    var value = window[p];
                    if (typeof value === 'function')
                        return value.bind(window);
                    return value;
                }
                return target[p];
            },
            has: function () {
                return true;
            }
        });
        this.proxy = proxy;
    }
    ProxySandBox.prototype.active = function () {
        this.running = true;
    };
    ProxySandBox.prototype.inactive = function () {
        this.running = false;
    };
    return ProxySandBox;
}());
exports.ProxySandBox = ProxySandBox;
