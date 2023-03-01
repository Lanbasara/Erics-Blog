const { createMacro } = require("babel-plugin-macros")

function style({references,state, babel}){
    const { default : referencePaths } = references
    referencePaths.forEach(path => {
        const styleObjStr = path.parentPath.get('quasi.quasis')[0].node.value.cooked
        const styleArray = styleObjStr.trim().split('\n')
        const obj = {}
        styleArray.forEach(item => {
            if(item!==''){
                let [key,value] = item.split(':')
                key = key.trim()
                obj[key] = value.slice(0,value.length-1).trim()
            }
        })
        const astArray = Object.entries(obj).map(([key,value]) => {
            console.log(key,value)
            return babel.types.objectProperty(babel.types.Identifier(key),babel.types.StringLiteral(value))
        })
        const ast = babel.types.ObjectExpression(astArray)
        path.parentPath.replaceWith(ast);
    });
}


module.exports = createMacro(style)