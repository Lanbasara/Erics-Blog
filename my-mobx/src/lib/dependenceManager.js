class DependenceManager {
  Dep = null;
  _store = {};
  beginCollect(handler) {
    DependenceManager.Dep = handler;
  }
  collect(id) {
    if (DependenceManager.Dep) {
      this._store[id] = this._store[id] || {};
      this._store[id].watchers = this._store[id].watchers || [];
      this._store[id].watchers.push(DependenceManager.Dep);
    }
  }
  endCollect() {
    DependenceManager.Dep = null;
  }
  trigger(id) {
    const store = this._store[id];
    if (store && store.watchers) {
      store.watchers.forEach((s) => {
        s.call(this);
      });
    }
  }
}

export default new DependenceManager();
