import { IInternalAppInfo } from "src/types";
// @ts-ignore
import { fetchResource } from "src/utils";
// @ts-ignore
import { parseHTML } from "./parse";
import { importEntry } from 'import-html-entry'
import { ProxySandBox } from "./sandbox";

export const loadHTML = async (app : IInternalAppInfo) => {
    const { container, entry } = app

    // const htmlFile = await fetchResource(entry)
    // const fakeContainer = document.createElement('div')
    // fakeContainer.innerHTML = htmlFile
    const { template, getExternalScripts, getExternalStyleSheets } = await importEntry(entry)
    const dom = document.querySelector(container)

    if(!dom){
        throw new Error('not found container')
    }

    // dom.replaceChildren()
    // dom.appendChild(fakeContainer)

    // const {scripts, links, inlineScript} = parseHTML(fakeContainer, app)
    // await Promise.all(links.map((link) => fetchResource(link)))

    // const jsCode = (await Promise.all(scripts.map((script) => fetchResource(script)))).concat(inlineScript)

    dom.innerHTML = template

    await getExternalStyleSheets()
    const jsCode = await getExternalScripts()

    jsCode.forEach((script) => {
        const liftCycle = runJs(script, app)
        if(liftCycle){
            app.boostrap = liftCycle.boostrap
            app.mount = liftCycle.mount
            app.unmount = liftCycle.unmount
        }
    })

    return app
}

const runJs = (value : string, app:IInternalAppInfo) => {
    if(!app.proxy){
        app.proxy = new ProxySandBox()
        // 将沙箱挂在全局属性上
        // @ts-ignore
        window.__CURRENT_PROXY__ = app.proxy.proxy
    }
    app.proxy.active()

    const code = `
    return (window => {
        ${value}
        return window['${app.name}']
    })(window.__CURRENT_PROXY__)
    `

    return new Function(code)()
}