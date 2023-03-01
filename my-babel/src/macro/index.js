const { transformFileSync } = require('@babel/core')
const path = require('path')
const fs = require('fs')
const sourceCode = fs.readFileSync(path.join(__dirname,'./sourceCode.js'),{encoding : "utf-8"})
/**
 * !!! this compile pipe does not work
 * !!! macros plugins dont supported here
 */
const {code1} = transformFileSync(path.join(__dirname,'./sourceCode.js'),{
    plugins : ["macros"]
})

/**
 * !! babel 6 still doesnt work
 * !! macros plugins dont supported here
 */
const {code2} =  require('babel-core').transform(sourceCode, {
    plugins: ['macros']
  })

console.log(code1,code2)