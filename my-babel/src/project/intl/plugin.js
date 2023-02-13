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

  return {
    pre(file) {
        file.set("allText", []);
      },
    visitor: {
      Program: {
        enter(path, state) {
          let imported;
          path.traverse({
            ImportDeclaration(p) {
              const source = p.node.source.value;
              if (source === name) {
                imported = true;
              }
            },
          });
          if (!imported) {
            const uid = path.scope.generateUid("intl");
            const importAST = api.template.ast(`import ${uid} from ${name}`);
            path.node.body.unshift(importAST);
            state.intlUid = uid;
          }
          path.traverse({
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
              if (path.findParent((p) => p.isImportDeclaration())) {
                path.node.skipTransfrom = true;
              }
            },
          });
        },
      },
      StringLiteral(path,state){
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
          path.skip();
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
