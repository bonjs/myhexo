---
title: formEncrypt
date: 2016-09-28 18:51:49
tags: [jquery.form.js,encrypt,RSA,加密]
---



jquery.form.js中是对原生form表单验证提交进行了封装的一个插件,使用起来非常的方便,但是我们经常有对密码域加密码的需求,而jquery.form.js并没实现这一功能,下面我们来对它进行扩展来实现这一功能.

### 启动
``` javascript
git clone https://github.com/bonjs/formEncrypt.git
node app
```

### 源码
```javascript
/**
 * 对使用ajaxSubmit提交的表单中添加encrypt=true的表单域进行加密, 重写ajaxSubmit方法
 * @author 	Alex
 * @date    二○一六年九月二十八日
 * @version 1.0
 * 使用方式: 对要加密的表单域标签中添加encrypt=true,通过ajaxSubmit提交表单时自动会对该域加密
 */
$.fn.ajaxSubmit = function() {
	var f = $.fn.ajaxSubmit;

	// 公钥
	var FD_f1342fFDFdsaf = 'MIGfMA0GCSqGSIb3DQfdsafdsafdsDCBiQKBgQDkAh06uqqrA8qIsyd98/E1p4oL0GAzUifdsafdsaOZpCwAdrh+I77Ws14u2UJWz4cBNnZBnS5hX/kWeUizGkPbW2AfdsafdsakuFfdsafdsanTJUQIDAQAB';
	var encrypt = new JSEncrypt();
	encrypt.setPublicKey(FD_f1342fFDFdsaf);
	
	return function(opt) {
		var form = this;
		var beforeSubmit = opt.beforeSubmit;
		opt.beforeSubmit = function(fields) {
			var result = beforeSubmit && beforeSubmit.apply(this, arguments);

			fields.forEach(function(fieldObj, i) {
				if(!!form[0][fieldObj.name].getAttribute('encrypt') == true) { 
					fieldObj.value = encrypt.encrypt(fieldObj.value);
				}
			});

			return result;
		};
		return f.apply(this, arguments);
	};
}();
```

### 使用方式
#### 表单(在要加密码的表单域中添加encrypt=true)
```html
<form id=f>
	<input type="text" name="username" /><br>
	<input type="password" name="password" encrypt=true /><br>
	<button type="button">提交</button>
</form>
```

#### 调用
```javascript
$('button').click(function() {
	$('#f').ajaxSubmit({
		success: function() {
			console.log('ok');
		}
	})
})
```

通过ajaxSubmit提交表单时,添加了encrypt=true的字段发送的数据会自动进行加密

<img src="/image/formEncryp.png">
