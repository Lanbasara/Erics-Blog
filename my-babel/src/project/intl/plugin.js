// https://babeljs.io/docs/en/babel-helper-plugin-utils
const { declare } = require("@babel/helper-plugin-utils");
const fs = require("fs");
const path = require("path");
const generate = require("@babel/generator").default;

let intlKey = 0;

function nextIntlKey() {
  ++intlKey;
  return `intl${intlKey}`;
}

const autoIntlPlugin = declare((api, options, dirname) => {
  const { name = "intl" } = options;
  api.assertVersion(7);

  function getReplaceExpression(path, value, intlUid) {
    const expressParams = path.isTemplateLiteral()
      ? path.node.expressions.map((item) => generate(item).code)
      : null;
    let replaceExpression = api.template.ast(
      `${intlUid}.t('${value}'${
        expressParams ? "," + expressParams.join(",") : ""
      })`
    ).expression;

    if (
      path.findParent((p) => p.isJSXAttribute()) &&
      !path.findParent((p) => p.isJSXExpressionContainer())
    ) {
      replaceExpression = api.types.JSXExpressionContainer(replaceExpression);
    }
    return replaceExpression;
  }

  function save(file, key, value) {
    const allText = file.get("allText");
    allText.push({
      key,
      value,
    });
    file.set("allText", allText);
  }

  /**
   * 插件基本结构
   * return {
   *  pre(file){
   *  },
   *  visitor:{
   *  },
   *  post(file){
   *  }
   * }
   */

  return {
    /**
     * file = state.file
     * file是一个Map，用来保存一些全局数据
     */
    pre(file) {
      file.set("allText", []);
    },
    visitor: {
      Program: {
        /**
         * invoke in different time
         * 
         * enter 
         * exit
         */
        enter(path, state) {
          let imported;
          /**
           * In this path visitor, We can traverse other path by ourselves
           */
          path.traverse({
            ImportDeclaration(p) {
              const source = p.node.source.value;
              if (source === name) {
                imported = true;
                /**
                 * path.node ==> get the real ast node by path
                 * path.get(path) ==> new path
                 * path.toString() ==> the code string
                 */
                state.intlUid = p.get('specifiers.0').toString()
              }
            },
          });
          if (!imported) {
            const uid = path.scope.generateUid("intl");
            /**
             * template.ast(Code string) ==> AST
              */
            const importAST = api.template.ast(`import ${uid} from '${name}'`);
            path.node.body.unshift(importAST);
            state.intlUid = uid;
          }
          path.traverse({
            /**
             * special syntax for traverse function
             */
            "StringLiteral|TemplateLiteral"(path, state) {
              if (path.node.leadingComments) {
                path.node.leadingComments = path.node.leadingComments.filter(
                  (comment, index) => {
                    if (comment.value.includes("i18n-disable")) {
                      path.node.skipTransfrom = true;
                      return false;
                    }
                    return true;
                  }
                );
              }
              /**
               * path.findParent()
               * 
               * judge if the node is xxx type
               * path.isXXXXXX()
               */
              if (path.findParent((p) => p.isImportDeclaration())) {
                /**
                 * add some custom props in node
                 */
                path.node.skipTransfrom = true;
              }
            },
          });
        },
      },
      StringLiteral: {
        enter(path, state) {
          if (path.node.skipTransfrom) {
            return;
          }
          let key = nextIntlKey();
          save(state.file, key, path.node.value);

          const replaceExpression = getReplaceExpression(
            path,
            key,
            state.intlUid
          );
          path.replaceWith(replaceExpression);
          /**
           * after replace
           * 
           * need to skip to avoid dead loop
           */
          path.skip();
        },
      },
      TemplateLiteral(path, state) {
        if (path.node.skipTransfrom) {
          return;
        }
        const value = path
          .get("quasis")
          .map((item) => item.node.value.raw)
          .join("{placeholder}");
        if (value) {
          let key = nextIntlKey();
          save(state.file, key, value);

          const replaceExpression = getReplaceExpression(
            path,
            key,
            state.intlUid
          );
          path.replaceWith(replaceExpression);
          path.skip();
        }
      },
    },
    post(file) {
      const allText = file.get("allText");
      const intlData = allText.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
      }, {});
      const content = `const resource = ${JSON.stringify(
        intlData,
        null,
        4
      )};\nexport default resource;`;
      fs.writeFileSync(path.join(options.outputDir, "zh_CN.js"), content);
      fs.writeFileSync(path.join(options.outputDir, "en_US.js"), content);
    },
  };
});

module.exports = autoIntlPlugin;
