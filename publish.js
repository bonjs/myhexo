
var bucket = 'blog-1253680661';
var region = 'ap-beijing';


var fs = require('fs')
var path = require('path');
// 引入模块
var COS = require('cos-nodejs-sdk-v5');
// 创建实例
var cos = new COS({
    AppId: '11111111',
    SecretId: 'ddddddddddddddddddddddddddd',
    SecretKey: 'ccccccccccccccccccccccccccc',
});



var fileList = [];

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
 function fileDisplay(filePath) {
	//根据文件路径读取文件，返回文件列表
	 var files = fs.readdirSync(filePath);
	 
	 //遍历读取到的文件列表
	 files.forEach(function (filename) {
		//获取当前文件的绝对路径
		var filedir = path.join(filePath, filename);
		//根据文件路径获取文件信息，返回一个fs.Stats对象
		var stats = fs.statSync(filedir)
		var isFile = stats.isFile(); //是文件
		var isDir = stats.isDirectory(); //是文件夹
		if (isFile) {
			//console.log(filedir)
			fileList.push(filedir);
		}
		if (isDir) {
			 fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
		}
	});
	
}


//调用文件遍历方法
fileDisplay(path.resolve('./web'));

var files = fileList.reduce(function(arr, it, i) {
	arr.push({
		Bucket: bucket, //'my-1253680661',
		Region: region, //'ap-beijing',
		Key: it.replace(path.resolve('./web') + '/', ''),
		FilePath: it
	});
	
	return arr;
}, []);


var filepath = path.resolve(__dirname, 'web');

console.log('\n**************** 开始发布到腾讯云对象存储 ***************\n');


cos.uploadFiles({
	files: files,
	/*
	files: [{
		Bucket: 'my2-1253680661',
		Region: 'ap-beijing',
		Key: 'test/1.txt',
		FilePath: './1.txt'
	}],
	*/
	SliceSize: 1024 * 1024,
	onProgress: function (info) {
		var percent = parseInt(info.percent * 10000) / 100;
		var speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
		console.log(' ' + percent + '%\t' + speed + 'Mb/s;');
	},
	onFileFinish: function (err, data, options) {
		
		//console.log(options.Key + ' 上传' + (err ? '失败' : '完成'));
	},
}, function (err, data) {
	console.log('上传结束')
	//console.log(err || data);
	//fs.unlinkSync(filepath);
});

