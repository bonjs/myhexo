---
title: 使用nodejs和阿里云api实现动态域名解析
date: 2019-03-14 14:47:18
tags: ddns
---

利用家里的宽带和树莓派建了个nas，也跟电信要了个公网ip，绑了个域名，但头痛的是电信的ip老是变化，重启路由会变化，就算不重启也时不时会变化，每次发现无法访问就得重新查下新ip重新解析下域名，也是挺麻烦的，后来发现阿里云有操作域名的api，就干脆使用api写个动态域名解析算了

### 原理：
	1，获取当前所在网络环境的公网ip
	2，调用阿里云域名解析的api，将ip绑定到域名

## 第一步：
因为我的树莓派是通过路由桥接在网络中的，无法直接获取当前的公网ip，可以使用外网接口还获取，我这里使用的是搜狐的`http://pv.sohu.com/cityjson`，请求返回格式为:

```javascript
var returnCitySN = {"cip": "1.1.1.1", "cid": "110000", "cname": "北京市"};
```
其中的`cip`就是当前网络所使用的公网ip，我们可使用正则来获取
```javascript
/**
 * 获取当前公网ip
 * @returns {String} ip
 */
async function getPublicIP() {
	var url = 'http://pv.sohu.com/cityjson';
	return (await axios.get(url)).data.match(/(?:\d+\.){3}\d+/)[0];
}
```

## 第二步
要调用阿里云的api，首先要创建`AccessKey`（该`AccessKey`是阿里云API的密钥，要妥善保管），创建后会生成一个`AccessKey ID`以及对应的`Access Key Secret`

阿里云提供了操作api的npm包`@alicloud/pop-core`,我们可以能过它来更方便的操作api
```javascript
const Core = require('@alicloud/pop-core');
var client = new Core({
	accessKeyId: '你自己的accessKeyId',
	accessKeySecret: '你自己的accessKeySecret',
	endpoint: 'https://alidns.aliyuncs.com',
	apiVersion: '2015-01-09'
});
```

查得修改解析记录的api为`UpdateDomainRecord`，	文档地址如下	
`https://help.aliyun.com/document_detail/29774.html?spm=a2c4g.11186623.6.647.29d25eb4T4xhWt`，
#### 需要传递:
	1，RecordId（解析记录的ID）
	2，RR（主机记录）
	3，Type（记录类型）
	4，Value（记录值）

```javascript

/**
 * 根据RecordId更新记录值
 * @param {*} RecordId 记录id
 * @param {*} RR 主机记录
 * @param {*} value 记录值
 * @param {*} type 记录类型
 * @returns {Promise} 
 */
async function UpdateDomainRecord(RecordId, RR, value, type) {

	var params = {
		"RecordId": RecordId,//"3359310782893056",
		"RR": RR,//"www",
		"Type": type, //"A",
		"Value": value, //"bonjs.com"
	}

	var requestOption = {
		method: 'POST'
	};

	return new Promise(function(resolve, reject) {
		
		client.request('UpdateDomainRecord', params, requestOption).then((result) => {
			resolve(result);
		}, (ex) => {
			console.log(ex.message);
		})
	})

}

```

其中`RecordId`我们需要通过另一个解析列表的api（`DescribeDomainRecords`）还获取
#### DescribeDomainRecords:
	1，DomainName（域名）

```javascript

/**
 * 根据域名获取解析记录
 * @param {String} domain 
 * @returns {Promise} 解析记录列表
 */
async function DescribeDomainRecords(domain) {

	var params = {
		"DomainName": domain
	}

	var requestOption = {
		method: 'POST'
	};

	return new Promise(function(resolve, reject) {

		client.request('DescribeDomainRecords', params, requestOption).then((result) => {
			resolve(result.DomainRecords.Record)
		}, (ex) => {
			console.log(ex);
		})
	})

}

```


调用

```javascript
async function main() {

	// 获取当前网络的公网ip
	var ip = await getPublicIP();
	var domain = 'bonjs.com';
	console.log('ip: ' + ip)
	console.log('domain: ' + domain)

	// 获取指定域名下的解析记录列表
	var recordsList = await DescribeDomainRecords('bonjs.com');

	// 从列表中获取指定的RecordId
	var RecordId = recordsList.find(function(it) {
		return it.RR == '@';
	}).RecordId;

	var result = await UpdateDomainRecord(RecordId, '@', ip, 'A');

	console.log(result);
}

main();

```

我们可以在该文件顶端加上`#!/usr/bin/env node`做为linux脚本，然后设置下linux定时任务,每隔一定时间执行
编辑`/etc/crontab`文件，增加：
```bash
*/30 * * * *   root    /home/pi/workspace/ddns/index.js
```
表示每隔30分钟执行一次







