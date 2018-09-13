var interval = null //倒计时函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: '../../images/btn_photo.png',
    video_open: '../../images/video_open.png',
    video_close: '../../images/video_close.png',
    photo_album: '',
    video_album: '',
    change_photo: '../../images/change_photo.png',
    device_position: 'back',
    type: "photo",
    video: 'close',
    startX: '',
    endX: '',

    ss: 0,
    mm: 0,
    hh: 0,
    time: '00:00', //倒计时 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.type) {
      that.setData({ type: options.type });
    }
    wx.setNavigationBarTitle({
      title: '相机',
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000',
      animation: {},
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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

  takePhoto: function() {
    var that = this;

    const ctx = wx.createCameraContext()
    that.setData({ photo: '../../images/btn_photo_choose.png' });
    setTimeout(function () {
    that.setData({ photo: '../../images/btn_photo.png' });
    }, 250)

    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        that.setData({
        photo_album: res.tempImagePath
      })
      wx.saveImageToPhotosAlbum({
        filePath: res.tempImagePath,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      }
    })

  },

  getTime: function (options) {
    var that = this;
    var mm = that.data.mm;
    var ss = that.data.ss;
    var hh = that.data.hh

    interval = setInterval(function () {
      ss++;
      console.log(ss)
      if(ss == 60){
        mm++;
        ss = 0;
      }
      if (mm == 60) {
        hh++;
        mm = 0;
      }

      var temp_mm = mm;
      var temp_ss = ss;
      var temp_hh = hh;

      if (temp_ss < 10){
        temp_ss = '0' + temp_ss;
      }
      if (temp_mm < 10) {
        temp_mm = '0' + temp_mm;
      }
      if (temp_hh < 10) {
        temp_hh = '0' + temp_hh;
      }

      if(hh==0){
        that.setData({
          time: temp_mm + ':' + temp_ss,
          mm: mm,
          ss: ss,
          hh: hh
        })
      }else{
        that.setData({
          time: temp_hh + ':' + temp_mm + ':' + temp_ss,
          mm: mm,
          ss: ss,
          hh: hh
        })
      }

      if(that.data.video=='close'){
        that.setData({
          time: '',
          mm: 0,
          ss: 0,
          hh: 0
        })
        clearInterval(interval)
      }

    }, 1000)
  },

  error(e) {
    console.log(e.detail)
  },

  takeVideo: function () {

    var that = this;
    if (that.data.video == 'close') {
      const ctx = wx.createCameraContext()
      ctx.startRecord({})
      that.getTime();
      that.setData({ video: 'open' });

    } else if (that.data.video == 'open') {
      const ctx = wx.createCameraContext()
      ctx.stopRecord({
        success: (res) => {
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempVideoPath,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      });
      that.setData({ video: 'close' });
    }

  },

  change: function () {
    if (this.data.device_position=='back'){
      this.setData({ device_position: 'front'});
    }else{
      this.setData({ device_position: 'back' });
    }
  },

  photo: function() {
    this.setData({type: 'photo'});
  },

  video: function() {
    this.setData({type: 'video'});
  },


})