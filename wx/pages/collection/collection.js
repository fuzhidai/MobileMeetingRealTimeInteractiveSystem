Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'choose',
    photo_icon: '../../assets/images/iconfont-collect_photo.png',
    note_icon: '../../assets/images/iconfont-collect_note.png',
    conference_icon: '../../assets/images/iconfont-collect_conference.png',
    file_icon: '../../assets/images/iconfont-collect_file.png',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我 的 收 藏',
    })
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

  btn_note: function() {
    wx.navigateTo({
      url: '../note/note?type=collect',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  btn_file: function() {
    wx.navigateTo({
      url: '../file/file?identity=collect',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_conference: function() {
    wx.navigateTo({
      url: '../conference_list/conference_list?type=collect',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }

})