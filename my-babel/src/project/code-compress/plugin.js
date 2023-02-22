const { declare } = require("@babel/helper-plugin-utils");

const base54 = (function () {
  var DIGITS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
  return function (num) {
    var ret = "";
    do {
      ret = DIGITS.charAt(num % 54) + ret;
      num = Math.floor(num / 54);
    } while (num > 0);
    return ret;
  };
})();

function canShowAfterReturn(path) {
  return path.isFunctionDeclaration() || path.isVar();
}

const mangle = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    pre(file) {
      file.set("uid", 0);
    },
    visitor: {
      /**
       * Alias for all nodes which can generate the scope
       */
      Scopable: {
        enter(path) {
            const bindings = path.scope.bindings
           Object.entries(bindings).forEach(([key,binding]) => {
            if(!binding.referenced){
                if(binding.path.get('init').isCallExpression()){
                    let comment = binding.path.get('init').node.leadingComments;
                    if(comment && comment[0]){
                        if (comment[0].value.includes('PURE')) {//有 PURE 注释就删除
                            binding.path.remove();
                            return;
                        }
                    }
                }
                if(!path.scope.isPure(binding.path.get('init').node)){
                    binding.path.parentPath.replaceWith(api.types.expressionStatement(binding.path.node.init))
                } else {
                    path.remove()
                }
            }
           })
        },
        exit(path, state) {
          let uid = state.file.get("uid");
          /**
           * all scope variables can be accessed by path.scope.bindings
           */
          const bindings = path.scope.bindings;
          Object.entries(bindings).forEach(([key, binding]) => {
            if (binding.mangled) return;
            binding.mangled = true;
            const newName = path.scope.generateUid(base54(uid++));
            /**
             * rename varibale api
             */
            binding.path.scope.rename(key, newName);
          });
          state.file.set("uid", uid);
        },
      },
      BlockStatement(path) {
        let hasReturn = false;
        const body = path.get("body");
        body.forEach((item) => {
          /**
           * completionStatement is a alias
           * for
           * return continue break throw
           */
          if (item.isCompletionStatement()) {
            hasReturn = true;
            return;
          }
          if (hasReturn && !canShowAfterReturn(item)) {
            item.remove();
          }
        });
      },
      // FunctionDeclaration(path){
      //     const funcBody = path.get('body').get('body')
      //     let hasReturn = false
      //     funcBody.forEach((item) => {
      //         if(item.isReturnStatement()){
      //             hasReturn = true
      //             return
      //         }
      //         if(hasReturn && !canShowAfterReturn(item)){
      //             item.remove()
      //         }
      //     })
      // }
    },
  };
});

module.exports = mangle;
