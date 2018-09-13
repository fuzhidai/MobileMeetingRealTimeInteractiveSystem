var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.data.num++;
    if (this.data.num % 2 == 0) {
      wx.switchTab({
        url: '../user_center/user_center'
      });
    } else {
      wx.getStorage({
        key: 'currentConference',
        complete: function (res) {
          console.log(res.data)

          if (!res.data){
            wx.navigateTo({
              url: '../conference_list/conference_list?openid=' + app.globalData.openid + '&type=start',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }else {

          if (res.data.state=='prepare'){

            wx.navigateTo({
              url: '../manage_conference_open/manage_conference_open?current=true&type=' + res.data.type + '&id=' + res.data.id
            })

          }else if (res.data.state=='finish'){

            wx.navigateTo({
              url: '../conference_list/conference_list?openid=' + app.globalData.openid + '&type=start',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })

          }

          }

        }
      })
    }
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
    
  }
})