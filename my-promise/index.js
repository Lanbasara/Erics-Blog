const STATE = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending'
}


class MyPromise {
    #thenCbs = []
    #catchCbs = []
    #state = STATE.PENDING
    #value
    // make sure when we use this in onSuccess/onFail, the 'this' context bind is right
    #onSucessBind = this.#onSucess.bind(this)
    #onFailBind = this.#onFail.bind(this)


    /**
     * new Promise((resolve, reject) => {
     *  some code
     * })
     * 
     * function cb = (resolve, reject) => {
     *  some code
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

    finally(cb) {
        return this.then((result) => {
            cb()
            return result
        }, (result) => {
            cb()
            throw result
        })
    }
}




module.exports = {
    MyPromise
}