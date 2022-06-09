function myAsync(generator) {
    function handler(iteratorRes){
        if(iteratorRes.done) return
        const value = iteratorRes.value
        if(value instanceof Promise){
            value.then(res => {
                handler(iterator.next(res))
            })
            .catch(e => iterator.throw(e))
        }
    }
    let iterator = generator()

    try {
        handler(iterator.next())
    } catch(e){
        console.log('my-async has error',e)
        iterator.throw(e)
    }
}




module.exports = {
    myAsync
}