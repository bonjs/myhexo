---
title: 对https跨域登录的处理
date: 2016-11-18 15:37:18
tags: [https,跨域]
---

最近公司网站使用ssl加密，但非全程加密，只对登录注册界面加密，要求在http界面操作时如果没有登录就弹出登录界面进行登录。因为http和https属于不同的协议，因此涉及到跨域问题，开始时考虑jq jsonp，但jsonp只能get提交，后来改用嵌套多层iframe的方式，具体方式如下：

### 三个界面：
~~~ html
协议	页面
http	index.html
https	loginForm.html
http	loginProxy.html
~~~
### 思路：
主界面index.html，点击登录弹出层嵌套https协议的loginForm.html，loginForm.html存放提交表单，在loginForm.html点击提交按钮提交表单，同时在loginForm.html中创建一个子iframe，src为和index.html同域的loginProxy.html，在loginProxy.html中调用parent.parent就可以调用到index.html中定义的函数从而对index.html操作；

因为本地测试时没有ssl环境，改为不同域名的方式来实现跨域，编码，测试，上stg环境，一切ok。

但是上正式环境的时候却出了问题，报Mixed Content的错误， 无法加载iframe内网页，原来https下无法加载http的界面，涉及https的跨域比其他类型（不同服务器，不同域名，不同端口）更严格.

后来想到了一个解决方案，其实很简单，使用http协议的loginProxy.html，在loginForm.html里使用ajaxSubmit提交表单，成功之后使用

~~~ javascript
window.location.href = 'http://localhost/loginProxy.html';
~~~
重定向到http协议的loginProxy.html，这样iframe内外就处在同一个域，从而绕过了跨域问题。