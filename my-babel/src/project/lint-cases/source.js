/**
 * wrong loop direction
 */

for (var i = 0; i < 10; i--) {
}

for (var i = 10; i >= 0; i++) {
}


// xxx
function a(){
    function b(){
        foo = '111'
    }
    b()
}

function foo() {}
// xxx
foo();


a == b
foo == true
bananas != 1
value == undefined
typeof foo == 'undefined'
'hello' != 'world'
0 == 0
true == true