# 案例：插入函数调用参数

1. 使用parser.parse将代码字符串转成AST

2. 使用traverse,遍历AST,并且根据需求，在需要的节点被遍历到的时候修改AST

3. 使用generator，将AST再转义为新的代码字符串

4. path是节点的路径，通过path.node可以访问到对应的AST节点

5. 使用path上的各类ast，对AST节点进行操作，例如插入新节点

6. 使用template或者types上的api, 生成所需要的AST的节点，例如一个新的语句


## Babel插件写法

Babel的插件，会自动按照parse，traverse，generator的流程来走，插件只需要提供visitor

```js
/**
 * @api 封装了types,templates等常用api
 * @options 提供调用选项
 */
module.exports = function(api,options){
    return {
        visitor : {
            CallExpression(path,state){

            }
        }
    }
}


```