const parser = require('@babel/parser')

const { transformFromAstSync } = require("@babel/core")

const fs = require('fs')

const path = require('path')

const autoDocumentPlugin = require('./plugins')

const sourceCode = fs.readFileSync(path.join(__dirname,"./sourcecode.ts"),{encoding : "utf-8"})


const { code } =  transformFromAstSync(parser.parse(sourceCode,{
    sourceType : "unambiguous",
    /**
     * when parsing jsx or ts， need to config this parser plugin
     */
    plugins : ["typescript"]
}),sourceCode,{
    plugins : [[autoDocumentPlugin, {
        outputDir : path.resolve(__dirname,'dist'),
        format : "markdown"
    }]]
})

console.log(code)