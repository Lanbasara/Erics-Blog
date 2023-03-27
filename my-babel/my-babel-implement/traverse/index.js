const { visitorKeys } = require("../types/index");

function traverse(astNode, vistors) {
  const type = astNode.type;
  const definations = visitorKeys.get(type);
  let vistor = vistors[type];

  if (typeof vistor === "function") {
    vistor = {
      enter: vistor,
    };
  }

  vistor && vistor.enter && vistor.enter(astNode);

  if (definations.visitor) {
    (definations.visitor || []).forEach((key) => {
      const prop = astNode[key];
      if (Array.isArray(prop)) {
        prop.forEach((child) => {
          traverse(child, vistors);
        });
      } else {
        traverse(prop, vistors);
      }
    });
  }

  vistor && vistor.exit && vistor.exit(astNode);
}

module.exports = {
  traverse,
};
