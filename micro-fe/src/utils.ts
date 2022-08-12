import { getAppList } from "./appList"
import { match } from 'path-to-regexp'
import { IInternalAppInfo } from "./types"
import { AppStatus } from "./enums"
import { importEntry } from 'import-html-entry'
export const getAppListStatus = () => {
    const actives : IInternalAppInfo[] = []
    const unmounts : IInternalAppInfo[] = []

    const list = getAppList() as IInternalAppInfo[]

    list.forEach((app) => {
        const isActive = match(app.activeRule, {end : false})(location.pathname)

        switch (app.status) {
            case AppStatus.NOT_LOADED:
            case AppStatus.LOADED:
            case AppStatus.LOADED:
            case AppStatus.BOOTSTRAPPING:
            case AppStatus.NOT_MOUNTED:
                isActive && actives.push(app)
                break;
            case AppStatus.MOUNTED:
                !isActive && unmounts.push(app)
                break;
        }
    })

    return {actives, unmounts}
}


export const fetchResource = async (url : string) => {
    return await fetch(url).then(async (res) => await res.text())
}


export function getCompletionURL(src:string | null, baseURI : string) {
    if(!src) return src
    if(/^(https|http)/.test(src)) return src

    return new URL(src, getCompletionBaseURL(baseURI)).toString()
}

export function getCompletionBaseURL(url : string){
    return url.startsWith('//') ? `${location.protocol}${url}` : url
}

export const prefetch = async(app : IInternalAppInfo) => {
    requestIdleCallback(async () => {
        const { getExternalScripts, getExternalStyleSheets } = await importEntry(app.entry)
        requestIdleCallback(getExternalStyleSheets)
        requestIdleCallback(getExternalScripts)
        
    })
}