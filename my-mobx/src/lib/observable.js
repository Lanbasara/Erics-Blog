 import depedenceManager from './dependenceManager'
 
 let observableId = 0

 class Observable {
  constructor(v){
    this.id = observableId++
    this.value = v
  }
  get(){
    depedenceManager.collect(this.id)
    return this.value
  }
  set(value){
    if(Array.isArray(value)){
      this._wrapArray(value)
    } else {
      this.value = value
    }
    depedenceManager.trigger(this.id)
  }

  _wrapArray(value){
    this.value = new Proxy(value, {
      set(obj,key,value){
        obj[key] = value
        if(key !== 'length'){
          depedenceManager.trigger(this.id)
        }
        return true
      }
    })
  }
 }

 function observable(target,name, descriptor){
  let fn = descriptor.value || descriptor.initializer
  if(!fn){
    throw Error('observal fn error')
  }
  let value = fn.call(this)
  createObservable(value)
  let o = new Observable(value)

  return {
    enumerable : true,
    configurable : true,
    get(){
      return o.get()
    },
    set(value){
      createObservable(value)
      return o.set(value)
    }
  }
 }

 function createObservable(target){
  if(typeof target === 'object'){
    for(let key in target){
      if(Object.hasOwnProperty.call(target,key)){
        const observable = new Observable(target[key])
        Object.defineProperty(target,key, {
          get(){
            return observable.get()
          },
          set(value){
            return observable.set(value)
          }
        })
        createObservable(target[key])
      }
    }
  }
 }


 export default observable