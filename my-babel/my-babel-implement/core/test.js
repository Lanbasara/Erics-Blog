const { transformSync } = require("./index");

const sourceCode = `
const a = 1;
const b = a + 3;
function c(){
  const a = 2;
  const bb = b + 2
}
`;

function plugin1(api, options) {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;
        path.node.name = name.repeat(2);
      },
    },
  };
}

const { code, map } = transformSync(sourceCode, {
  parserOpts: {
    plugins: ["literal"],
  },
  fileName: "foo.js",
  plugins: [[plugin1, {}]],
  presets: [],
});

console.log(code, map);
