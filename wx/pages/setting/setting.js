var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: '',
    current: 'false',
    open: '../../assets/images/iconfont-open.png',
    close: '../../assets/images/iconfont-close.png',
    function: '../../assets/images/iconfont-title_function.png',
    title_record: '../../assets/images/iconfont-title_record.png',
    title_photo: '../../assets/images/iconfont-title_photo.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '会 议 管 理',
    })
    var that = this;
    var info = JSON.parse(options.info);
    var type = {
      type: options.type,
    };
    if (app.globalData.light == 'close') {
      wx.setScreenBrightness({
        value: 0.1,
      })
    }
    info = Object.assign(info,type)
    that.setData({
      info: info,
      current: options.current
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

  btn_barrage: function () {
    var that = this;

    if (that.data.current == 'false') {
      that.setData({ current: 'true'})
      wx.setStorage({
        key: 'currentConference',
        data: that.data.info,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      that.setData({ current: 'false' })
    }

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