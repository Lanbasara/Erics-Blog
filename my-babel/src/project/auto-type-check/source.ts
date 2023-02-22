function add<T>(a: T, b: T) {
    return a + b;
}
add<number>(1, '2');


let a: string;

a = 111;


function add2(a: number, b: number): number{
    return a + b;
}
add2(1, '2');


type Res<Param> = Param extends string ? number : string;
function add3<T>(a: T, b: T) {
    return a + b;
}
add3<Res<1>>(1, '2');
