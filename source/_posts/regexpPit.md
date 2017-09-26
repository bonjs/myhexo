---
title: 我遇到的正则表达式的小坑(html5 pattern篇)
date: 2017-01-23 19:43:50
tags: [正则,pattern]
---
#### html5 pattern 
最近帮一个朋友写一个正则表达式, 要求匹配非5-8位数字的字符串，也就是说除了5-8位数字以外的字符串都可以. 我给的的正则是
``` javascript
^(?!\d{5,8}$)
```
但他说不好使, 看到他的代码我才发现他是在input中的pattern这个属性中来使用的正则
``` html
<input type="text" name="country_code" pattern="^(?!\d{5,8}$)"
```

测试了下, 确实不好使, 对pattern这种方式也不熟悉, 于是上网查到w3school上pattern的例子
``` html
  Country code: <input type="text" name="country_code" pattern="[A-z]{3}"
  title="Three letter country code" />
```
这个的需求是只能允许输入大小写字母,但是这个正则却是只要输入的字符串中包括大小写就可以, 有问题啊,但是运行的效果却是能允许输入大小写字母, 难道使用pattern这种方式会自动在首尾加上^$? 于是我上面写的那个正则改成结尾带$的(头部已有^), 但不能直接加, 因为直接加意思就变了, 修改了下,变成
``` javascript
^(?!\d{5,8}$).*$
```
为了验证pattern是不是会在首尾加^$, 我把首尾的^$去掉, 再测试
``` html
  Country code: <input type="text" name="country_code" pattern="(?!\d{5,8}$).*"
  title="Three letter country code" />
```
一切ok.

<b>结论: 在html5的`pattern`属性中使用正则时,会在正则的前后自动加上^$, 如果你的正则加上^$意义有改变的话, 要修改下正则,使之前后加上^$也能保持原来的意思, 这样才能在pattern属性中使用你的正则. </b>
