const validations = require("../../types/index");
const { visitorKeys } = require("../../types/index");
const { Scope } = require("./Scope");

module.exports = class NodePath {
  constructor(
    node = null,
    parent = null,
    parentPath = null,
    key = "",
    listKey = 0
  ) {
    this.node = node;
    this.parent = parent;
    this.parentPath = parentPath;
    this.key = key;
    this.listKey = listKey;

    Object.keys(validations).forEach((key) => {
      if (key.startsWith("is")) {
        this[key] = validations[key].bind(this, node);
      }
    });
  }

  replaceWith(node) {
    if (Array.isArray(this.node[this.key])) {
      this.node[this.key].splice(this.listKey, 1, node);
    } else {
      this.node[this.key] = node;
    }
  }

  remove() {
    if (Array.isArray(this.node[this.key])) {
      this.node[this.key].splice(this.listKey, 1);
    } else {
      this.node[this.key] = null;
    }
  }

  find(tester) {
    let curPath = this;
    while (curPath && !tester(curPath)) {
      curPath = curPath.parentPath;
    }
    return curPath;
  }

  findParent(tester) {
    let curPath = this.parentPath;
    while (curPath && !tester(curPath)) {
      curPath = curPath.parentPath;
    }

    return curPath;
  }

  traverse(visitor) {
    const traverse = require("../index");
    const type = this.node.type;
    const defination = visitorKeys.get(type);

    (defination.visitor || []).forEach((key) => {
      const prop = this.node[key];
      if (Array.isArray(prop)) {
        prop.forEach((child, index) => {
          traverse(child, visitor, this.node, this, key, index);
        });
      } else {
        traverse(prop, visitor, this.node, this, key);
      }
    });
  }

  skip() {
    this.node.is_skip_flag = true;
  }

  toString() {
    return generator(this.node).code;
  }

  isBlock() {
    return visitorKeys.get(this.node.type)?.isBlock || false;
  }

  get scope() {
    if (this.__scope) {
      return this.__scope;
    }

    const isBlock = this.isBlock();
    const parentScope = this.parentPath && this.parentPath.scope;
    return (this.__scope = isBlock
      ? new Scope(parentScope, this)
      : parentScope);
  }
};
