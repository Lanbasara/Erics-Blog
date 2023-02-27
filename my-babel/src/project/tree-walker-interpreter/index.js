/**
 * Tree walk interpreter is a kind of interpreter
 * which evaluate code by interprtering ast instand of
 * evaluate from lower code
 * 
 */

const parser = require("@babel/parser")
const { codeFrameColumns } = require("@babel/code-frame")


const sourceCode = `
 const a = 1 + 2;
 console.log(a);
 function add(a,b){
    return a+b
 }
 console.log(add(1,2))
`;

/**
 * we need a scope when we would like to implement invoke
 */
class Scope {
    constructor(parentScope){
        this.parent = parentScope
        this.declarations = {}
    }

    set(name,value){
        this.declarations[name] = value
    }

    getLocal(name){
        return this.declarations[name]
    }

    get(name){
        let res = this.getLocal(name)
        if(res == undefined && this.parent){
            res = this.parent.get(name)
        }
        return res
    }

    has(name){
        return !!this.getLocal(name)
    }

}


const ast = parser.parse(sourceCode,{
    sourceType : "unambiguous"
})

const evaluator = (function(){

    const astInterpreters = {
        Program(node,scope){
            node.body.forEach(item => {
                evaluate(item,scope)
            })
        },
        VariableDeclaration(node, scope) {
            node.declarations.forEach((item) => {
                evaluate(item, scope);
            });
        },
        VariableDeclarator(node,scope){
            const declarName = evaluate(node.id,scope)
            if(scope.has(declarName)){
                throw Error('duplicate declare variable:' + declarName)
            } else {
                /**
                 * set a new value into scope
                 */
                scope.set(declarName,evaluate(node.init,scope))
            }
        },
        Identifier(node){
            return node.name
        },
        BinaryExpression(node,scope, isCall=false){
            const leftValue = isCall ? scope.get(evaluate(node.left,scope)):  evaluate(node.left,scope)
            const rightValue = isCall ? scope.get(evaluate(node.right,scope)) : evaluate(node.right,scope)
            const operator = node.operator
            switch(operator){
                case "+":
                    return leftValue + rightValue
                case "-":
                    return leftValue - rightValue
                case "*":
                    return leftValue * rightValue
                case "/":
                    return leftValue / rightValue
                default:
                    throw Error('upsupported operator：' + node.operator);
            }
        },
        NumericLiteral(node,scope){
            return node.value
        },
        ExpressionStatement(node,scope){
            return evaluate(node.expression,scope)
        },
        CallExpression(node,scope){
            const fn = node.callee.type === "Identifier" ? scope.get(evaluate(node.callee,scope))   : evaluate(node.callee,scope)
            const arguments = node.arguments.map(item => {
                if(item.type === 'Identifier'){
                    return scope.get(item.name)
                } else {
                    return evaluate(item,scope)
                }
            })

            if(node.callee.type === 'MemberExpression'){
                const obj = evaluate(node.callee.object,scope)
                return fn.apply(obj,arguments)
            } else {
                return fn.apply(null,arguments)
            }

        },
        MemberExpression(node,scope){
            const obj = scope.get(evaluate(node.object))
            const property = evaluate(node.property)
            return obj[property]
        },
        FunctionDeclaration(node,scope){
            const declarName = evaluate(node.id)
            if(scope.has(declarName)){
                throw Error('duplicate declare variable：' + declarName);
            } else {
                scope.set(declarName, function(...args){
                    const funcScope = new Scope(scope)

                    node.params.forEach((item,index) => {
                        funcScope.set(evaluate(item), args[index])
                    })

                    funcScope.set('this',this)

                    return evaluate(node.body,funcScope)

                })

               

            }
        },
        BlockStatement(node,scope){
            for (let i = 0; i< node.body.length; i++) {
                if (node.body[i].type === 'ReturnStatement') {
                    return evaluate(node.body[i], scope);
                }
                evaluate(node.body[i], scope);
            }
        },
        ReturnStatement(node, scope) {
            return evaluate(node.argument, scope, true);
        },
    }


    const evaluate = (node,scope,extra) => {
        try {
            return astInterpreters[node.type](node,scope,extra)
        } catch(e){
            if(e && e.message && e.message.indexOf('astInterpreters[node.type] is not a function') !== -1){
                console.error('unsupported ast type: ' + node.type)
                console.error(codeFrameColumns(sourceCode, node.loc, {
                    highlightCode: true
                }));
            } else {
                console.error(e.message);
                console.error(codeFrameColumns(sourceCode, node.loc, {
                    highlightCode: true
                }));  
            }
        }
    }


    return {
        evaluate
    }
})()


const globalScope = new Scope()
globalScope.set("console", {
    log: function (...args) {
        console.log(...args);
    },
    error: function (...args) {
        console.log(...args);
    },
    warn: function (...args) {
        console.log(...args);
    },
})
evaluator.evaluate(ast.program,globalScope)
console.log()