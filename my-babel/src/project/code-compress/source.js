function a(){
    let b = 1
    const c = 2

    for(let i=0;i<10;i++){
        if(i>5){
         continue
         console.log('dsadsad')
        }
        if(i>9){
            break
            console.log('dsadasd')
        }
        console.log('dsds')
     }
    
    return c
    
    console.log('this is deaded code')
    
    function d(){}
    var e = 3
    
  }

  a()

function func() {
    const num1 = 1;
    const num2 = 2;
    const num3 = /*@__PURE__*/add(1, 2);
    const num4 = add(3, 4);
    const num5 = 2
    console.log(num2);
    return num2;
    console.log(num1);
    function add (aaa, bbb) {
        return aaa + bbb;
    }
}
func();