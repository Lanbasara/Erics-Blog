let res = 'res'
    console.log(1);
    console.log(res)

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            // JSX
            return <div>{console.error(4)}</div>
        }
    }