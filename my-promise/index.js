const STATE = {
    FULFILLED : 'fulfilled',
    REJECTED : 'rejected',
    PENDING : 'pending'
}


class MyPromise {
    #thenCbs = []
    #catchCbs = []
    #state
    #value
    constructor(cb){
        try {
            cb(this.#onSucess, this.#onFail)
        } catch(e){
            this.#onFail(e)
        }
    }

    #runCbs(){
        if(this.#state === STATE.FULFILLED){
            this.#thenCbs.forEach((callback) => {
                callback(this.#value)
            })
            this.#thenCbs = []
        }

        if(this.#state === STATE.REJECTED){
            this.#catchCbs.forEach((callback) => {
                callback(this.#value)
            })
            this.#catchCbs = []
        }
    }

    #onSucess(value){
        if(this.#state !== STATE.PENDING) return
        this.#value = value
        this.#state = STATE.FULFILLED
    }

    #onFail(value){
        if(this.#state !== STATE.PENDING) return
        this.#value = value
        this.#state = STATE.REJECTED
    }

    then(cb){
        this.#thenCbs.push(cb)

        this.#runCbs()
    }
}




module.exports = {
    MyPromise
}