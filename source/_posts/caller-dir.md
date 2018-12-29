---
title: caller-dir
date: 2018-12-27 15:03:31
tags: [npm, caller-dir, caller, dir]
---
# caller-dir [![Build Status](https://travis-ci.org/bonjs/caller-dir.svg?branch=master)](https://travis-ci.org/bonjs/caller-dir) [![](https://img.shields.io/npm/v/caller-dir.svg)](https://www.npmjs.com/package/caller-dir) [![](https://img.shields.io/npm/l/caller-dir.svg)](https://img.shields.io/npm/l/caller-dir.svg)

### A tool which could get the dirpath of a function method's caller

~~~bash
npm install caller-dir
~~~

Usually, if you want to get the current path, you can use `__dirname` in Nodejs, if you want to get the caller's dirpath, you can call the function with a parameter which is `__dirname`, but is not graceful.

Now you can use this little tool `caller-dir` to get the caller's dirpath gracefully.


eg.
file A `/src/module/a.js`
~~~javascript
const getCallerDir = require('caller-dir');

function A() {
	console.log(getCallerDir());
}
module.exports = A;
~~~

file B `/src/b.js`
~~~javascript
var A = require('./module/a');
A();
~~~

output: `/src`
