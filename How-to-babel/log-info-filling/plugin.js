const generator = require('@babel/generator').default
module.exports = function({types,template}){
    return {
        visitor : {
            CallExpression (path) {
                if(path.node.isNew) return
                let reg = /console\.\w+/
                // use AST node generator code string which can help us analyse ATS node more efficiently
                // its very bright to generator code in ast traverse process
                const calleeName = generator(path.node.callee).code
                // or use path toString method
                // const callName = path.get('callee').toString()
                // console.log('calleeName is',calleeName,reg.test(calleeName))
                if(reg.test(calleeName)){
                    let resNode = types.stringLiteral(`${path.node.arguments[0]?.name || String(path.node.arguments[0]?.value)} is`)
                    path.node.arguments.unshift(resNode)
                    const { column, line } = path.node.loc.start
                    const newNode = template.expression(`console.log("line is ${line}, column is ${column}")`)()
                    newNode.isNew = true
                    if(path.findParent(path => path.isJSXElement())){
                        path.replaceWith(types.arrayExpression([newNode, path.node]))
                        path.skip()
                    } else {
                        path.insertBefore(newNode)
                    }
                }
            }
        }
    }
}