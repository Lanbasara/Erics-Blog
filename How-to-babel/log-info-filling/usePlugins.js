const { transformFileSync  } = require("@babel/core")
const plugin = require('./plugin.js')
const path = require('path')


const { code } = transformFileSync(path.resolve(__dirname, "./source.js"), {
    plugins: [plugin],
    parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx']
    }
})

console.log('code is', code)