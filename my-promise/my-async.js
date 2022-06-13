function myAsync(generator, ...params) {
    return function(){
        return new Promise((res,rej) => {
            function handler(iteratorRes){
                if(iteratorRes.done){
                    return res(iteratorRes.value)
                }
                const value = iteratorRes.value
                if(value instanceof Promise){
                    value.then(res => {
                        handler(iterator.next(res))
                    })
                    .catch(e => {
                        iterator.throw(e)
                        rej(e)
                    })
                }
            }
            let iterator = generator.apply(this,Array.from(arguments).concat(params))
        
            try {
                handler(iterator.next())
            } catch(e){
                rej(e)
            }
        })
    }
}


module.exports = {
    myAsync
}