const parser = require('@babel/parser')
const { transformFromAstSync } = require("@babel/core")

const path = require('path')

const fs = require('fs-extra')

const autoTypeCheck = require('./plugin')

const sourceCode = fs.readFileSync(path.join(__dirname,'./source.ts'),{encoding : "utf-8"})

const { code } = transformFromAstSync(parser.parse(sourceCode,{
    plugins : ["typescript"]
}),sourceCode,{
    plugins : [autoTypeCheck]
})

console.log(code)

