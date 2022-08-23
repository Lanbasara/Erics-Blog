import depedenceManager from './dependenceManager'

let computedId = 0
class Computed {
    constructor(target,getter){
        this.id = computedId++
        this.target = target
        this.getter = getter
    }
    registerReComputed(){
        if(!this.hasBindAutoReCompute){
            this.hasBindAutoReCompute = true
            depedenceManager.beginCollect(this.reComputed,this)
            this.reComputed()
            depedenceManager.endCollect()
        }
    }
    reComputed(){
        this.value = this.getter.call(this.target)
        depedenceManager.trigger(this.id)
    }

    get(){
        this.registerReComputed()
        depedenceManager.collect(this.id)
        return this.value
    }
}

export default function computed(target,name,descriptor){
    let getter = descriptor.get
    const _computed = new Computed(target, getter)

    return {
        enumerable : true,
        configurable : true,
        get(){
            _computed.target = this
            return _computed.get()
        }
    }
}