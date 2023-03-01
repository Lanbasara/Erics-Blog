module.exports = function (api) {
    api.cache(true);


    /**
     * compile code by babel-cli can config macros plugin
     */
    const plugins = ['macros']
  
    return {
      plugins
    };
  }