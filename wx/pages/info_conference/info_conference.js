var util = require('../../utils/util.js'); //系统获取当前时间  
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    id: '',
    type: '',
    place: '../../images/place.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '会 议 详 情',
    })

    var that = this
    that.setData({ 
      id: options.id,
      type: options.type
    })
    if (app.globalData.light == 'close') {
      wx.setScreenBrightness({
        value: 0.1,
      })
    }

    //向后台请求数据（会议的记录数据）
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/search.php',
      data: {
        'state': 'record',
        'id': options.id
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({ info: res.data }) //更新列表数据
        //通过判断当前时间和会议的时间来判断会议是否已经结束
        if (that.compareTime(that.getNowtime(), that.data.info.time + ':00') < 0){
          that.setData({apply: 'over'});
        }
      }
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

  getNowtime: function (){
    //获取当前时间
    var now_time = util.formatTime(new Date());
    now_time = now_time.replace(' ', '/');
    now_time = now_time.split('/');
    var now_date = now_time[0] + '-' + now_time[1] + '-' + now_time[2];
    now_time = now_time[3].split(':');
    now_time = now_time[0] + ':' + now_time[1];
    now_time = now_date + ' ' + now_time + ':00';
    return now_time
  },

  //时间比较函数
  compareTime: function (startTime, endTime) {
    var startTimes = startTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');
    startTime = startTimes[1] + '-' + startTimes[2] + '-' + startTimes[0] + ' ' + startTime.substring(10, 19);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
    var thisResult = (Date.parse(endTime) - Date.parse(startTime)) / 3600 / 1000;
    return thisResult
    // if(thisResult < 0) {
    //   ("endTime小于tartTime！");
    // } else if (thisResult > 0) {
    //   ("endTime大于tartTime！");
    // } else if (thisResult == 0) {
    //   ("endTime等于tartTime！");
    // } 
  },

  //生成UID，用于保存为上传图片路径名
  getuid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  },

  btn_apply: function(){
    var that = this
    var uid = that.getuid();
    if (that.data.info.apply=='true'){

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/search.php',
        data: {
          'state': 'ifapply',
          'id': that.data.id,
          'openid': app.globalData.openid,
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if (res.data=='null'){
            wx.request({
              url: 'https://www.viaviai.com/thz/sever/apply.php',
              data: {
                'id': that.data.id,
                'state': 'apply',
                'openid': app.globalData.openid,
                'nickname': app.globalData.userInfo.nickName,
                'head_portrait': uid + '.png'
              },
              header: {},
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                wx.showToast({
                  title: '报名成功！',
                  icon: 'success',
                  duration: 2000
                })
              },
            })
          } else {
            wx.showToast({
              title: '您已经报过名',
              image: '../../images/hint1.png',
              duration: 1500
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })


    }else if(that.data.info.apply=='false'){
      wx.showToast({
        title: '暂未开启报名',
        image: '../../images/hint1.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }else if(that.data.info.apply=='over'){
      wx.showToast({
        title: '会议已经结束',
        image: '../../images/hint1.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }
  },

  btn_navigator: function () {

    var that = this;
    if (that.data.info.place) {
      var place = that.data.info.place;
    } else {
      var place = that.data.info.place_info;
    }

    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28,
          name: place
        })
      }
    })

  }

})