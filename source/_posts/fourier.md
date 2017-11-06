---
title: 傅立叶变换演示
date: 2016-09-13 06:39:40
tags: [正弦波,傅立叶变换]
---

<style>
	#squareDiv,#sawtoothDiv {
		margin: 20px;
	}
</style>


设置正弦波数量<input type=number id="squareN" value=10 />
<div id=squareDiv style="height: 400px; width: 800px"></div>


设置正弦波数量<input type=number id="sawtoothN" value=10 />
<div id=sawtoothDiv style="height: 400px; width: 800px"></div>

 
<script src="http://bonjs.github.io/fourier/js/echarts-2.2.7/build/dist/echarts.js"></script>

<script>
	require.config({
		paths : {
			echarts : 'http://bonjs.github.io/fourier/js/echarts-2.2.7/src'
		}
	});
	// 按需加载
	require([
		 'echarts', 
		 'echarts/chart/line',
		 'echarts/chart/bar',
		 'echarts/chart/pie',
		 'echarts/theme/macarons',
	], function(echarts) {
		square(echarts, 'squareDiv');
		sawtooth(echarts, 'sawtoothDiv');
	});
	
	function square(echarts, el){
	
		//var n = window.location.href.match(/\w+.html\?n=(\d+)/)[1];
		
		var s;
		var f = function() {
			clearTimeout(s);
			s = setTimeout(function() {
				update();
			});
		};
		squareN.addEventListener('keydown', f);
		squareN.addEventListener('change', f);
		
		var myChart = echarts.init(document.getElementById(el), 'macarons');

		var option = {
			
			title : {
				text : '方波的傅立叶分解',
				//subtext : 'dataZoom支持',
			},
			tooltip : {
				trigger: 'item',
				formatter : function (params) {
					var date = new Date(params.value[0]);
					data = date.getFullYear() + '-'
						   + (date.getMonth() + 1) + '-'
						   + date.getDate() + ' '
						   + date.getHours() + ':'
						   + date.getMinutes();
					return data + '<br/>'
						   + params.value[1] + ', ' 
						   + params.value[2];
				}
			},
		
			legend : {
				data : ['series1', '']
			},
			grid: {
				y2: 80
			},
			xAxis : [
				{
					type : 'time',
					//splitNumber:10
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name: '正弦波',
					type: 'line',
					//showAllSymbol: false,
					data: [0]
				}, {
					name: '由2个正弦波组成的方波',
					type: 'line',
					//showAllSymbol: false,
					data: [0]
				}
			]
		};
		myChart.setOption(option, true);
		
		//setInterval(function() {
		
		function update() {
			var n = squareN.value;
			option.legend.data[1] = '由' + n + '个正弦波组成的方波';
			option.series[0].data = base(function(x) {
				return Math.sin(x / 1000);
			});
			option.series[1].data = base(function(x) {
				var sum = 0;
				for(var i = 0; i < n; i ++) {
					sum += Math.sin((2 * i + 1) * x / 1000) / (2 * i + 1);
				}
				return sum;
			});
			myChart.setOption(option, true);
		};
		update();
		//},300);
		
		function base(fn) {
			var d = [];
			var t = 1474344857460;//new Date().getTime();
			for(var i = 0; i <= 1000; i ++) {
				var x = t + 10 * i;
				d[i] = ([
					x,
					fn.call(this, x),
					0
				]);
			}
			return d;
		}
		
	}
	
	function sawtooth(echarts, el) {
	
		var s;
		var f = function() {
			clearTimeout(s);
			s = setTimeout(function() {
				update();
			});
		};
		sawtoothN.addEventListener('keydown', f);
		sawtoothN.addEventListener('change', f);
		
		var myChart = echarts.init(document.getElementById(el), 'macarons');

		var option = {
			
			title : {
				text : '锯齿波的傅立叶分解',
				//subtext : 'dataZoom支持',
			},
			tooltip : {
				trigger: 'item',
				formatter : function (params) {
					var date = new Date(params.value[0]);
					data = date.getFullYear() + '-'
						   + (date.getMonth() + 1) + '-'
						   + date.getDate() + ' '
						   + date.getHours() + ':'
						   + date.getMinutes();
					return data + '<br/>'
						   + params.value[1] + ', ' 
						   + params.value[2];
				}
			},
		
			legend : {
				data : ['series1', '']
			},
			grid: {
				y2: 80
			},
			xAxis : [
				{
					type : 'time',
					//splitNumber:10
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name: '正弦波',
					type: 'line',
					//showAllSymbol: false,
					data: [0]
				}, {
					name: '由2个正弦波组成的方波',
					type: 'line',
					//showAllSymbol: false,
					data: [0]
				}
			]
		};
		myChart.setOption(option, true);
		update();
		function update() {
			var n = sawtoothN.value;
			option.legend.data[1] = '由' + n + '个正弦波组成的锯齿波';
			option.series[0].data = base(function(x) {
				return Math.sin(x / 1000);
			});
			option.series[1].data = base(function(x) {
				var sum = 0;
				for(var i = 1; i <= n; i ++) {
					sum += Math.sin(i * x / 1000) / (i * Math.pow(-1, i));
				}
				return sum;
			});
			myChart.setOption(option, true);
		}
		//},300);
		
		function base(fn) {
			var d = [];
			var t = 1474344857460;//new Date().getTime();
			for(var i = 0; i <= 1000; i ++) {
				var x = t + 10 * i;
				d[i] = ([
					x,
					fn.call(this, x),
					0
				]);
			}
			return d;
		}
	}
	
</script>
