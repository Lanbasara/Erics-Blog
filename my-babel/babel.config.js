const myPlugin = require('./src/console/plugin')

module.exports = { presets: ["@babel/preset-env","@babel/preset-react"] ,plugins : [myPlugin] };