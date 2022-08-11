export interface IAppInfo {
    name : string;
    entry : string;
    container : string;
    activeRule : string;
}


export type EventType = 'hashchange' | 'popstate'