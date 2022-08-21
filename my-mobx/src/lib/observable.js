import dependenceManager from "./dependenceManager";

let observableId = 0;

class Observable {
  id = 0;
  constructor(v) {
    this.id = observableId++;
    this.value = v;
  }
  set(v) {
    if (Array.isArray(v)) {
      this._wrapArray(v);
    } else {
      this.value = v;
    }
    dependenceManager.trigger(this.id);
  }
  _wrapArray(arr) {
    this.value = new Proxy(arr, {
      set(obj, key, value) {
        obj[key] = value;
        // dependenceManager.trigger(this.id);
        if (key !== "length") {
          dependenceManager.trigger(this.id);
        }
        return true;
      },
    });
  }
  get() {
    dependenceManager.collect(this.id);
    return this.value;
  }
}

function createObservable(target) {
  if (typeof target === "object") {
    for (let property in target) {
      if (target.hasOwnProperty(property)) {
        const observable = new Observable(target[property]);
        Object.defineProperty(target, property, {
          get() {
            return observable.get();
          },
          set(value) {
            return observable.set(value);
          },
        });
        createObservable(target[property]);
      }
    }
  }
}

export default function observable(target, name, descriptor) {
  const v = descriptor.initializer.call(this);
  createObservable(v);
  const o = new Observable(v);

  return {
    enumerable: true,
    configurable: true,
    get: function () {
      return o.get();
    },
    set: function (v) {
      return o.set(v);
    },
  };
}
