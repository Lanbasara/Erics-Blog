const path = require('path')
const fs = require('fs-extra')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

/**
 * Todo: use set to remember the module which has been traversed
 */
const visited = new Set()

class DepsNode {
    constructor(path,imports,exports){
        this.path = path || '',
        this.imports = imports || {},
        this.exports = exports || [],
        this.subModules = {}
    }
}

const IMPORT_TYPE = {
    DEFAULT : "default",
    DECONTRUCT : "decontruct",
    ALL : "all"
}

const EXPORT_TYPE = {
    NAMED : "named",
    DEFAULT : "default",
    ALL : "all"
}


function getAbsPathFromTwoRelative(from,to){
    return path.resolve(path.dirname(from),to)
}


function getImportTemp(specifiersPath){
    const type = specifiersPath.node.type;
    switch(type){
        case "ImportSpecifier":
            return {
                type : IMPORT_TYPE.DECONTRUCT,
                imported : specifiersPath.get('imported').node.name,
                local :  specifiersPath.get('local').node.name,
            }
        case "ImportDefaultSpecifier":
            return {
                type : IMPORT_TYPE.DEFAULT,
                local : specifiersPath.get('local').node.name
            }
        case "ImportNamespaceSpecifier":
            return {
                type : IMPORT_TYPE.ALL,
                local : specifiersPath.get('local').node.name,
            }
        default :
            return {

            }
    }
}
const depsGraph = {
    root : new DepsNode(),
    allModules : {}
}
const entryPath = path.join(__dirname, './test/index.js')
// const entryContent = fs.readFileSync(entryPath,{encoding : "utf-8"})

function traverseModule(filePath,modules,allModules){
    /**
     * step1 : read the file
     */
    const fileContent = fs.readFileSync(filePath,{encoding:"utf-8"})
    /**
     * step2 : parse the file into ast 
     */
    const ast = parser.parse(fileContent,{sourceType:"unambiguous"})


    modules.path = filePath

    let temp

    /**
     * step3 : traverse the ast and find the imports and exports
     */

    traverse(ast,{
        ImportDeclaration(currPath){
            const sourcePathRelative = currPath.get('source').node.value;
            const sourcePathAbs = getAbsPathFromTwoRelative(filePath,sourcePathRelative)
            const imports = currPath.get('specifiers').map(sp => {
                return getImportTemp(sp)
            })
            modules.imports[sourcePathAbs] = imports
            const subModules = new DepsNode()
            temp = traverseModule(sourcePathAbs,subModules,allModules)
            modules.subModules = subModules
        },
        ExportNamedDeclaration(currPath){
            const exports = currPath.get('specifiers').map(sp => {
                return {
                    type : EXPORT_TYPE.NAMED,
                    exported : sp.get('exported').node.name,
                    local : sp.get("local").node.name,
                }
            })
            modules.exports.push({
                fromPath : filePath,
                content : exports
            })
        },
        ExportDefaultDeclaration(currPath){
            const type = currPath.get("declaration").node.type
            if(type === "Identifier"){
                modules.exports.push({
                    fromPath : filePath,
                    content : [{
                        type : EXPORT_TYPE.DEFAULT,
                        name : currPath.get("declaration").node.name
                    }]
                })
            } else if(currPath.get("declaration").isAssignmentExpression()){
                modules.exports.push({
                    fromPath : filePath,
                    content : [{
                        type : EXPORT_TYPE.DEFAULT,
                        name : currPath.get("declaration.left").node.name
                    }]
                })
            }
        },
    })

    modules.subModules = temp

    /**
     * step4 : put the node module into allModules
     */
    allModules[filePath] = modules

    return modules
}


traverseModule(entryPath,depsGraph.root,depsGraph.allModules)

console.log(depsGraph)
