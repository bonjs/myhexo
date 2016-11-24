---
title: promise4ie8 -- Promise在ie8等不支持Promise浏览器上的实现
date: 2016-11-24 14:14:03
tags: [promise,回调地狱]
---

#### https://github.com/bonjs/promise4ie8.git

### 使用方法和Promise一样，后期将改Promise4ie8为Promise，对原生Promise是否支持自动判断

### 安装
~~~ javascript
git clone https://github.com/bonjs/promise4ie8.git
npm install
node app
~~~

### 使用方法和Promise一样
~~~ javascript
function f1() {
	var p = new Promise4ie8(function(resolve, reject) {
		setTimeout(function() {
			resolve('异步返回数据1');
		}, 1000);
	});
	return p;
}
function f2() {
	var p = new Promise4ie8(function(resolve, reject) {
		setTimeout(function() {
			resolve('异步返回数据2');
		}, 1000);
	});
	return p;
}
function f3() {
	var p = new Promise4ie8(function(resolve, reject) {
		setTimeout(function() {
			resolve('异步返回数据3');
		}, 1000);
	});
	return p;
}

f1().then(function(data) {
	console.log(data);
	return f2();
}).then(function(data) {
	console.log(data);
	return f3();
});

~~~
