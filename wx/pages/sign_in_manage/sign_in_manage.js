var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    theme: '',
    QR_sign: "false",
    personage_sign: "false",
    WIFI_sign: "false",
    WIFI_setting: false, //是否进入WIFI设置页面
    severe: false, //WIFI严格度默认为轻度
    SSID: '', //WIFI-SSID（WIFI名称）
    BSSID: '', //WIFI-ID
    WIFI_password: '', //WIFI-password
    sign_wall: "false",
    open: '../../assets/images/iconfont-open.png',
    close: '../../assets/images/iconfont-close.png',
    QR_icon: '../../assets/images/iconfont-QR.png',
    personage_icon: '../../assets/images/iconfont-personage.png',
    wifi_icon: '../../assets/images/iconfont-wifi.png',
    function: '../../assets/images/iconfont-title_function.png',
    title_wifi: '../../assets/images/iconfont-title_wifi.png',
    title_record: '../../assets/images/iconfont-title_record.png',
    title_photo: '../../assets/images/iconfont-title_photo.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '签 到 管 理',
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })
    var that = this;
    that.setData({
      id: options.id,
      theme: options.theme
    });
    if (app.globalData.light == 'close') {
      wx.setScreenBrightness({
        value: 0.1,
      })
    }
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/signin.php',
      data: {
        'state': 'make_sure',
        'openid': app.globalData.openid,
        'id': options.id,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        if(res.data.QR_sign){
          that.setData({
          QR_sign: res.data.QR_sign,
          personage_sign: res.data.personage_sign,
          WIFI_sign: res.data.WIFI_sign,
          sign_wall: res.data.sign_wall,
        })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })   

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data);
      var info = JSON.parse(res.data);

      if (info.type == 'change' && info.module == 'QR_sign') {
        console.log(info.state);
        that.setData({ QR_sign: info.state });
      }
      if (info.type == 'change' && info.module == 'personage_sign') {
        console.log(info.state);
        that.setData({ personage_sign: info.state });
      }
      if (info.type == 'change' && info.module == 'sign_wall') {
        console.log(info.state);
        that.setData({ sign_wall: info.state });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  
  btn_QR: function() {
    var that = this;

    if (that.data.QR_sign=='false'){
      var QR = 'true';
    }else{
      var QR = 'false';
    }

    // wx.request({
    //   url: 'https://www.viaviai.com/thz/sever/manage.php',
    //   data: {
    //     'id': that.data.id,
    //     'type': 'QR_sign',
    //     'state': QR,
    //     'if_manage': 'true'
    //   },
    //   header: {},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function (res) {
    //     that.setData({ QR_sign: QR })
    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })

    wx.sendSocketMessage({
      data: '{"type":"change","operation":"change","id":"' + that.data.id + '","module":"QR_sign","state":"' + QR + '","if_manage":"true","openid":"' + app.globalData.openid + '"}'
    })
  },

  btn_personage: function() {
    var that = this;

    if (that.data.personage_sign == 'false') {
      var personage = 'true';
    } else {
      var personage = 'false';
    }

    // wx.request({
    //   url: 'https://www.viaviai.com/thz/sever/manage.php',
    //   data: {
    //     'id': that.data.id,
    //     'type': 'personage_sign',
    //     'state': personage,
    //     'if_manage': 'true'
    //   },
    //   header: {},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function(res) {
    //     that.setData({ personage_sign: personage })
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })

    wx.sendSocketMessage({
      data: '{"type":"change","operation":"change","id":"' + that.data.id + '","module":"personage_sign","state":"' + personage + '","if_manage":"true","openid":"' + app.globalData.openid + '"}'
    })
    
  },

  btn_WIFI: function () {
    var that = this;
    if (that.data.WIFI_sign == 'false') {
      var WIFI = 'true';
    } else {
      var WIFI = 'false';
    }

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/manage.php',
      data: {
        'id': that.data.id,
        'type': 'WIFI_sign',
        'state': WIFI,
        'if_manage': 'true'
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({ WIFI_sign: WIFI })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  btn_wall: function() {
    var that = this;

    if (that.data.sign_wall == 'false') {
      var sign_wall = 'true';
    } else {
      var sign_wall = 'false';
    }

    // wx.request({
    //   url: 'https://www.viaviai.com/thz/sever/manage.php',
    //   data: {
    //     'id': that.data.id,
    //     'type': 'personage_sign',
    //     'state': personage,
    //     'if_manage': 'true'
    //   },
    //   header: {},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function(res) {
    //     that.setData({ personage_sign: personage })
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })

    wx.sendSocketMessage({
      data: '{"type":"change","operation":"change","id":"' + that.data.id + '","module":"sign_wall","state":"' + sign_wall + '","if_manage":"true","openid":"' + app.globalData.openid + '"}'
    })

    if (that.data.sign_wall == 'false') {
      wx.sendSocketMessage({
        data: '{"type":"display_sign_wall","room_id":"' + that.data.id + '","openid":"' + app.globalData.openid + '"}'
      })
    }

  },

  more_WIFI: function() {
    var that = this;
    that.setData({WIFI_setting: true});
    console.log(wx.getSystemInfoSync());
  },

  sign_qr: function() {
    var id = this.data.id;
    var theme = this.data.theme;
    wx.navigateTo({
      url: '../qr_code/qr_code?type=sign_in&theme='+ theme +'&id='+ id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  more_personage: function() {
    app.globalData.sign_in_choice = 1
    wx.navigateTo({
      url: '../sign_in_info/sign_in_info',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  btn_mild: function (event) {
    this.setData({ severe: false })
  },

  btn_severe: function (event) {
    var that = this;
    this.setData({ severe: true });

    wx.startWifi({

      success: function(res) {

        console.log(res)

        wx.getWifiList({
          success: function (res) {

            wx.onGetWifiList(function (res) {

              console.log(res.wifiList)

            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  SSID: function (event) {
    this.setData({ SSID: event.detail.value });
  },

  WIFI_password: function (event) {
    this.setData({ WIFI_password: event.detail.value });
  },

  //跳转至记笔记页面
  btn_note: function () {
    var id = this.data.id;
    wx.navigateTo({
      url: '../note/note?type=note&id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_photo: function () {
    var id = this.data.id;
    wx.navigateTo({
      url: '../photo/photo?type=photo&id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

})