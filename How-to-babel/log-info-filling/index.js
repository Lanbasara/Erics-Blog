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
    // call this method when node is CallExpression
    CallExpression (path) {
        // if callee is MemberExpresssion
        if(types.isMemberExpression(path.node.callee) && path.node.callee.object.name === 'console'){
            // create stringLiteral type node
            let resNode = types.stringLiteral(`${path.node.arguments[0]?.name || String(path.node.arguments[0]?.value)} is`)
            path.node.arguments.unshift(resNode)
        }
    }
});


const {code : newCode, map} = generator(ast)
console.log('newCode is',newCode)