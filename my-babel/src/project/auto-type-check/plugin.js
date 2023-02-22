const { declare } = require("@babel/helper-plugin-utils");

function resolveType(targetType) {
  const tsTypeAnnotationMap = {
    TSStringKeyword: "string",
  };
 return tsTypeAnnotationMap[targetType.type] || 'number'
}

const autoTypeCheck = declare((api, options) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      AssignmentExpression(path, state) {
        const errors = state.file.get('errors')
        let leftType = resolveType(
          path.scope.getBinding(path.get("left")).path.get("id").getTypeAnnotation()
        );
        let rightType = resolveType(path.get("right").getTypeAnnotation());
        if (leftType !== rightType) {
          const tmp = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;
          errors.push(
            path
              .get("right")
              .buildCodeFrameError(
                `${rightType} can not assign to ${leftType}`,
                Error
              )
          );
          Error.stackTraceLimit = tmp;
        }
      },
    },
    post(file) {
      console.log(file.get("errors"));
    },
  };
});

module.exports = autoTypeCheck;
