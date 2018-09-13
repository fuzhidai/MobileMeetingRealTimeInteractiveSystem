var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    request_id: '',
    type: 'check',
    barrage: 'false',
    auto_detect: 'false',
    manual_detect: 'false',
    open: '../../assets/images/iconfont-open.png',
    close: '../../assets/images/iconfont-close.png',
    barrage_icon: '../../assets/images/iconfont-barrage.png',
    barrage_check: '../../assets/images/iconfont-barrage_check.png',
    title_record: '../../assets/images/iconfont-title_record.png',
    title_photo: '../../assets/images/iconfont-title_photo.png',
    choose_index: 0,    
    barrage_list: [
      {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      }, {
        nickname: 'Error_',
        content: '这里是测试啊啊啊啊啊啊啊啊',
      },
    ]
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '弹 幕 管 理',
    })
    var that = this;
    that.setData({ 
      id: options.id,
      type: options.type,
    });

    if (app.globalData.light=='close'){
      wx.setScreenBrightness({
        value: 0.1,
      })
    }

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/manage.php',
      data: {
        'operation': 'search',
        'type': 'barrage',
        'openid': app.globalData.openid,
        'id': options.id,
        'if_manage': 'true'
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          barrage: res.data[0],
          auto_detect: res.data[1],
          manual_detect: res.data[2]
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/barrage.php',
      data: {
        'id': options.id,
        'operation': 'get_list',
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({barrage_list: res.data});
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data);
      var info = JSON.parse(res.data);
      
      if (info.type == 'change' && info.module =='barrage'){
        console.log(info.state);
        that.setData({ barrage:info.state});
      }
      if (info.type == 'change' && info.module == 'manual_detect') {
        console.log(info.state);
        that.setData({ manual_detect: info.state });
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
    clearInterval(this.data.request_id);
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

  btn_choose: function(e) {

    var that = this;
    var index = e.currentTarget.id;
    that.setData({choose_index: index});

  },

  btn_detect: function () {
    var id = this.data.id;
    wx.navigateTo({
      url: 'barrage?type=detect&id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_barrage: function() {
    var that = this;

    if (that.data.barrage == 'false') {
      var temp = 'true';
    } else {
      var temp = 'false';
    }

    // wx.request({
    //   url: 'https://www.viaviai.com/thz/sever/manage.php',
    //   data: {
    //     'operation': 'change',
    //     'id': that.data.id,
    //     'type': 'barrage',
    //     'state': temp,
    //     'if_manage': 'true'
    //   },
    //   header: {},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function (res) {
    //     that.setData({ barrage: temp })
    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })

    wx.sendSocketMessage({
      data: '{"type":"change","operation":"change","id":"' + that.data.id + '","module":"barrage","state":"' + temp + '","if_manage":"true","openid":"' + app.globalData.openid + '"}'
    })

  },

  btn_autoDetect: function() {

    var that = this;

    if (that.data.auto_detect == 'false') {
      var temp = 'true';
    } else {
      var temp = 'false';
    }

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/manage.php',
      data: {
        'operation': 'change',
        'id': that.data.id,
        'type': 'auto_detect',
        'state': temp,
        'if_manage': 'true'
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({ auto_detect: temp })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  btn_manualDetect: function(){

    var that = this;

    if (that.data.manual_detect == 'false') {
      var temp = 'true';
    } else {
      var temp = 'false';
    }

    // wx.request({
    //   url: 'https://www.viaviai.com/thz/sever/manage.php',
    //   data: {
    //     'operation': 'change',
    //     'id': that.data.id,
    //     'type': 'manual_detect',
    //     'state': temp,
    //     'if_manage': 'true'
    //   },
    //   header: {},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function (res) {
    //     that.setData({ manual_detect: temp })
    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })

    wx.sendSocketMessage({
      data: '{"type":"change","operation":"change","id":"' + that.data.id + '","module":"manual_detect","state":"' + temp + '","if_manage":"true","openid":"' + app.globalData.openid + '"}'
    })

  },

  btn_emphasis:function() {

    var that = this;
    var index = that.data.choose_index;
    var barrage_id = that.data.barrage_list[index].id;
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/barrage.php',
      data: {
        'id': that.data.id,
        'barrage_id': barrage_id,
        'operation': 'detect',
        'detection': 'emphasis'
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  btn_ignore: function() {

    var that = this;
    var index = that.data.choose_index;
    var barrage_id = that.data.barrage_list[index].id;
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/barrage.php',
      data: {
        'id': that.data.id,
        'barrage_id': barrage_id,
        'operation': 'detect',
        'detection': 'fail'
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  btn_upwall: function() {

    var that = this;
    var index = that.data.choose_index;
    var barrage_id = that.data.barrage_list[index].id;
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/barrage.php',
      data: {
        'id': that.data.id,
        'barrage_id': barrage_id,
        'operation': 'detect',
        'detection': 'success'
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

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