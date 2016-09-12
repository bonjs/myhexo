---
title: 对js闭包的一点认识
date: 2016-05-02 22:57:03
tags: [闭包]
---

先看一段代码
~~~javascript
var a = [];
var i = 0;
for(; i < 2; i ++) {
    a[i] = function() {
        console.log(i);
    }
}
 
a.forEach(function(fn, i) {
    fn();
})
 
结果：
2
2

~~~
可能很多人对这段代码无法理解，程序的设计者设计的初衷是想给数组a放置打印下标的function, 可实际执行结果是，数组a里存放的function打印的不是对应的下标，而全都是２！？！？　无法理解？　不要急，等我一步一步的调试下，可能会对你有所帮助呢

１，下面这段代码相信都没有疑问	
~~~javascript
var i = 0;
var test = function() {
    console.log(i);
}
test();
 
结果：
0
~~~

２，这一步
~~~javascript
var i = 0;
var test = function() {        // 声明的时候，　此时i=0,但是调用的时候，i已经变成了1
    console.log(i);       
}
i++;
test();
 
结果：
1
~~~

test声明的时候，　此时i=0,但是调用的时候，i已经变成了1

3,
~~~javascript
var i = 0;
 
var test = function() {
    console.log(i);
}
i++;
 
var test2 = function() {
    console.log(i);
}
i++;
 
test();
test2();
 
结果：
2
2
~~~

再加一个函数test2, 同时再次i++, 函数内容同样是打印i, 结果是两次打印都是2, 因为这两个函数中的i是同一个值,并且打印时i的值不是声明时的值,而是和调用时的值保持一致, 



4,
~~~javascript
var a = [];
var i = 0;
a.push(function() {
    console.log(i);
});
i++;
a.push(function() {
    console.log(i);
});
i++;
a[0]();
a[1]();
 
结果:
2
2
~~~

一样的, 只是把函数存进了数组



5, 然后还是一样的, 只是放进了循环中,但现在, 已经无缝过渡到了开头的那一段
~~~javascript
var a = [];
var i = 0;
for(; i < 2; i ++) {
    a[i] = function() {
        console.log(i);
    }
}
 
a.forEach(function(fn, i) {
    fn();
})
 
结果：
2
2
~~~

6, 怎么让程序按我们期望的方式输出呢？　一个解决办法是, 将函数嵌套在一个匿名函数里,通过匿名函数来传i值
~~~javascript
var a = [];
var i = 0;
for(; i < 2; i ++) {
    a[i] = (function(v) {
        return function() {
            console.log(v);
        }
    })(i);
}
 
a.forEach(function(fn, i) {
    fn();
})
 
结果：
0
1
~~~


原因是，通过匿名函数传值后，匿名函数里的v是局部变量，是函数中非公用的活动对象，不会受外面i的影响，因此能够将我们期望的下标值打印出来





结论:  其实这就是一个闭包引起的副作用(该闭包没有外部函数,因为外部函数不是必需的(是不是可以暂称此类闭包为开包openure)),  当前函数的活动对象的活动对象其实就是全局变量对象, 因为没有外部函数, 这个数组里的所有函数共用一个活动对象, 包括a和i, 所有这里的函数共用一个i, 所以每个函数里的i值都是最后一个值2



欢迎指教和探讨！
