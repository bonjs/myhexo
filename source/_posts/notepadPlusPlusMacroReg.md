---
title: notepadPlusPlusMacroReg
date: 2017-03-01 18:40:30
tags: [正则,宏,notepad++]
---
我们在开发中经常会遇到在js中拼html字符串的情况，如：
~~~ javascript
var html = '<div class="block">' +
	'<ul>' +
		'<li>balibali</li>' +
		'<li>balibali</li>' +
		'<li>balibali</li>' +
		'<li>balibali</li>' +
	'</ul>' + 
'</div>';
	
$('#outerDiv').html(html);
~~~
这种方式，因为在低版本下IE浏览器中的效率问题而备受诟病，效率不如通过数组进行join，如以下写法：
~~~ javascript
var html = [
	'<div class="block">',
		'<ul>',
			'<li>balibali</li>',
			'<li>balibali</li>',
			'<li>balibali</li>',
			'<li>balibali</li>',
		'</ul>',
	'</div>'
].join('');	
$('#outerDiv').html(html);
~~~

虽然后来随着chrome，firefox浏览器的兴起，这些浏览器对这种写法进行了优化，使用这种写法的效率有了大幅度的提高，甚至在一些浏览器中比后者略高，但是前者这种拼字符串的方式个人觉得实在是丑，因此个人在开发过程中都使用的第二种方式．
虽说后者相比优雅了不少，但是对大篇幅的html来，仍然相当头痛，因为我们拿到html模板以后仍然要在每行的前后加引号逗号来组成数组，对于大篇幅的html来仍然非常痛苦，难道我们就只能这么拼下去安于现状吗？
NoNo，我们可以让程度来代替我们做这个脏话. 我在本文以及后续介绍两种方式．

第一种：使用nodepad++．
第二种：编写gulp插件．
本文介绍第一种


'替换成 \'
(?!^)(?=\r) 替换成　',
(?<=^)(\s*)　替换成　$1'