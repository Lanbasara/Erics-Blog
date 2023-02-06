/**
 *
 * @param {*} api 封装了types,template等常用babel的api
 * @param {*} options
 * @returns
 */
const targetCalleeName = ["log", "info", "error", "debug"].map(
  (item) => `console.${item}`
);

module.exports = function (api, options) {
  const { types, template } = api;
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew) return;
        const calleeName = path.get("callee").toString();
        if (targetCalleeName.includes(calleeName)) {
          const { line, column } = path.node.loc.start;
          const newCode = template.expression(
            `console.log("filename is ${state.filename || ''} : ${line}, ${column}")`
          )();
          newCode.isNew = true;
          if (path.findParent((path) => path.isJSXElement())) {
            path.replaceWith(types.arrayExpression([newCode, path.node]));
            path.skip();
          } else {
            path.insertBefore(newCode);
          }
        }
      },
    },
  };
};
