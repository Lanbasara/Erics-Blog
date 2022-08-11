import { setAppList } from "./appList"
import { IAppInfo } from "./types"

export const registerMicroApps = (appList : Array<IAppInfo>) => {
    setAppList(appList)
}
