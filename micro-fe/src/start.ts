import { getAppList, setAppList } from "./appList"
import { AppStatus } from "./enums"
import { setLifeCycle } from "./lifeCycle"
import { hijackRoute, reroute } from "./route"
import { IAppInfo, IInternalAppInfo, ILifeCycle } from "./types"
import { prefetch } from "./utils"

export const start = () => {
    const list = getAppList()
    if(!list.length){
        throw new Error('Please register app first')
    }

    hijackRoute()

    reroute(window.location.href)

    list.forEach((app) => {
        if((app as IInternalAppInfo).status === AppStatus.NOT_LOADED){
            prefetch(app as IInternalAppInfo)
        }
    })
}


export const registerMicroApps = (appList : Array<IAppInfo>, lifeCycle?:ILifeCycle) => {
    setAppList(appList)
    lifeCycle && setLifeCycle(lifeCycle)
}

