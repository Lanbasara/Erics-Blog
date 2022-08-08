export interface IAppInfo {
    name : string;
    entry : string;
    container : string;
    activeRule : string;
}

export const registerMicroApps = (appList : Array<IAppInfo>) => {
    setAppList(appList)
}

let appList : Array<IAppInfo> = []

export const setAppList = (list : Array<IAppInfo>) => {
    appList = list
}

export const getAppList = () => {
    return appList
}