const { declare } = require("@babel/helper-plugin-utils");

function resolveTypeType(type, path) {
  if (type === "TSTypeReference") {
    const name = path.node.typeName.name;
    const typePath = path.scope.getData(name);
    const paramTypes = path.node.typeParameters.params.map((item) => {
      if (item.literal.type === "NumericLiteral") {
        return "number";
      }
    });

    const params = typePath.paramNames.reduce((obj, name, index) => {
      obj[name] = paramTypes[index];
      return obj;
    }, {});

    const Paramtype =  params[typePath.body.checkType.typeName.name]

    console.log('Paramtype',Paramtype)

    const extendsType = resolveType(typePath.body.extendsType)

    if(Paramtype === extendsType){
      return resolveType(typePath.body.trueType)
    } else {
      return resolveType(typePath.body.falseType)
    }
    

  }

  const map = {
    TSNumberKeyword: "number",
    TSStringKeyword: "string",
  };

  return map[type];
}

function resolveType(targetType) {
  const tsTypeAnnotationMap = {
    TSStringKeyword: "string",
    TSNumberKeyword: "number",
  };
  const literalTypeMap = {
    NumberTypeAnnotation: "number",
    StringTypeAnnotation: "string",
  };
  if (targetType.type) {
    return (
      tsTypeAnnotationMap[targetType.type] || literalTypeMap[targetType.type]
    );
  }
}

/**
 * when babel get the source code
 * You better think it as the thing which has been handled
 * such as hoisting
 */
const autoTypeCheck = declare((api, options) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      TSTypeAliasDeclaration(path) {
        /**
         * set some val into this path's scope
         * path.scope.setDate(variableNameString, valObjs)
         */
        path.scope.setData(path.get("id").toString(), {
          paramNames: path.node.typeParameters.params.map((item) => {
            return item.name;
          }),
          body: path.getTypeAnnotation(),
        });
        path.scope.setData(path.get("params"));
      },
      AssignmentExpression(path, state) {
        const errors = state.file.get("errors");
        let leftType = resolveType(
          path.scope
            .getBinding(path.get("left"))
            .path.get("id")
            .getTypeAnnotation()
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
      CallExpression(path, state) {
        const errors = state.file.get("errors");
        const argumentsTypes = path.get("arguments").map((item) => {
          const type = item.getTypeAnnotation();
          return resolveType(type);
        });
        let paramsTypes;
        if (path.node.typeParameters && path.node.typeParameters.params) {
          const typeArguments = path
            .get("typeParameters")
            .get("params")
            .map((item) => {
              const type = item.type;
              return resolveTypeType(type, item);
            });

          const calleeFunctionPath = path.scope.getBinding(
            path.get("callee")
          ).path;

          const typeParams = calleeFunctionPath
            .get("typeParameters")
            .get("params")
            .map((item) => {
              return item.node.name;
            });

          const map = {};

          typeArguments.forEach((item, index) => {
            const name = typeParams[index];
            map[name] = item;
          });

          paramsTypes = calleeFunctionPath.get("params").map((item) => {
            const type = item.getTypeAnnotation().type;
            if (type === "TSTypeReference") {
              return map[item.getTypeAnnotation().typeName.name];
            } else {
              return resolveType(item.getTypeAnnotation());
            }
          });
        } else {
          paramsTypes = path.scope
            .getBinding(path.get("callee"))
            .path.get("params")
            .map((item) => {
              const type = item.getTypeAnnotation();
              return resolveType(type);
            });
        }

        const wrongIndex = [];
        let index = 0;

        while (index < argumentsTypes.length) {
          if (argumentsTypes[index] !== paramsTypes[index]) {
            wrongIndex.push(index);
          }
          index++;
        }

        if (wrongIndex.length) {
          const argumentsPath = path.get("arguments");
          wrongIndex.forEach((index) => {
            const wrongArgumentPath = argumentsPath[index];
            const tmp = Error.stackTraceLimit;
            Error.stackTraceLimit = 0;
            errors.push(
              wrongArgumentPath.buildCodeFrameError(
                `${argumentsTypes[index]} can not assign to ${paramsTypes[index]}`,
                Error
              )
            );
            Error.stackTraceLimit = tmp;
          });
        }
      },
    },
    post(file) {
      console.log(file.get("errors"));
    },
  };
});

module.exports = autoTypeCheck;
