---
title: callbackNoHell
date: 2016-06-26 15:39:05
tags: [promise]
---

# callback, but no hell !!!

### 启动
~~~ javascript
git clone https://github.com/bonjs/callbackNoHell.git
npm install
node app
~~~

### 源码

~~~ javascript
var callbackNoHell = function(fns) {
	var _promise = arguments.callee;
	
	var sliceProto = Array.prototype.slice;
	
	var params = [function(result) {
		result && _promise.apply(null, [fns].concat(sliceProto.apply(arguments)));
	}].concat(sliceProto.call(arguments, 1));
	
	var fn = fns.shift();
	fn && fn.apply(null, params);
};

~~~

### 调用方式
~~~ javascript
function f1(f) {
	$.get('data/step1.json', {}, function(d) {
		if(d.success) {
			console.log('step1成功');
			f(true, d.step2Id);	// 下个函数请示可能依赖这次的请求结果
		} else {
			f(false);
		}
	});
}
function f2(f) {
	$.get('data/step2.json', {}, function(d) {
		if(d.success) {
			console.log('step2成功');
			f(true, d.step3Id);	// 下个函数请示可能依赖这次的请求结果
		} else {
			f(false);
		}
	});
}
function f3(f) {
	$.get('data/step3.json', {}, function(d) {
		if(d.success) {
			console.log('step3成功');
			f(true, 'step3成功');
		} else {
			f(false);
		}
	});
}

callbackNoHell([f2, f1, f3]);
~~~

