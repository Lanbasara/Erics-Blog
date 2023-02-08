const { transformFromAstSync } = require("@babel/core")

const parser = require('@babel/parser')

const autoTrackPlugin = require('./plugin')

const fs = require('fs')

const path = require('path')

const sourceCode = fs.readFileSync(path.join(__dirname,"../../../asset/auto-track.js"),{
    encoding : "utf-8"
})

const ast = parser.parse(sourceCode,{
    sourceType : "unambiguous"
})




const {code} = transformFromAstSync(ast,sourceCode,{
    plugins : [
        [autoTrackPlugin, {
            trackerPath: 'tracker'
        }]
    ]
})

console.log(code)

fs.writeFileSync(path.join(__dirname,'../../../dist/auto-track.js'),code,{
    encoding : "utf-8",
})