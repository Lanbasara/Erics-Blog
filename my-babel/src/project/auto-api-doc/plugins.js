const { declare } = require("@babel/helper-plugin-utils");
const doctrine = require("doctrine");
const fse = require("fs-extra");
const renderer = require("./renderer");
const path = require('path')
/**
 * @scope helper
 * @param {*} tsType
 * @returns type string
 */
function resolveType(tsType) {
  const typeAnnotation = tsType.type;

  if (!typeAnnotation) {
    return;
  }

  switch (typeAnnotation) {
    case "TSStringKeyword":
      return "string";
    case "TSNumberKeyword":
      return "number";
    case "TSBooleanKeyword":
      return "boolean";
  }
}

/**
 * @scope helper
 * @param {*} commentStr
 * @returns ast
 */
function parseComment(commentStr) {
  if (!commentStr) return;

  return doctrine.parse(commentStr, {
    unwrap: true,
  });
}


/**
 * @scope helper
 * @param {*} docs 
 * @param {*} format 
 * @returns join the content with specific rules
 */
function generate(docs, format = "json") {
  if (format === "markdown") {
    return {
      ext: ".md",
      content: renderer?.markdown(docs),
    };
  } else if (format === "html") {
    return {
      ext: ".html",
      content: renderer?.html(docs),
    };
  } else {
    return {
      ext: "json",
      content: renderer?.json(docs),
    };
  }
}

const autoDocumentPlugin = declare((api, options, direname) => {
  api.assertVersion(7);
  return {
    pre(file) {
      file.set("docs", []);
    },
    visitor: {
      /**
       * Function name
       * params and their types
       * return types
       * comments description
       */
      FunctionDeclaration(path, state) {
        const docs = state.file.get("docs");
        docs.push({
          type: "function",
          name: path.get("id").toString(),
          params: path.get("params").map((paramPath) => {
            return {
              name: paramPath.toString(),
              /**
               * path.getXXXXXXX()
               */
              type: resolveType(paramPath.getTypeAnnotation()),
            };
          }),
          // returnType is supported by @babel/types
          return: resolveType(path.get("returnType").getTypeAnnotation()),
          doc:
            path.node.leadingComments &&
            parseComment(path.node.leadingComments[0].value),
        });
      },

      /**
       * Class Name
       * Class constructor
       * Class methods  and their names & params & returnType
       * Class property
       */
      ClassDeclaration(path, state) {
        const docs = state.file.get("docs");
        const classInfo = {
          type: "class",
          name: path.get("id").toString(),
          constructorInfo: {},
          methodsInfo: [],
          propertiesInfo: [],
        };
        if (path.node.leadingComments) {
          classInfo.doc = parseComment(path.node.leadingComments[0].value);
        }
        path.traverse({
          ClassProperty(curPath, state) {
            const name = curPath.node.key.name;
            const type = resolveType(curPath.getTypeAnnotation());
            const doc = [
              curPath.node.leadingComments,
              curPath.node.trailingComments,
            ]
              .filter(Boolean)
              .map((comment) => {
                return parseComment(comment.value);
              })
              .filter(Boolean);

            classInfo.propertiesInfo.push({name, type, doc});
          },
        });

        path.traverse({
          ClassMethod(curPath, state) {
            /**
             * This method is constroctor
             */
            if (curPath.node.kind === "constructor") {
              classInfo.constructorInfo = {
                params: curPath.get("params").map((param) => {
                  return {
                    name: param.node.name,
                    type: resolveType(param.getTypeAnnotation()),
                    doc: parseComment(curPath.node.leadingComments[0].value),
                  };
                }),
              };
            } else {
              classInfo.methodsInfo.push({
                name: curPath.get("key").toString(),
                params: curPath.get("params").map((param) => {
                  return {
                    name: param.node.name,
                    type: resolveType(param.getTypeAnnotation()),
                  };
                }),
                doc: parseComment(curPath.leadingComments?.[0].value),
                return: resolveType(
                  curPath.get("returnType").getTypeAnnotation()
                ),
              });
            }
          },
        });

        docs.push(classInfo);
      },
    },
    post(file) {
      const docs = file.get("docs");
      const res = generate(docs, options.format);
      fse.ensureDir(options.outputDir);
      fse.writeFile(
        path.join(options.outputDir, "docs" + res.ext),
        res.content
      );
    },
  };
});

module.exports = autoDocumentPlugin;
