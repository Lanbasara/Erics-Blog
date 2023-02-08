# Plugin

## 配置方式

使用数组配置和传参数

```json
{"plugins" : ["pluginA",["pluginB"], ["pluginC",{options:{}}]]}
```

## 插件的格式

1. 返回具有特定属性的对象的函数

```js
export default function(api, options, dirname) {
  return {
    inherits: parentPlugin,
    manipulateOptions(options, parserOptions) {
        options.xxx = '';
    },
    pre(file) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(file) {
      console.log(this.cache);
    }
  };
} 


```

2. 直接返回一个对象

```js
export default plugin =  {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
};

```

# preset

一组已经配置好的plugins和其使用方式

# 关于顺序

1. 先从前到后应用plugin， 再从后往前应用preset

# 名称要求

babel-plugin-xxxx