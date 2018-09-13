var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    operation: 'preview',
    info: {},
    content: '',
    note: '../../assets/images/iconfont-title_note.png',
    note_id: '',
    note_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({
      type: options.type,
    })
    if (app.globalData.light == 'close') {
      wx.setScreenBrightness({
        value: 0.1,
      })
    }

    if (that.data.type=='note'){
      wx.setNavigationBarTitle({
        title: '笔 记',
      })

      that.setData({
        id: options.id,
      })

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'note',
          'state': 'enter',
          'id': that.data.id,
          'openid': app.globalData.openid,
          'content': that.data.content
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {

          that.setData({
            note_id: res.data[0],
            content: res.data[1]
          });

        },
        fail: function (res) { },
        complete: function (res) { },
      })

    }else if (that.data.type=='collect'){
      wx.setNavigationBarTitle({
        title: '收藏的笔记',
      })

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/collect.php',
        data: {
          'type': 'get_note',
          'openid': app.globalData.openid
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          that.setData({note_list: res.data});
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }else if (that.data.type=='scan'){

      that.setData({
        id: options.id,
      })

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'note',
          'state': 'collect',
          'id': that.data.id,
          'openid': app.globalData.openid,
          'content': that.data.content
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {

          that.setData({
            note_id: res.data[0],
            content: res.data[1],
          });

        },
        fail: function (res) { },
        complete: function (res) { },
      })

    }else if (that.data.type=='opinion'){

      wx.setNavigationBarTitle({
        title: '意见反馈',
      })

    }

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

    var that = this;
    if (that.data.type == 'note'){

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'note',
          'state': 'out',
          'id': that.data.id,
          'openid': app.globalData.openid,
          'content': that.data.content
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else if (that.data.type == 'scan'){

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'note',
          'state': 'compile',
          'id': that.data.note_id,
          'openid': app.globalData.openid,
          'content': that.data.content
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    }

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

  //获取当前时间
  CurentTime: function () {
    var now = new Date(); //创建一个新的对象

    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  

    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss = now.getSeconds();           //秒  

    //格式化处理时间
    var clock = year + "-";

    if (month < 10)
      clock += "0";

    clock += month + "-";

    if (day < 10)
      clock += "0";

    clock += day + " ";

    if (hh < 10)
      clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";

    if (ss < 10) clock += '0';
    clock += ss;

    return (clock); //返回当前时间
  },

  btn_collect: function (e) {

    var that = this;
    var id = that.data.note_id;
    var openid = app.globalData.openid;
    var time = that.CurentTime();

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/collect.php',
      data: {
        'id': id,
        'type': 'note',
        'openid': openid,
        'time': time
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

  btn_opinion: function(){

    var that = this;
    var openid = app.globalData.openid;
    var time = that.CurentTime();

    if (that.data.content){
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'opinion',
          'openid': openid,
          'time': time,
          'content': that.data.content
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function () {
            wx.hideLoading();
            wx.navigateBack({
              delta: 1,
            });
          }, 2000)
        },
        fail: function (res) {
          wx.showToast({
            title: '请稍后再试',
            icon: 'loading',
            duration: 1500
          })
        },
        complete: function (res) { },
      })
    }

  },

  bindTextAreaBlur: function (e) {
    this.setData({ content: e.detail.value});
  },

  take_photo: function() {
    wx.navigateTo({
      url: '../photo/photo?type=photo',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  btn_note: function(e) {

    var that = this;
    var index = e.currentTarget.id;
    var id = that.data.note_list[index].id;

    wx.navigateTo({
      url: 'note?type=scan&id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  btn_compile: function() {
    this.setData({
      operation: 'compile',
    })
  }

})