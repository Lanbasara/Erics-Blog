const cache : Record<string,any> = {}

export const setCatch = (key:string,url:string,value:any) => {
    cache[key] = {
        ...cache[key],
        [url] : value
    }
}


export const getCache = (key:string,url : string) => {
    if(cache[key]){
        return cache[key][url]
    }
}