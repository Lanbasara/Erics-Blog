const { parse } = require("./parser");
const traverse = require("./traverse");
const generator = require("./generator");
const sourceCode = `
const a = 1;
const b = a + 3;
function c(){
  const a = 2;
  const bb = b + 2
}
`;

const ast = parse(sourceCode, {
  plugins: ["literal"],
});

traverse(ast, {
  // NumericLiteral(path) {
  //   console.log("this is NumericLiteral", "path is", path);
  // },
  Identifier(path) {
    const name = path.node.name;
    path.node.name = name.repeat(2);
  },
  VariableDeclaration(path) {
    console.log("this is VariableDeclaration", path);
  },
  // Program(path) {
  //   // const bindings = path.scope.bindings;
  //   // Object.entries(bindings).forEach(([id, binding]) => {
  //   //   if (!binding.referenced) {
  //   //     binding.path.remove();
  //   //   }
  //   // });
  // },
  FunctionDeclaration(path) {
    const bindings = path.scope.bindings;
    Object.entries(bindings).forEach(([id, binding]) => {
      if (!binding.referenced) {
        binding.path.remove();
      }
    });
  },
});

const { code, map } = generator(ast, sourceCode, "test.js");

console.log(code, map);
