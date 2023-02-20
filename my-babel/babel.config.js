const path = require('path')

module.exports = function (api) {
    api.cache(true);

  

    /**
     * babel-plugin-ghk-tstry is the npm package of auto-doc-api plugin
     */
    const plugins = ["@babel/plugin-transform-typescript",['babel-plugin-ghk-tstry', {
        outputDir : path.resolve(__dirname,'dist'),
        format : "markdown"
    }]];
  
    return {
      plugins
    };
  }