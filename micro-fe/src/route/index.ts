import { EventType } from "../types"
import { runBeforeLoad, runBoostrap, runMounted, runUnmounted } from "../lifeCycle"
import { getAppListStatus } from "../utils"

const capturedListeners : Record<EventType, Function[]> = {
    hashchange : [],
    popstate : []
}


const originalPush = window.history.pushState
const originalReplace = window.history.replaceState

let historyEvent: PopStateEvent | null = null

let lastUrl : string | null = null

export const reroute = (url : string) => {
    if(url !== lastUrl){
        const { actives , unmounts } = getAppListStatus()// 匹配路由， 寻找符合条件的子应用
        Promise.all(
            unmounts.map(async (app) => {
            await runUnmounted(app)
        }).concat(
            actives.map(async (app) => {
                await runBeforeLoad(app)
                await runBoostrap(app)
                await runMounted(app)
            })
        )
        ).then(() => {
            callCapturedListeners()
        })
    }
    lastUrl = url || location.href
}


const handleUrlChange = () => {
    reroute(location.href)
}

export const hijackRoute = () => {
    window.history.pushState = (...args) => {
        originalPush.apply(window.history,args)
        // TODO: pushState了之后，如何处理子应用的加载
        historyEvent = new PopStateEvent("popstate")
        // @ts-ignore
        args[2] && reroute(args[2])
    }
    window.history.replaceState = (...args) => {
        originalReplace.apply(window.history,args)
        // TODO: pushState了之后，如何处理子应用的加载
        historyEvent = new PopStateEvent('popstate')
        // @ts-ignore
        args[2] && reroute(args[2])
    }

    window.addEventListener('hashchange' ,handleUrlChange)

    window.addEventListener('popstate', handleUrlChange)

    window.addEventListener = hijackEventListener(window.addEventListener)

    window.removeEventListener = hijackEventListener(window.removeEventListener)
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