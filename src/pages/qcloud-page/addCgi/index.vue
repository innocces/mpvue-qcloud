<template>
  <view class="container">
    <!-- 请求按钮 -->
    <view class="list">
        <view class="list-item" @click="testCgi">
            <text>测试 CGI</text>
        </view>
        <view class="list-item">
            <text class="request-text">期望输出：{"code":0,"data":{"msg":"Hello World"}}</text>
        </view>
        <view class="list-item" v-if="requestResult">
            <text class="request-text">{{'请求结果：' + requestResult}}</text>
        </view>
    </view>

    <!-- 添加CGI指引 -->
    <view class="guide">
        <text class="headline">快速添加CGI指引</text>
        <text class="p">1. 打开 server/routes/index.js 文件，添加如下语句：</text>
        <img class="image1" src="../../../../static/img/code1.png" mode="aspectFit"/>
        <button class="copyBtn" v-if="canIUseClipboard" @click="copyCode" data-code-id="1">复制代码</button>
        <text class="p">2. 在 server/controllers 下新建一个 demo.js 文件，写入如下代码：</text>
        <img class="image2" src="../../../../static/img/code2.png" mode="aspectFit"/>
        <button class="copyBtn" v-if="canIUseClipboard" @click="copyCode" data-code-id="2">复制代码</button>
        <text class="p">3. 点击开发者工具右上角“腾讯云” - “上传测试代码”，勾选“智能上传”</text>
        <text class="p">4. 点击测试 CGI 按钮，即可看到结果</text>
    </view>

  </view>
</template>

<script>
import qcloud from '../../../vendor/wafer2-client-sdk/index';
var config = require('../../../config')
import util from '../../../utils/index.js';
export default {
  data () {
    return {
      requestResult: '',
      canIUseClipboard: wx.canIUse('setClipboardData')
    }
  },
  methods:{
    testCgi: function () {
        util.showBusy('请求中...')
        var that = this
        qcloud.request({
            url: `${config.service.host}/weapp/demo`,
            login: false,
            success (result) {
                util.showSuccess('请求成功完成')
                that.requestResult=JSON.stringify(result.data);
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        })
    },

    copyCode: function (e) {
        var codeId = e.target.dataset.codeId
        wx.setClipboardData({
            data: code[codeId - 1],
            success: function () {
                util.showSuccess('复制成功')
            }
        })
    }
  }
}

var code = [
`router.get('/demo', controllers.demo)`,
`module.exports = ctx => {
    ctx.state.data = {
        msg: 'Hello World'
    }
}`
]
</script>

<style scoped>
/**index.wxss**/
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding:0;
} 
page {
    background: #F6F6F6;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.list {
    margin-top: 40rpx;
    height: auto;
    width: 100%;
    background: #FFF;
    padding: 0 0 0 40rpx;
    border: 1px solid rgba(0, 0, 0, .1);
    border-left: none;
    border-right: none;
    transition: all 300ms ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
}

.list-item {
    width: 100%;
    padding: 0;
    line-height: 104rpx;
    font-size: 34rpx;
    color: #007AFF;
    border-top: 1px solid rgba(0, 0, 0, .1);
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.list-item:first-child {
    border-top: none;
}

.request-text {
    color: #222;
    padding: 20rpx 0;
    font-size: 24rpx;
    line-height: 36rpx;
    word-break: break-all;
}

.guide {
    width: 100%;
    padding: 40rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.guide .headline {
    font-size: 34rpx;
    font-weight: bold;
    color: #555;
    line-height: 40rpx;
}

.guide .p {
    margin-top: 20rpx;
    font-size: 28rpx;
    line-height: 36rpx;
    color: #666;
}

.guide .code {
    margin-top: 20rpx;
    background: rgba(0, 0, 0, .8);
    padding: 20rpx;
    font-size: 28rpx;
    line-height: 36rpx;
    border-radius: 6rpx;
    color: #FFF;
}

.guide .image1 {
    margin-top: 20rpx;
    max-width: 100%;
    width: 356px;
    height: 47px;
}

.guide .image2 {
    margin-top: 20rpx;
    width: 264px;
    height: 100px;
}

.guide .copyBtn {
    width: 180rpx;
    font-size: 20rpx;
    margin-top: 16rpx;
    margin-left: 0;
}


</style>
