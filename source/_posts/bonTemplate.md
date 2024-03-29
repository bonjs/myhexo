﻿---
title: 高效，轻量，易用的模板引擎~~ 
date: 2016-08-31 17:07:07
tags: [原创,模板,引擎,高效,轻量]
---

# bonTemplate [![Build Status](https://travis-ci.org/bonjs/bon-template.svg?branch=mocha)](https://travis-ci.org/bonjs/bon-template) [![](https://img.shields.io/npm/v/bon-template.svg)](https://www.npmjs.com/package/bon-template) [![](https://img.shields.io/npm/l/bon-template.svg)](https://img.shields.io/npm/l/bon-template.svg)
* 高效(`100`条数据执行`10000`次一共耗时`50`多ms，我本机上的测试结果，视电脑配置)
* 轻量(压缩前也才`3K`多)
* 支持循环<each>
* 支持条件判断<if>
* 支持嵌套
* 支持表达式
* 支持自定义格式化函数
* 使用简单，易懂

https://github.com/bonjs/bonTemplate

#### 安装和启动
```Bash
git clone https://github.com/bonjs/bonTemplate.git
npm install
node app
```
### 或者
```Bash
npm install bonTemplate --save-dev
node app
```

### 或者
```Bash
npm install bon-template --save-dev
node app
```

访问http://127.0.0.1:3000

#### 模板
```html
<script id=tpl type="html">
	<div>{name}</div>
	<div>{sex}</div>
	<div>{email}</div>
</script>
```
#### 数据
```javascript
var data = {
	name	: 'bonTemplate',
	sex		: 'm',
	email	: 'ske@163.com'
}
```
#### 调用方式
```javascript
var html = document.getElementById('tpl').innerHTML
var str = bon.render(html, data);
a.innerHTML = str;
```


## 可嵌套的循环标签
```html
<each userList=u>
	<div>{u.name}</div>
	<div>{u.sex}</div>
	<div>{u.email}</div>
	<each u.hobbys=h>
		<label>{h}</label>
	</each>
</each>
```
```javascript
{
	userList: [
		{
			name	: 'bonTemplate',
			sex		: 'm',
			email	: 'ske@163.com',
			hobbys: [
				'吃',　'喝',　'玩',　'乐'
			]
		}, {
			name	: 'bonTemplate',
			sex		: 'm',
			email	: 'ske@163.com'，
			hobbys: [
				'吃',　'喝',　'玩',　'乐'
			]
		}
	]
}
```

## 条件标签
```html
<div>
	<div>{name}</div>
	<div>{sex}</div>
	<div>{email}</div>
	<if sex == 'm'>
		爱好数码
	</if>
</div>
```
```javascript
{
	name	: 'bonTemplate',
	sex		: 'm',
	email	: 'ske@163.com'
}
```

## 表达式
```html
<div>
	<div>{name}</div>
	<div>{sex == 'm' ? '男' : '女'}</div>
	<div>{email}</div>
</div>
```
```javascript
{
	name	: 'bonTemplate',
	sex		: 'm',
	email	: 'ske@163.com'
}
```

## 自定义格式化函数
```javascript
bon.addFun({
	myFun : function(v) {
		return v == 'm' ? '男' : '女';	
	}
});
```

```html
<div>
	<div>{name}</div>
	<div>{sex:myFun}</div>
	<div>{email}</div>
</div>
```
```javascript
{
	name	: 'bonTemplate',
	sex		: 'm',
	email	: 'ske@163.com'
}
```

## 全家桶
```javascript
bon.addFun({
	formateEmail: function(email) {
		return 'Email: ' + email;
	}	
})
```

```html
<each userList=u>
	<div>{u.name}</div>
	<div>{u.sex == 'm' ? '男' : '女'}</div>
	<div>{u.email:formateEmail}</div>
	<each u.hobbys=h>
		<label>{h}</label>
	</each>
	<if u.sex == 'm'>
		爱好数码
	</if>
	<if u.sex == 'f'>
		爱好买衣服
	</if>
</each>
```
```javascript
{
	userList: [
		{
			name	: 'bonTemplate',
			sex		: 'm',
			email	: 'ske@163.com',
			hobbys: [
				'吃',　'喝',　'玩',　'乐'
			]
		}, {
			name	: 'she',
			sex		: 'f',
			email	: 'fdsafs@163.com'，
			hobbys: [
				'吃',　'喝',　'玩',　'乐'
			]
		}
	]
}
```
