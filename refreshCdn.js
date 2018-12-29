const qcloudSDK = require('qcloud-cdn-node-sdk');

qcloudSDK.config({
    secretId: 'AKIDpnwvriryPhpmY8ssAIF1c2Vs33wdCTbY',
    secretKey: 'ufKo7EAvUr34wnYEkQ9pTxHn8JMFxUq1'
})

qcloudSDK.request('RefreshCdnDir', {
	'dirs.0': 'https://www.bonjs.com/'
}, (res) => {
    if(JSON.parse(res).code == 0) {
        console.log('成功刷新cdn')	
    } else {
        console.log(res)
    }
})
