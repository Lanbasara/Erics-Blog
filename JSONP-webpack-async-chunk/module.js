/**
 * 保存所有的模块
 * key : moduleId
 * value : (module, exports, require) => void
 */
let modules = {}

/**
 * 通过模块的Id引入模块函数
 */
function require(moduleId){
    let module = {exports : {}};
    modules[moduleId].call(module.exports, module, module.exports, require);
    return module.exports;
}

/**
 * 已经ready的模块
 */
let installedChunks = {
    main : 0,
    title : 0
}
/**
 * 引入具体内容
 */
function requireValue(chunkId){
    let promises = [];
    requestChunkByJSONP(chunkId, promises)
    return Promise.all(promises)
}

function requestChunkByJSONP(chunkId, promises){
    let promise = new Promise((resolve,reject) => {
        installedChunks[chunkId] = [resolve, reject]
    })
    promises.push(promise)
     // 拼接好异步模块资源的url
     let publicPath = 'https://lanbasara-erics-blog-rv9x9pgx25jrr-3000.githubpreview.dev',
     var jsonpUrl = `${publicPath}/${chunkId}`;
     // 使用jsonp请求目标chunk
     let script = document.createElement('script');
     script.setAttribute('src',jsonpUrl);
     document.head.appendChild(script);
}

/**
 * 给模块对象复制赋值
 */
function assignChunkValue(exports, chunkValues){
    for(let key in chunkValues){
        Object.defineProperty(exports, key , {enumerable:true, get: chunkValues[key]})
    }
}

/**
 * 在主文件里定义好的JSONP回调函数
 */
function webpackJsonp(chunkId, asyncChunk) {
    let resolves = [];
    let chunkData = installedChunks[chunkId];
    installedChunks[chunkId] = 0;
    resolves.push(chunkData[0]);

    for(let moduleId in asyncChunk){
        modules[moduleId] = asyncChunk[moduleId]
    }
    resolves.forEach(res => res())
}




// title.js

webpackJsonp('title', {
    './title.js' : ((module,exports, require) => {
        const __VALUE__ = ('This is title');
        assignChunkValue(exports, {
            "default" : () => __VALUE__
        })
    })
})