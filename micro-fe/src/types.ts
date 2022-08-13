import { AppStatus } from "./enums";

export interface IAppInfo {
    name : string;
    entry : string;
    container : string;
    activeRule : string;
}

export interface IInternalAppInfo extends IAppInfo {
    status : AppStatus
    boostrap?: LifeCycle
    mount?:LifeCycle
    unmount?:LifeCycle
    proxy : any
}

export interface ILifeCycle {
    beforeLoad? : LifeCycle | LifeCycle[]; 
    mounted? : LifeCycle | LifeCycle[]; 
    unmounted? : LifeCycle | LifeCycle[]; 
}

export type LifeCycle = (app : IAppInfo) => Promise<any>

export type EventType = 'hashchange' | 'popstate'