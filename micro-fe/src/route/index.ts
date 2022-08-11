import { EventType } from "src/types"

const originalPush = window.history.pushState
const originalReplace = window.history.replaceState

let historyEvent: PopStateEvent | null = null

export const hijackRoute = () => {
    window.history.pushState = (...args) => {
        originalPush.apply(window.history,args)
        // TODO: pushState了之后，如何处理子应用的加载
    }
    window.history.replaceState = (...args) => {
        originalReplace.apply(window.history,args)
        // TODO: pushState了之后，如何处理子应用的加载
    }

    window.addEventListener('hashchange' ,() => {})

    window.addEventListener('popstate', () => {})

    window.addEventListener = hijackEventListener(window.addEventListener)

    window.removeEventListener = hijackEventListener(window.removeEventListener)
}

const capturedListeners : Record<EventType, Function[]> = {
    hashchange : [],
    popstate : []
}


const hasListeners = (name : EventType, fn : Function) => {
    return capturedListeners[name].filter((listener) => listener === fn).length
}

const hijackEventListener = (func : Function) : any => {
    return function(name : string, fn : Function) {
        // 如果是hashchanged 或者 popstate事件， 要保留定义的回调函数
        if(name === 'hashchange' || name === 'popstate'){
            if(!hasListeners(name,fn)){
                capturedListeners[name].push(fn)
                return
            } else {
                capturedListeners[name] = capturedListeners[name].filter((listener) => listener !== fn)
            }
        }
        return func.apply(window, arguments)
    }
}

export function callCapturedListeners(){
    if(historyEvent){
        Object.keys(capturedListeners).forEach((eventName) => {
            const listeners = capturedListeners[eventName as EventType]
            if(listeners.length){
                listeners.forEach((listener) => {
                    // @ts-ignore
                    listener.call(this, historyEvent)
                })
            }
        })
        historyEvent =  null
    }
}