const acorn = require("acorn");

const syntaxPlugins = {
  literal: require("./plugins/literal"),
  kunKeyword: require("./plugins/kunKeyword"),
};

const defaultOptions = {
  plugins: [],
};

function parse(code, options) {
  const resolvedOptions = Object.assign({}, defaultOptions, options);
  const newParser = resolvedOptions.plugins.reduce((Parser, pluginName) => {
    let plugin = syntaxPlugins[pluginName];
    return plugin ? Parser.extend(plugin) : Parser;
  }, acorn.Parser);

  return newParser.parse(code, {
    location: true,
  });
}

module.exports = {
  parse,
};
