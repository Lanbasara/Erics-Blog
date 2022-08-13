import { getAppList, setAppList } from "./appList"
import { setLifeCycle } from "./lifeCycle"
import { IAppInfo, IInternalAppInfo, ILifeCycle } from "./types"
import { hijackRoute, reroute } from "./route"
import { AppStatus } from "./enums"
import { prefetch } from "./utils"

export const registerMicroApps = (
    appList : Array<IAppInfo>, 
    lifeCycle?:ILifeCycle
) => {
    setAppList(appList)
    lifeCycle && setLifeCycle(lifeCycle)
}


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

