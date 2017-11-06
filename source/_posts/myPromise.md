---
title: 自己实现的Promise
date: 2016-06-26 15:39:05
tags: [promise]
---

### ThePromise.js

https://github.com/bonjs/ThePromise


~~~javascript
function ThePromise(fns) {
    this.action(fns);
}
ThePromise.prototype.action = function(fns) {
    var _f = arguments.callee;
    var fn = fns.shift();
    fn && fn.call(fns, function(result, msg) {
        console.log(msg);
        result && _f(fns);
    });
};
~~~

### 调用方式
~~~javascript
function f1(f) {
    $.get('data.json?type=1', {}, function(d) {
        if(d.success) {
            f(true, 'step1成功');
        } else {
            f(false, 'step1失败');
        }
    });
}
function f2(f) {
    $.get('data.json?type=2', {}, function(d) {
        if(d.success) {
            f(true, 'step2成功');
        } else {
            f(false, 'step2失败');
        }
    });
}
function f3(f) {
    $.get('data.json?type=3', {}, function(d) {
        if(d.success) {
            f(true, 'step3成功');
        } else {
            f(false, 'step3失败');
        }
    });
}
 
new ThePromise([
    f2,
    f1,
    f3,
]);
~~~

