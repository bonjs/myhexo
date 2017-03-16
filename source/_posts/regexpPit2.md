---
title: 我遇到的正则表达式的小坑(split篇)
date: 2017-01-23 20:42:02
tags: [正则]
---

经过几天的努力, bonTemplate v1.0.5终于发布了, 改进了if标签中的表达式逻辑, 心中一块石头算是落了地, 这几天, if标签的边界问题方案是修了改, 改了修, 哥的ifext分枝不带这么玩的.. 哎呀废话不多说, 我还记得我是来干嘛的, 来说说这次遇到的怪问题.

先看看问题正则
``` javascript
<each\s+([\w.]+)\=['"]?(\w+)['"]?(?:\s+([\w.]+)\=['"]?(\w+)['"]?)*\s*>
```
我去, 这是个毛啊

好吧, 咱就抓住主要矛盾,忽略次要矛盾, 来个简单的小场景:

取出下面字符串所有的字符串, 子字符串只能含有字母
``` javascript
abcdetestfgh,hello,bonTemplate
```
ok, 小case, 直接按逗号split就行了, 正则都不用写了
abcdetestfgh
hello
bonTemplate

哥正在沾沾自喜, 产品又来了说需求要改, 说子字符串不能包含逗号,也不能包含test这个字符串.
看来只能写个正则了, 这也不是什么问题.
``` javascript
(?:test|,)
```
<img src=/image/regTest1.png>

哥想这下没问题了, 可不一样会, 产品又来了, 说子字符也不能包含abc, 我去!

<img src=/image/87417c60jw1fam6z4pay6g208k06lqv5.gif>
那就改改吧, 这还能难的倒哥吗?
``` javascript
(test|,|abc)
```
<img src=/image/regTest2.png>

..等等, 不对啊, 我是按test逗号abc这三个split,怎么会出现在结果中!?
上一个结果还是正常的, 这次就加了一个abc,怎么就不正常了呢? 
哦.. 还有个差别是一个是捕获性分组, 一个是非捕获性分组, 难道还和这个有关?
于是改了下,改成非捕获性分组

<img src=/image/regTest3.png>
果然啊, <b>捕获性分组还是非捕获性分组居然影响到了split的结果.. ,要知道在其他用法中, 如match, exec, test, 在这些用法中, 分组是捕获性还是非捕获性是不会影响到结果的,只是用来取值用的, 但在split中却影响匹配结果!</b>
