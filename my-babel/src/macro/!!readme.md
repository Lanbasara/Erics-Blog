# How to use or write babel macro properly from now on

[babel-macros-doc](https://github.com/kentcdodds/babel-plugin-macros/blob/main/other/docs/user.md)

## What is macro

A new way to change targer code in babel compiling pipeline

1. Declarative in source code
2. Automaticly handled in babel compile pipeline

The greatest instance is css-in-js

```js

/** div is a kind of macors */
const style = div`
 color : 'red'
`
/** after compiling, style will be compiled into another thing, such as a object */

style = {color : 'red'}

```

## What is the advantage, comparing with plugin?

1. more explicit
2. safer and easier to write, because they receive exactly the AST node to process


## How to use

At this time, most of project is using babel 7

Use macro by babel config, config "macros" in plugins


## How to write

```js

const { createMacro } = require('babel-plugin-macros')

function myMacro({references, state, babel}) {
  const { default: referredPaths = [] } = references;
  // state is the second argument you're passed to a visitor in a
  // normal babel plugin. 
  // `babel` is the `babel-plugin-macros` module, which supply babel api like typs
  // references supply path, which is like in plugin
}

module.exports = createMacro(myMacro);
```