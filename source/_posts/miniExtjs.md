---
title: 制作一个迷你版的Ext.js精简策略(转)
date: 2016-06-16 19:12:57
tags: [转,ext]
discription: 转自http://www.makaidong.com/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E9%97%AE%E7%AD%94/29171.shtml
---

ext 是我顶喜欢的一款js框架, 原因不仅仅只是因为它有着很专业的ui组件, 更要的是它有着很漂亮的类管理机制(尤其是ext4), 它为js程序员们定义了一整套编码规则, 使我们可以把js写得像java一样, ext 自身的代码就是用的这种编码规则,  所以大几万代码依然管理得井井有条. 如果你只是用js写些表单验证之类的小动作, 那么你肯定体会不到编码规则的重要性.  js这种语言, 如果是团队开发, 制作较为复杂的富客户端应用,  如果不强制统一编码风格, 维护起来那将会是场灾难.
   所以我有时自己写js玩的时候, 为了使自己的代码更漂亮, 也会用到ext. 当然, 是精简后的ext.
   构建一个最简易的ext其实非常简单. 我用的是当前最新的版本: ext-4.0.7-gpl.
   
此文转自: http://www.makaidong.com
 
1. 首先下载源码, 解压, 找到以下文件:
~~~javascript
/src/core/src/ext.js
/src/core/src/lang/number.js
/src/core/src/lang/string.js
/src/core/src/lang/date.js 

/src/core/src/lang/object.js
/src/core/src/lang/array.js 
/src/core/src/lang/function.js 
/src/core/src/class/base.js 
/src/core/src/class/class.js  
/src/core/src/class/classmanager.js 
/src/core/src/class/loader.js  
/src/core/src/lang/error.js  
~~~

2. 把这些文件复制出来, 然后在一个页面中依次引用, 注意顺序不要乱, 然后用编辑器打开error.js , 在文件的最后部分注释掉一行代码:
     ....... 
~~~javascript
function poll () {
        timer = win.setinterval(notify, 1000);
    }

    // window.onerror sounds ideal but it prevents the built-in error dialog from doing
    // its (better) thing.
    //poll();   //把这一行注释掉
})();
//</debug>
~~~


3. 然后, 我们可以随便写一些代码了, 如果不报错, 那么就成功了:
~~~javascript
ext.define("ext.foo",{ 
  name: null,

  constructor: function(){
    this.name = "big-foo";
  },

  say: function(){
    alert("my name is "+ this.name);
  }
});

new ext.foo().say();
~~~


这些文件其实也可以按顺序一起打包压缩, 加入到自己项目中, 我上面列出的那些文件压缩后只有50几kb...嘿嘿...袖珍版ext.  因为代码没有


涉及到浏览器对象操作, 所以这个小框架甚至可以移植到 node.js 环境下使用, 只是由于ext这个对象会被自动加在顶层名称空间上, 所以在模块引用的时候会和node的习惯上有些不同, 当然这都是题外话了, 有兴趣的童鞋可以去玩玩, 有新发现记得告诉我.


 
我之前说的没错吧, 操作很简单的. 不过这里面仅仅只启用了ext最核心最基础的一部分功能, 也就是类管理. 从这些 js文件的名字和在源码中得摆放目录的名子中就可以看出来, 放在 lang 目录下都是些对js 基础数据类型的扩展, class 目录下的都是类管理模块. 这么看来, 其实只要了解ext组件间的依赖关系(都可以在api中查到的), 按顺序加入相应的文件, 要随意地div 自己的ext 也不是一件难事.
     
还有一点值得说明, 我注释掉的那一行代码, 如果不注释, 浏览器会不停地报错. 代码中的注释说这是一个用于错误收集的机制, 我看并不影响ext核心功能的使用, 所以就注释了. 我不太能理解ext为什么要一开始就注册一个定时器去定时执行一些代码, 有知道的童鞋能告诉我么?