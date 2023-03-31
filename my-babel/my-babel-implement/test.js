const { parse } = require("./parser");
const { traverse } = require("./traverse");

const sourceCode = `
const a = 1;
const b = a + 3;
`;

const ast = parse(sourceCode, {
  plugins: ["literal"],
});

traverse(ast, {
  NumericLiteral(path) {
    console.log("this is NumericLiteral", "path is", path);
  },
  VariableDeclaration(path) {
    console.log("this is VariableDeclaration", path);
  },
});
