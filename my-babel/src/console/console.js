/**@type{import('@babel/traverse').TraverseOptions*/

const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const generate = require("@babel/generator").default
const types = require('@babel/types')
const template = require('@babel/template').default

const sourceCode = `
console.log(1);
function func() {
    console.info(2);
}
export default class Clazz {
    say() {
        console.debug(3);
    }
    render() {
        return <div>{console.error(4)}</div>
    }
}
`

const targetClaaeeName = ['log','info','error','debug'].map((item) => `console.${item}`)
const ast = parser.parse(sourceCode, {
    sourceType : "unambiguous",
    plugins : ['jsx']
})

traverse(ast,{
    CallExpression(path,state){
        if(path.node.isNew) return
        const calleeName = path.get('callee').toString()
        if(targetClaaeeName.includes(calleeName)){
            const {line,column} = path.node.loc.start
            const newCode = template.expression(`console.log("filename : ${line}, ${column}")`)()
            newCode.isNew = true
            if(path.findParent(path => path.isJSXElement())){
                path.replaceWith(types.arrayExpression([newCode,path.node]))
                path.skip()
            } else {
                path.insertBefore(newCode)
            }

        }
    }
})

const {code,map} = generate(ast)

console.log(code)