<template>
  <view class="container">
    <!-- 用户登录测试 -->
    <view class="userinfo" @click="login">
        <img
            class="userinfo-avatar"
            :src="logged ? userInfo.avatarUrl : '../../../../static/img/user-unlogin.png'"
        />
        <view>
            <text class="userinfo-nickname">{{logged ? userInfo.nickName : '点击测试登录接口'}}</text>
            <text class="userinfo-nickname" v-if="logged">{{userInfo.lastLoginTime}}</text>
        </view>
    </view>


    <!-- 上传图片测试 -->
    <view class="uploader">
        <view class="uploader-text" @click="doUpload">
            <text>上传图片</text>
        </view>
        <view class="uploader-container" v-if="imgUrl">
            <img
                class="uploader-image"
                :src="imgUrl"
                @click="previewImg"
            />
        </view>
    </view>


    <!-- 上传图片测试 -->
    <view class="uploader">
        <navigator url="../addCgi/main" open-type="navigate" class="uploader-text">
            <text>快速增加 CGI</text>
        </navigator>
    </view>

    <!-- 信道连接测试 -->
    <view class="tunnel">
        <view class="tunnel-text">
            <text>信道</text>
            <switch class="tunnel-switch" @change="switchChange" color="#007AFF"/>
        </view>
        <view :class="tunnelStatus && tunnelStatus === 'connected' ? 'tunnel-text active' : 'tunnel-text disable'" @click="sendMessage">
            <text>发送消息</text>
        </view>
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
      userInfo: {},
      logged: false,
      takeSession: false,
      requestResult: '',
      imgUrl:''
    }
  },

  methods: {
    // 用户登录示例
    login () {
      if (this.logged) return

      util.showBusy('正在登录')
      var that = this

      // 调用登录接口
      qcloud.login({
        success (result) {
          if (result) {
            util.showSuccess('登录成功')
            that.userInfo = result,
            that.logged = true;
          } else {
            // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
            qcloud.request({
                url: config.service.requestUrl,
                login: true,
                success(result) {
                    util.showSuccess('登录成功')
                    that.userInfo=result.data.data,
                    that.logged=true;
                },

                fail(error) {
                    util.showModel('请求失败', error)
                    console.log('request fail', error)
                }
            })
          }
        },

          fail(error) {
              util.showModel('登录失败', error)
              console.log('登录失败', error)
          }
      })
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.takeSession= e.detail.value
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success (result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.requestResult=JSON.stringify(result.data);
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.imgUrl=res.data.imgUrl;
                    },

                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.imgUrl,
            urls: [this.imgUrl]
        })
    },

    // 切换信道的按钮
    switchChange: function (e) {
        var checked = e.mp.detail.value

        if (checked) {
            this.openTunnel()
        } else {
            this.closeTunnel()
        }
    },

    openTunnel: function () {
        util.showBusy('信道连接中...')
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            util.showSuccess('信道已连接')
            console.log('WebSocket 信道已连接')
            this.tunnelStatus='connected';
        })

        tunnel.on('close', () => {
            util.showSuccess('信道已断开')
            console.log('WebSocket 信道已断开')
            this.tunnelStatus='closed';
        })

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            util.showBusy('正在重连')
        })

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            util.showSuccess('重连成功')
        })

        tunnel.on('error', error => {
            util.showModel('信道发生错误', error)
            console.error('信道发生错误：', error)
        })

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            util.showModel('信道消息', speak)
            console.log('收到说话消息：', speak)
        })

        // 打开信道
        tunnel.open()

        this.tunnelStatus='connecting';
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
        if (!this.tunnelStatus || !this.tunnelStatus === 'connected') return
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

    /**
     * 点击「关闭信道」按钮，关闭已经打开的信道
     */
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        util.showBusy('信道连接中...')
        this.tunnelStatus='closed';
    }
  }
}
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

.userinfo, .uploader, .tunnel {
    margin-top: 40rpx;
    height: 140rpx;
    width: 100%;
    background: #FFF;
    border: 1px solid rgba(0, 0, 0, .1);
    border-left: none;
    border-right: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 300ms ease;
}

.userinfo-avatar {
    width: 100rpx;
    height: 100rpx;
    margin: 20rpx;
    border-radius: 50%;
}

.userinfo-nickname {
    font-size: 32rpx;
    color: #007AFF;
}

.uploader, .tunnel {
    height: auto;
    padding: 0 0 0 40rpx;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
}

.uploader-text, .tunnel-text {
    width: 100%;
    line-height: 52px;
    font-size: 34rpx;
    color: #007AFF;
}

.uploader-container {
    width: 100%;
    height: 400rpx;
    padding: 20rpx 20rpx 20rpx 0;
    display: flex;
    align-content: center;
    justify-content: center;
    box-sizing: border-box;
    border-top: 1px solid rgba(0, 0, 0, .1);
}

.uploader-image {
    width: 100%;
    height: 360rpx;
}

.tunnel {
    padding: 0 0 0 40rpx;
}

.tunnel-text {
    position: relative;
    color: #222;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    box-sizing: border-box;
    border-top: 1px solid rgba(0, 0, 0, .1);
}

.tunnel-text:first-child {
    border-top: none;
}

.tunnel-switch {
    position: absolute;
    right: 20rpx;
    top: -2rpx;
}

.disable {
    color: #888;
}

.service {
    position: fixed;
    right: 40rpx;
    bottom: 40rpx;
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    background: linear-gradient(#007AFF, #0063ce);
    box-shadow: 0 5px 10px rgba(0, 0, 0, .3);
    display: flex;
    align-content: center;
    justify-content: center;
    transition: all 300ms ease;
}

.service-button {
    position: absolute;
    top: 40rpx;
}

.service:active {
    box-shadow: none;
}

.request-text {
    padding: 20rpx 0;
    font-size: 24rpx;
    line-height: 36rpx;
    word-break: break-all;
}

</style>
