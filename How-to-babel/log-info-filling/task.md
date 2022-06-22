# 插入函数的调用参数

在使用console.xx 打印日志的时候，可以填充一些信息字符，例如文件信息、行列信息、统一格式的说明性文字等.

## 使用js脚本完成任务

```
const parse = require('@babel/parser')
const traverse = require("@babel/traverse").default
const generator = require('@babel/generator').default
const types = require("@babel/types")

const sourceCode = `
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
`;

const ast = parse.parse(sourceCode,{
    sourceType : "unambiguous",
    plugins : ['jsx']
})


traverse(ast, {
    CallExpression (path) {
        if(types.isMemberExpression(path.node.callee) && path.node.callee.object.name === 'console'){
            let resNode = types.stringLiteral(`${path.node.arguments[0]?.name || String(path.node.arguments[0]?.value)} is`)
            path.node.arguments.unshift(resNode)
        }
    }
});


const {code : newCode, map} = generator(ast)
console.log('newCode is',newCode)
```

