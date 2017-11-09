---
title: chrome下禁止中文输入的新方案
date: 2017-02-23 12:47:27
tags: [compatibility,兼容,chrome,输入法]
---

现实中我们经常会遇禁止输入中文的场景，常见的处理方式

1, 使用css样式`ime-mode:disabled`
2, 使用js在`keyup`事件中将输入的中文替换为空

但是第一种方式ie,firefox都可以使用，但我大谷歌居然不兼容，谷歌也有不兼容的时候．．
而第二种方式怎么样呢，输入过程会有汉字选择框，并且汉字在上屏后突然消失，感觉好滑稽的样子，体验上不够友好，并且在chrome, firefox下，汉字在输入过程中上屏之前，input的value是对应按钮的字母的值．我们来看下：

~~~ html
<input id="test" />
~~~
测试，在keyup事件中打印当前input的value
~~~ javascript
$('#test').on('keyup', function() {
	console.log(this.value);
});
~~~
切换到中文输入法下，打开f12, 在input输入，注意在输入过程中汉字上屏之前，在命令行下已经打印了字符，是我们键入的英文字母的值，此时不但触发了keyup事件，value也被填充了值，这和ie下是不同的．
<img src="/image/input.jpg">
这也会带来一些问题，比如对一些即时输入即将结果显示的场景，在汉字上屏之前会将输入的英文字母发送到给后台进行查询，而这些查询是没有用的

因此，对于这种方式来禁止中文输入，也是不够好的．

<b>下面介绍第三种方法，该方法也是我调试的时候发现的，就是利用html5的新事件input, 用户在输入过程中会触发该事件，在该事件中将当前值赋给当前input<b>
~~~ javascript
$('#test').on('input', function() {
	this.value = this.value;
});
~~~
经测试，在chrome中中文输入法下输入时，不会产生输入选择框，也不会输入中文，实际使用中再配合第一种方法，基本上可以实现对所有浏览器兼容．