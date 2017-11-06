---
title: Zabbix架构的改进方案(三)
date: 2016-03-26 21:40:54
tags: [zabbix,架构]
---

由于此次改进涉及不少内部框架的, 如果都介绍出来篇幅太长,所以这里只介绍下对zabbix的封装的新控制器BaseController.php, 原理也很简单,就是根据传来的method参数名, 去执行对应的方法

~~~javascript
class BaseController extends CController {
 
    protected $data = [];
    protected $title = '';
    protected function init() {
        $this->disableSIDValidation();
    }
     
    protected function checkInput() {
        return true;
    }
 
    protected function checkPermissions() {
        return ($this->getUserType() >= USER_TYPE_ZABBIX_ADMIN);
    }
     
    protected function doAction() {
        $method = getRequest('method');
 
        if($method == null) {
            $this->sendResponse();
            return;
        }
         
        if((is_callable(array($this, $method)))) {
            $this->$method();
            $this->sendResponse();
        } else {
            throw new Exception('cant find this method'.$method);//, $code, $previous)
        }
    }
     
    protected function sendResponse() {
        $response = new CControllerResponseData($this->data);
        $response->setTitle($this->title);
        $this->setResponse($response);
    }
     
}
~~~

在该文件中, 重写了父类CController 中的doAction方法

接收地址传来的method
~~~javascript
$method = getRequest('method');
~~~


对$method非空处理
~~~javascript
if($method == null) {
    $this->sendResponse();
    return;
}
~~~


处理当前控制器中存在从地址传来的方法, 刚去执行该方法, 并sendResponse, 否则给出无法找到方法的报错
~~~javascript
if((is_callable(array($this, $method)))) {
    $this->$method();
    $this->sendResponse();
} else {
    throw new Exception('cant find this method'.$method);//, $code, $previous)
}
~~~

在权限的处理上, 是重写了父类中的checkPermissions(父类是是默认false,无权限), 这里默认是当前用户类型大于等管理员,如果权限和需求不一定, 请在子类控制器中重写该方法 

~~~javascript
protected function checkPermissions() {
    return ($this->getUserType() >= USER_TYPE_ZABBIX_ADMIN);
}
~~~

打完收工