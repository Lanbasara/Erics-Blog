function plugin2(api, options) {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;
        path.node.name = name.repeat(2);
      },
    },
  };
}

module.exports = {
  parserOpts: {
    plugins: ["literal", "guangKeyword"],
  },
  plugins: [[plugin2]],
};
