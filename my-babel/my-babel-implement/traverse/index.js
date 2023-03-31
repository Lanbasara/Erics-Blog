const { visitorKeys } = require("../types/index");
const NodePath = require("./path/NodePath");

function traverse(astNode, vistors, parent, parentPath, key, listKey) {
  const type = astNode.type;
  const definations = visitorKeys.get(type);
  let vistor = vistors[type];
  const path = new NodePath(astNode, parent, parentPath, key, listKey);

  if (typeof vistor === "function") {
    vistor = {
      enter: vistor,
    };
  }

  vistor && vistor.enter && vistor.enter(path);

  if (astNode.is_skip_flag) {
    delete astNode.is_skip_flag;
    return;
  }

  if (definations.visitor) {
    (definations.visitor || []).forEach((key) => {
      const prop = astNode[key];
      if (Array.isArray(prop)) {
        prop.forEach((child, index) => {
          traverse(child, vistors, astNode, path, key, index);
        });
      } else {
        traverse(prop, vistors, astNode, path, key);
      }
    });
  }

  vistor && vistor.exit && vistor.exit(astNode);
}

module.exports = {
  traverse,
};
