// https://jestjs.io/docs/asynchronous
const { myAsync } = require("./my-async")
describe('my-async-test', () => {
    const getPromise = function (value, delay, fail = false) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                fail ? rej(value) : res(value);
            }, delay);
        });
    };
    it('with promise', (done) => {
        let getABC = function* () {
            try {
                const a = yield getPromise("a", 500).then(res => `${res}${res}`);
                const b = yield getPromise("b", 500);
                const c = yield getPromise("c", 500);
                let res = [a, b, c]
                expect(res).toEqual(["aa", "b", "c"])
                done()
            } catch (e) {
                done(e)
                console.log("e is", e);
            }
        }
        myAsync(getABC)();
    }, 5000)

    it('with error', (done) => {
        let getABC = function* () {
            try {
                const a = yield getPromise("a", 500).then(res => `${res}${res}`);
                const b = yield getPromise("b", 500, true);
                const c = yield getPromise("c", 500);
                let res = [a, b, c]
                expect(res).toEqual(["aa", "b", "c"])
                done()
            } catch (e) {
                console.log("e is", e);
                expect(e).toBe("b")
                done()
            }
        }
        myAsync(getABC)().catch(e => {
            expect(e).toBe('b')
        });
    }, 5000)

    it('with await outer', async () => {
        let getABC = function* () {
            try {
                const a = yield getPromise("a", 500).then(res => `${res}${res}`);
                const b = yield getPromise("b", 500);
                const c = yield getPromise("c", 500);
                let res = [a, b, c]
                return res
            } catch (e) {
                console.log('e is', e)
            }
        }
        const res = await myAsync(getABC)();
        expect(res).toEqual(["aa", 'b', 'c'])
    }, 5000)

    it('with await outer throw error', async () => {
        let getABC = function* () {
            try {
                const a = yield getPromise("a", 500).then(res => `${res}${res}`);
                // error happened
                const b = yield getPromise("b", 500, true);
                const c = yield getPromise("c", 500);
                let res = [a, b, c]
                return res
            } catch (e) {
                console.log('e is', e)
            }
        }
        try {
            const res = await myAsync(getABC)();
        } catch(e){
            console.log('e is',e)
            expect(e).toBe('b')
        }
    }, 5000)
})