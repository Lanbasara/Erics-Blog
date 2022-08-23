class DependenceManager{
  Dep = null
  Target = null
  #store = {}

  beginCollect(handler,target){
    DependenceManager.Dep = handler
    DependenceManager.Target = target
  }

  endCollect(){
    if(DependenceManager.Dep){
      DependenceManager.Dep = null
    }
    if(DependenceManager.Target){
      DependenceManager.Target = null
    }
  }

  collect(id){
    if(DependenceManager.Dep){
      this.#store[id] = this.#store[id] || {}
      this.#store[id].watchers = this.#store[id].watchers || []
      this.#store[id].target = DependenceManager.Target
      this.#store[id].watchers.push(DependenceManager.Dep)
    }
  }

  trigger(id){
    const store = this.#store[id]
    if(store && store.watchers){
      store.watchers.forEach(cb => {
        cb.call(store.target || this)
      });
    }
  }


}

export default new DependenceManager()