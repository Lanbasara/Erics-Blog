const { declare } = require("@babel/helper-plugin-utils");

const lintForDirection = declare((api, options) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      ForStatement(path, state) {
        const errors = state.file.get("errors");
        let opera = path.get("update").node.operator;
        let expectDire;
        if (opera === "++") {
          expectDire = ["<", "<="];
        } else if (opera === "--") {
          expectDire = [">", ">="];
        }
        let curDire = path.get("test").node.operator;
        let isCorrect = expectDire.includes(curDire);
        if (!isCorrect) {
          const tmp = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;
          errors.push(
            /**
             * use path.buildCodeFrameError(message,error)
             * to create code frame
             */
            path.get("update").buildCodeFrameError("for direction error", Error)
          );
          Error.stackTraceLimit = tmp;
        }
      },
      AssignmentExpression(path, state) {
        const errors = state.file.get("errors");

        const assignTarget = path.get("left").toString();
        /**
         * path.scope.getBinding(string)
         * get the bind path from scope chain
         */
        const binding = path.scope.getBinding(assignTarget);
        if (binding) {
          // 查找到了左值对应的声明，是函数声明
          if (
            binding.path.isFunctionDeclaration() ||
            binding.path.isFunctionExpression()
          ) {
            const tmp = Error.stackTraceLimit;
            Error.stackTraceLimit = 0;
            errors.push(
              path.buildCodeFrameError("can not reassign to function", Error)
            );
            Error.stackTraceLimit = tmp;
          }
        }
      },
      BinaryExpression(path, state) {
        const errors = state.file.get("errors");
        const list = ["==", "!="];
        const target = ["===", "!=="];
        let operator = path.node.operator;
        if (list.includes(operator)) {
          let leftType = {
            isLiteral: path.get("left").isLiteral(),
            type: path.get("left").getTypeAnnotation().type,
          };
          let rightType = {
            isLiteral: path.get("right").isLiteral(),
            type: path.get("right").getTypeAnnotation().type,
          };
          if (
            !(
              list.includes(operator) &&
              leftType.isLiteral &&
              rightType.isLiteral &&
              leftType.type === rightType.type
            )
          ) {
            const tmp = Error.stackTraceLimit;
            Error.stackTraceLimit = 0;
            errors.push(
              path.get("operator").buildCodeFrameError("Compare error", Error)
            );
            Error.stackTraceLimit = tmp;
            path.node.operator = target[list.indexOf(path.node.operator)];
            path.skip();
          }
        }
      },
    },
    post(file) {
      console.log(file.get("errors"));
    },
  };
});

module.exports = lintForDirection;
