import { AppStatus } from "src/enums";
import { IAppInfo, IInternalAppInfo, ILifeCycle } from "src/types";

let lifeCycle :ILifeCycle = {};

export const setLifeCycle = (list : ILifeCycle) => {
    lifeCycle = list
}

export const runBeforeLoad = async (app:IInternalAppInfo){
    app.status = AppStatus.LOADED
    await runLifeCycle("beforeLoad",app)
    
    // TODO : 加载子应用资源
    app = await 加载子应用资源
    app.status = AppStatus.LOADED
}

export const runBoostrap = async (app : IInternalAppInfo) => {
    if(app.status !== AppStatus.LOADED){
        return app
    }
    app.status = AppStatus.BOOTSTRAPPING
    await app.boostrap?.(app)
    app.status = AppStatus.NOT_MOUNTED
}


export const runMounted = async (app : IInternalAppInfo) => {
    app.status = AppStatus.MOUNTING
    await app.mount?.(app)
    app.status = AppStatus.MOUNTED
    await runLifeCycle('unmounted',app)
}

const runLifeCycle = async (name : keyof ILifeCycle, app : IAppInfo) => {
    const fn = lifeCycle[name]
    if(fn instanceof Array){
        await Promise.all(fn.map((item) => item(app)));
    } else {
        await fn?.(app)
    }
}