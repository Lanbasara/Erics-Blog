const path = require('path')
module.exports = {
    mode : 'none',
    entry : path.resolve(__dirname,'./src/index.js'),
    output : {
        path : path.resolve(__dirname,'./output'),
        filename : '[name].js'
    },
    target : "web"
}