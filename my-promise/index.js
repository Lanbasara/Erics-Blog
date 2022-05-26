const STATE = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending'
}


class MyPromise {
    #thenCbs = []
    #catchCbs = []
    // start state is pending
    #state = STATE.PENDING
    #value
    /**
     * Since we pass onSuccess/onFail function into then as param. We hope these two functions can use 'this' correctly.
     * In this way, the corresponding promise value can be changed in other promise callbacks
     * make sure when we use this in onSuccess/onFail, the 'this' context bind is right
     */
    #onSucessBind = this.#onSucess.bind(this)
    #onFailBind = this.#onFail.bind(this)


    /**
     * new Promise((resolve, reject) => {
     *  some code
     *  resolve()
     * })
     * 
     * function cb = (resolve, reject) => {
     *  some code
     *  resolve()
     * }
     */
    constructor(cb) {
        try {
            cb(this.#onSucessBind, this.#onFailBind)
        } catch (e) {
            this.#onFail(e)
        }
    }


    #runCallbacks() {
        if (this.#state === STATE.FULFILLED) {
            this.#thenCbs.forEach((callback) => {
                callback(this.#value)
            })
            this.#thenCbs = []
        }

        if (this.#state === STATE.REJECTED) {
            this.#catchCbs.forEach((callback) => {
                callback(this.#value)
            })
            this.#catchCbs = []
        }
    }



    /**
     * when resolve function has been called
     * 1. change promise state to fulfilled
     * 2. pass value
     */
    #onSucess(value) {
        queueMicrotask(() => {
            if (this.#state !== STATE.PENDING) return
            /**
             * p.then(() => {
             *  return new Promise((res,rej) => {
             *      res(value)
             *  })
             * }).then()
             * when previous callback return a promise
             * next then callback need to wait that promise resolved
             */
            if (value instanceof MyPromise) {
                value.then(this.#onSucessBind, this.#onFailBind)
                return
            }
            this.#value = value
            this.#state = STATE.FULFILLED
            this.#runCallbacks()
        })

    }

    /**
    * when reject function has been called
    * 1. change promise state to rejected
    * 2. pass value
    */
    #onFail(value) {
        queueMicrotask(() => {
            if (this.#state !== STATE.PENDING) return
            if (value instanceof MyPromise) {
                value.then(this.#onSucessBind, this.#onFailBind)
                return
            }
            /**
             * unCatchedPromiseError
             * if there is no onfail callback when onFaill has been called, it means there is no handler for this promise.
             * we need to throw an specific error
             * In real Promise, it be called unhandledrejection error
             */
            if(this.#catchCbs.length === 0){
                throw new UnCatchedPromiseError(value)
            }
            this.#value = value
            this.#state = STATE.REJECTED
            this.#runCallbacks()
        })
    }

    /**
     * 1. promise.then(() => {}, () => {})
     * 2. return a new promise to implement chainable
     * 2.1 promise.then().catch().then()
     * if promise resolved, these two then callback will be called
     * if thencallback is null(it means we dont care about what happed when promise resolved)
     * just resolve this promise, to pass value to next callback
     * So as catchcallback
     * 2.2 when there is thencallback, resolve this callback's return
     * So as catchcallback
     */
    then(thenCb, catchCb) {
        return new MyPromise((resolve, reject) => {
            this.#thenCbs.push((result) => {
                if (thenCb == null) {
                    resolve(result)
                    return
                }
                try {
                    resolve(thenCb(result))
                } catch (e) {
                    reject(e)
                }

            })

            this.#catchCbs.push((result) => {
                if (catchCb == null) {
                    reject(result)
                    return
                }
                try {
                    resolve(catchCb(result))
                } catch (e) {
                    reject(e)
                }

            })


            this.#runCallbacks()
        })
    }

    /**
     * re-use then since p.then() can take in thencallback and catchcallback as well
     */
    catch(cb) {
        return this.then(undefined, cb)
    }

    /**
     * finally's callback dont accept result, just run cb and pass result to further promise
     */
    finally(cb) {
        return this.then((result) => {
            cb()
            return result
        }, (result) => {
            cb()
            throw result
        })
    }

    /**
     * return a promise which be resolved immediatly
     */
    static resolve(value){
        return new MyPromise((resolve) => {
            resolve(value)
        })
    }

    /**
     * return a promise which be rejected immediatly
     */
    static reject(value){
        return new MyPromise((_,reject) => {
            reject(value)
        })
    }

    /**
     * wait for all promises until all of them resolved or any one of them rejected
     */
    static all(promises){
        return new MyPromise((resolve,reject) => {
            let results = new Array(promises.length)
            let compltedCount = 0;
            for(let i=0;i<promises.length;i++){
                const p = promises[i]
                p.then((result) => {
                    compltedCount++
                    results[i] = result
                    if(compltedCount === promises.length){
                        resolve(results)
                    }
                }).catch(e => {
                    reject(e)
                })
            }
        })
    }

    /**
     * allSettled wait for all promise, and never invoke .catch
     * instead of invoke .then to pass total promises info regardless of success or failure
     */
    static allSettled(promises){
        return new MyPromise((resolve,_) => {
            let results = new Array(promises.length)
            let compltedCount = 0;
            for(let i=0;i<promises.length;i++){
                const p = promises[i]
                p.then((result) => {
                    results[i] = {status : STATE.FULFILLED, value : result}
                }).catch(e => {
                    results[i] = {status : STATE.REJECTED, reason : e}
                }).finally(() => {
                    compltedCount++
                    if(compltedCount === promises.length){
                        resolve(results)
                    }
                })
            }
        })
    }

    /**
     * Just wait for first promise which resolved of rejected
     */
    static race(promises){
        return new MyPromise((resolve,reject) => {
            for(let p of promises){
                p.then((value) => {
                    resolve(value)
                    return
                }).catch((error) => {
                    reject(error)
                    return
                })
            }
        })
    }

    /**
     * Just wait for first promise which resolved.
     * If all promises rejects, pass a error info array as Info
     * Tips: AggregateError Type
     */
    static any(promises){
        return new MyPromise((resolve,reject) => {
            let errorResult = new Array(promises.length)
            let rejectedCount = 0;
            for(let i=0;i<promises.length;i++){
                let p = promises[i]
                p.then(resolve).catch((error) => {
                    rejectedCount++
                    errorResult[i] = error
                    if(rejectedCount === promises.length){
                        reject(new AggregateError(errorResult,'All promises failed'))
                    }
                })
            }
        })
    }
}

/**
 * Impentment of UnCatchedPromiseError, which extends basic Error class
 */
class UnCatchedPromiseError extends Error {
    constructor(error){
        super(error)

        this.stack = `(in promise) ${error?.stack}`
    }
}


module.exports = {
    MyPromise
}