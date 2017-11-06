---
title: Zabbix架构的改进方案(二)
date: 2016-03-12 23:01:52
tags: [zabbix,架构]
---

比如要做一个用户管理模块UserManager,  通过UserManager.do访问主页面, 而新增用户的地址为UserManager!add.do, 删除用户的后台请求地址为UserManager!delete.do

1, 建一个后台php文件继承BaseController,名为UserManagerController.php
	
~~~javascript
// 
class UserManagerController extends BaseController {
      
    function userList() {        // 用户列表,通过UserManager!userList.do来访问
        $this->data = [
                [
                        'username' => 'sun',
                        'sex' => 'f'
                ], [
                        'username' => 'aaa',
                        'sex' => 'f'
                ], [
                        'username' => 'aaa',
                        'sex' => 'f'
                ], [
                        'username' => 'aaa',
                        'sex' => 'f'
                ]
        ];
    }
      
    function add() {        // 新增用户,通过UserManager!add.do来访问
        $this->data = [
                'success'=> true,
                'msg'=>'add success'
        ];
    }
      
    function delete() {        // 删除用户,通过UserManager!delete.do来访问
        $this->data = [
                'success'=> true,
                'msg'=>'delete success'
        ];
    }
}
~~~

如果需要权限控制,则在该Controller中重写父类方法(默认是管理员及以上可以访问)
~~~javascript
function checkPermissions() {
    return ($this->getUserType() >= USER_TYPE_ZABBIX_ADMIN);
}
~~~


效果: 
访问 http://localhost/dam/UserManager!userList.do时返回数据如下
~~~javascript
[
	{"username":"sun","sex":"f"},
	{"username":"aaa","sex":"f"},
	{"username":"aaa","sex":"f"},
	{"username":"aaa","sex":"f"},
]
~~~


2, 建一个对应前端的js文件，名为UserManager.js, 继承自TSWidget或TSWidget的子类
~~~javascript
// demo
define("js/widgets/UserManager", [
   "ts/widgets/TSDataGrid",
   "ts/widgets/TSGridColumn",
   "ts/widgets/TSButton",
   'ts/widgets/GenericDialog',
], function(TSDataGrid, TSGridColumn, TSButton, Dialog){
     
    var i18n=TSDataGrid.prototype.i18n.createBranch({});
    function UserManager(opts){
        TSDataGrid.call(this);
         
        this.dataSource = 'UserManager!userList.do';
        defineProperties.call(this);
    }
     
    function defineProperties(){
        var self=this;
        var username=new TSGridColumn({
            dataField:"username",
            headerText:'username',
            width:250,
        });
         
        var sex=new TSGridColumn({
            dataField:"sex",
            headerText:'sex',
            width:250,
        });
 
        this.columns=[username, sex];
        this.actions = [new TSButton({
            name:"测试",
            buttonName:'测试',
            iconClass:"glyphicon glyphicon-plus",
            click:function(){
                Dialog.create({
                    title: 'fdafds'
                })
                 
            }
        })];
        this.usePager=true;
        this.checkable=false;
        this.showToolbar=true;
        this.showFooter=true;
    }
     
    ExtendClass(UserManager, TSDataGrid);
     
    return UserManager;
     
});
~~~



如果想加到菜单里，则在menu.inc.php中配置下
~~~javascript
], [
    'label' => _('测试demo'),
    'url' => 'UserManager.do',
    'active_if' => ['UserManager'],
],[
~~~


