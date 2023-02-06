const { transformFileAsync } = require('@babel/core')
const plugin = require('./plugin')
const path = require('path')
const code = transformFileAsync(path.join(__dirname,"../../asset/code.jsx"), {
    plugins : [plugin],
    parserOpts : {
        sourceType : "unambiguous",
        plugins : ['jsx']
    }
})

code.then(({code}) => {
    console.log('code is',code)
})