---
title: require-alias-node
date: 2018-12-28 16:47:13
tags: [require, alias, npm]
---
# require-alias-node [![Build Status](https://travis-ci.org/bonjs/require-alias-node.svg?branch=master)](https://travis-ci.org/bonjs/require-alias-node)
### A tool which could set an alias for the module's path which is required in the `require` of nodejs     or `import` of ES6

It's the alias of `require-import-alias`

#### Install
~~~bash
npm install require-alias-node
~~~

Sometimes, we may use a module with a long path to be required, and the path may contain many level, is's not very intuitive ! 
~~~javascript
const component = require('../../../src/component');
const moduleA = require('../../../src/component/render/moduleA');
~~~

Now we can use this tool `require-alias-node` to set alias for the moduleA, such as :
~~~javascript
const requireAliasNode = require('require-alias-node');
requireAliasNode.setAlias({
	'component': '../../../src/component',
	'moduleA': '../../../src/component/render/moduleA'
});
const moduleA = require('moduleA');
const moduleB = require('component/main/moduleB')'
~~~

### and you can also use it with `import` in ES2015(set an alias is a module, and use the alias in anthor module)

setAlias
~~~javascript
import requireAliasNode from 'require-alias-node'
requireAliasNode.setAlias({
	'component': '../../../src/component',
	'moduleA': '../../../src/component/render/moduleA'
});
~~~

using it 
~~~javascript
import component from 'component'
import moduleA from 'moduleA'
import moduleB from 'component/render/moduleB'
~~~

It's so gracefully !
