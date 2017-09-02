---
title: box-shadow
date: 2017-06-22 06:31:21
tags:
---
遇到过这样一个需求：因为项目的性质，我们需要用程序抓取用户的网页，然后在一些符合条件的dom添加一层内阴影及一段浮层文字，因为要最大程度的保证用户网页的原有的功能和界面，我们不能采用添加遮罩dom的形式，而采用了添加class样式，借助`before`或`after`。
幸好css3提供了实现内阴影的功能，就是使用`box-shadow`，如
~~~
box-shadow:inset 0 0 44px 12px #1c1fc2;
~~~
而浮层文字可以使用`before`或`after`伪类中的`content`;

对一般的dom都没什么问题，但是用在img上却发现没有效果，img根本就不支持`box-shadow`的inset效果，并且也不支持`before`，`after`伪类，上网查得`before`，`after`伪类是在内部的前和后插入内容，换句话说，这个dom首先得是个容器，而img本身不可存放其他元素，不是容器，所以不能使用这两个伪类。

后来经过多次调试发现，img在没有src的情况下可以设置inset方式的`box-shadow`，并且也可以使用`before`及`after`伪类，那我使用js动态的去删除src属性然后设置它的`background-image`，再设置`box-shadow`和`before`,`after`伪类不就可以了吗？效果如下：

<div>
<img class="shadow" alt="  " style="width:316px; height: 194px">
</div>

完整代码如下：
### HTML
~~~html
<img class="shadow" alt="  " style="width:316px; height: 194px">
~~~

### CSS
~~~css
.shadow {
	position: relative;
	display: block;
	overflow: hidden;
	
	background:url(/image/cat.jpg) no-repeat;
	background-size: 316px 194px;
	
	box-shadow:inset 0 0 44px 12px #1c1fc2;
	-webkit-box-shadow:inset 0 0 44px 12px #1c1fc2;
	-moz-box-shadow:inset 0 0 44px 12px #1c1fc2;
}

.shadow:before, .shadow:after {
	position:absolute;
	top:0;
	left:0;
	width: 100%;
	height: 100%;
}

.shadow:before {
	content:"";
}

.shadow:after {
	content: "我是浮层文字";
	text-align: center;
	color: white;
	text-shadow: 0px 0px 2px blue;
	top:50%;
	line-height:0;
}
.shadow:hover:before{
	background-color:rgba(0, 115, 27, 0.3);
}
.shadow:hover:after{
	color:white;
}
~~~