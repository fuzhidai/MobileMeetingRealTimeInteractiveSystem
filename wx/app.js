Object.assign = Object.assign && typeof Object.assign === 'function' ? Object.assign : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key] } } } return target }
Array.from = Array.from && typeof Array.from === 'function' ? Array.from : obj => [].slice.call(obj)

import Wux from 'components/wux'
import WxValidate from 'assets/plugins/WxValidate'

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var that = this

        console.log('success');

        wx.request({
          url: 'https://www.viaviai.com/thz/sever/openid.php',
          data: {
            code: res.code
          },
          method: 'GET',
          success: function (res) {
            that.globalData.openid = res.data.openid
            wx.connectSocket({
              url: "wss://www.viaviai.com/wss"
            });

            wx.onSocketOpen(function (res) {
              console.log('WebSocket连接已打开！');
              wx.sendSocketMessage({
                data: '{"type":"login","openid":"' + that.globalData.openid + '","client_name":"wx","room_id":"1"}'
              })
            });
          },
        })
      },
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    sign_in_choice: 0,
    openid: '',
    light: 'open',
    ScreenBrightness: '',
  },
  Wux: Wux, 
	WxValidate: (rules, messages) => new WxValidate(rules, messages), 
  
})