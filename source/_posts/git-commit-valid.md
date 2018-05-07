---
title: git提交时对提交信息进行规范校验
date: 2018-05-06 22:09:59
tags: git
---

我们的开发属于敏捷式开发，并且所有的开发任务都是通过jira来管理的，我们也有自己的一套git提交信息规范，规范为：
```
jira号 功能任务简称
```
	
如果是在此功能上的测试bug修改，则格式为：
```
jira号 功能任务简称-bug描述
```
如：
```
PTENTOW-5619 热图优化
```
```
PTENTOW-5619 热图优化-修复xxBug
```
但规范只是口头约定，总有些异类不按套路出牌，胡乱的提交信息，给以后的查阅信息带来的不小的隐患，有没有办法在提交的时候去校验下提交是否规范，如果不规范就阻止提交呢？答案是肯定的，我们可以使用`git hooks`.

我们先看git-scm上对`git hooks`的描述
```
和其它版本控制系统一样，Git能在特定的重要动作发生时触发自定义脚本。 有两组这样的钩子：客户端的和服务器端的。 客户端钩子由诸如提交和合并这样的操作所调用，而服务器端钩子作用于诸如接收被推送的提交这样的联网操作。 你可以随心所欲地运用这些钩子。
```
`git hooks`可以让用户编写在git特定动作下执行的脚本，基中有一个`commit-msg`，以用来在提交通过前验证项目状态或提交信息，我们可以使用该hooks．

git hooks所在路径为.git/hooks下，有几个以.sample结尾的例子，默认是不生效的，如果要生效，将.sample后缀去掉，我们将commit-msg.sample改名为commit-msg，将内容清空，编写如果下代码:

```javascript
#!/usr/bin/env node

'use strict';

var fs = require('fs');

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var gitEmail = spawn('git', ['config', 'user.email']);
gitEmail.stdout.on('data', function (data) {
	var email = firstLineFromBuffer(data);
	
	var commitMsgFile = process.argv[2];

	fs.readFile(
		commitMsgFile, function (err, buffer) {
		var message = firstLineFromBuffer(buffer);

		if (!validateMessage(message)) {

			var address = function() {
				if(email.match(/\b(?:observable|alex)\b/)) {
					return '兄dei';
				} else {
					return '妹砸';
				}
			}();
			
			var errorMsg = [
				'******************************* Error *******************************',
				address + '，貌似你不按套路出牌，再看看是不是哪里写的不合要求．',
				'示例：PTENTOW-5619 热图优化-修复xxBug',
			].join('\n   ');
			
			error(errorMsg);
			error('   你提交的是: \\c', 7);
			error(message, 3)
			
			process.exit(1);
		} else {
			process.exit(0);
		}
	});
	
});

	
var error = function (msg, color) {
	var color = color === undefined ? 1 : color;
	spawn('echo', ['-e', '\\033[3' + color + 'm' + msg + '\\033[0m'], {
		stdio : 'inherit'
	});
};

var validateMessage = function () {
	
	var reg = /^PT[A-Z]{5}-\d{1,5}\s+.+/;
	return function(message) {
		return reg.test(message);
	};
}();

var firstLineFromBuffer = function (buffer) {
	return buffer.toString().match(/.*/)[0];
};


```

然后我们随便编辑我们的工作中的文件，然后提交，提交信息为一个不规范的信息，如：随便，提交后有以下提示：

<div>
	<img src="/image/git-commit-valid.png">
</div>
ok，成功！可以看到我们的不规范的提交已被阻止，并且给出了友好的提示．

但是因为该文件处于.git文件夹中，不受git版本控制，需要开发者手动设置，比较费事，我们可以将该文件放进工作区中，然后设置npm勾子，使npm install的时候
设置该文件到.git/hooks/commit-msg的软链接，这样就可以实现自动化．

```javascript
"scripts": {
	"postinstall": "node git-commit-hooks"
},
```

git-commit-hooks.js文件为设置软链接的脚本
```javascript
var exec = require('child_process').exec

exec('rm -f ./.git/hooks/commit-msg')
exec('ln -s ../../commit-msg.js ./.git/hooks/commit-msg')

```
github: https://github.com/bonjs/git-commit-valid

打完收工