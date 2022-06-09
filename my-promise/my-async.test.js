// https://jestjs.io/docs/asynchronous
const { myAsync } = require("./my-async")
describe('my-async-test', () => {
    const getPromise = function (value, delay,fail=false) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                fail ? rej(value): res(value);
            }, delay);
        });
    };
    it('with promise', (done) => {
        let getABC = function* () {
            try {
                const a = yield getPromise("a", 2000).then(res => `${res}${res}`);
                const b = yield getPromise("b", 1000);
                const c = yield getPromise("c", 1000);
                let res = [a,b,c]
                expect(res).toEqual(["aa","b","c"])
                done()
            } catch (e) {
                done(e)
                console.log("e is", e);
            }
        }
        return myAsync(getABC);
    },5000)

    it('with error', (done) => {
        let getABC = function* () {
            try {
                const a = yield getPromise("a", 2000).then(res => `${res}${res}`);
                const b = yield getPromise("b", 1000,true);
                const c = yield getPromise("c", 1000);
                let res = [a,b,c]
                expect(res).toEqual(["aa","b","c"])
                done()
            } catch (e) {
                expect(e).toBe("b")
                console.log("e is", e);
                done()
            }
        }
        return myAsync(getABC);
    },5000)
})