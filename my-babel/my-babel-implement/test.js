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
  NumericLiteral(node) {
    console.log("this is NumericLiteral", "node.val is", node.value);
  },
});
