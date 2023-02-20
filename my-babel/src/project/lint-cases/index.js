const parser = require('@babel/parser')

const { transformFromAstSync } = require("@babel/core")

const fs = require('fs')

const path = require('path')

const lintPlugin = require('./plugin')

const sourceCode = fs.readFileSync(path.join(__dirname,"./source.js"),{encoding : "utf-8"})


const { code } =  transformFromAstSync(parser.parse(sourceCode,{
    sourceType : "unambiguous",
}),sourceCode,{
    plugins : [lintPlugin]
})

console.log(code)