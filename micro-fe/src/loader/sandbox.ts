export class ProxySandBox {
    proxy : any
    running = false
    constructor(){
        const fakeWindow = Object.create(null)
        const proxy = new Proxy(fakeWindow, {
            set : (target : any, p : string, value:any)=>{
                if(this.running){
                    target[p] = value
                }
                return true
            },
            get(target:any, p:string):any {
                switch(p){
                    // window上的这三个属性都指向window自己
                    case 'window':
                    case 'self':
                    case 'globalThis':
                        return proxy
                }
                if(!Object.hasOwnProperty.call(target,p) && window.hasOwnProperty(p)){
                    // @ts-ignore
                    const value = window[p]
                    if(typeof value === 'function') return value.bind(window)
                    return value
                }
                return target[p]
            },
            has(){
                return true
            }
        })
        this.proxy = proxy
    }

    active(){
        this.running = true
    }

    inactive(){
        this.running = false
    }
}