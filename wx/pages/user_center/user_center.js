//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_center_image: "../../images/user_center.jpg",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    conference1: "../../assets/images/iconfont-conference1.png",
    conference2: "../../assets/images/iconfont-conference2.png",
    conference3: "../../assets/images/iconfont-conference3.png",
    conference4: "../../assets/images/iconfont-conference4.png",
    business_card: "../../assets/images/iconfont-business_card.png",
    collection: "../../assets/images/iconfont-collection.png",
    contact: "../../assets/images/iconfont-contact.png",
    feedback: "../../assets/images/iconfont-feedback.png",
    enter: "../../images/enter.png",
    hint: "../../images/hint2.png",
    prize: "../../assets/images/iconfont-prize.png",
    create: "../../assets/images/iconfont-create.png",
    background: '../../assets/images/iconfont-background.png',
    title_qr: '../../assets/images/iconfont-title_qr.png',
    enter: '../../assets/images/iconfont-title_enter.png',
    my_qr: '../../assets/images/iconfont-title_qr2.png',
    scan_code: '../../assets/images/iconfont-title_scan_code.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '我  的',
    })

    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data);
    });

    wx.onSocketError(function () {
      console.log('WebSocket连接打开失败，请检查！');
    });

  },


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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

  CurentTime: function () {
    var now = new Date();

    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  

    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss = now.getSeconds();           //秒  

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
    return (clock);

  },  

  btn_start: function () {
    wx.navigateTo({
      url: '../conference_list/conference_list?openid=' + app.globalData.openid + '&type=start',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_recent: function () {
    wx.navigateTo({
      url: '../conference_list/conference_list?openid=' + app.globalData.openid + '&type=recent',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_create_list: function () {
    wx.navigateTo({
      url: '../conference_list/conference_list?openid=' + app.globalData.openid + '&type=create',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_attened: function () {
    wx.navigateTo({
      url: '../conference_list/conference_list?openid=' + app.globalData.openid + '&type=attend',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_card: function () {
    wx.navigateTo({
      url: '../business_card/business_card?type=choose',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_collect: function () {
    wx.navigateTo({
      url: '../collection/collection?type=choose',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  //创建新的会议
  btn_create: function () {

    //跳转至创建新的会议页面
    wx.navigateTo({
      url: '../register_conference/register_conference?operation=register',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  btn_lottery: function() {

    //跳转至创建新的会议页面
    wx.navigateTo({
      url: '../lottery/lottery?type=collect',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  btn_opinion: function () {

    //跳转至创建新的会议页面
    wx.navigateTo({
      url: '../note/note?type=opinion',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  btn_scanCode: function() {
    var that = this;
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        var type = res.result.split(':')[0];
        var client_id = res.result.split(':')[1];
        var openid = app.globalData.openid;
        var nickName = app.globalData.userInfo.nickName;
        var avatarUrl = app.globalData.userInfo.avatarUrl;

        if (type=='client_id'){

          wx.sendSocketMessage({
            data: '{"type":"get_list","to_client_id":"' + client_id + '","openid":"' + openid + '","nickName":"' + nickName +'","avatarUrl":"'+avatarUrl+'"}'
          })

        }else if (type=='openid'){

          wx.navigateTo({
            url: '../business_card/business_card?type=save_info&openid=' + client_id,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })

        } else if (type == 'sign_in') {

          var id = (client_id ^ 31415926) - 123456;
            wx.request({
              url: 'https://www.viaviai.com/thz/sever/signin.php',
              data: {
                'state': 'sign_in',
                'id': id,
                'openid': app.globalData.openid,
                'nickname': app.globalData.userInfo.nickName,
                'head_portrait': app.globalData.userInfo.avatarUrl,
                'type': 'qr',
                'time': that.CurentTime(),
                'name': 'null',
                'telephone': 'null'
              },
              header: {},
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {

                wx.sendSocketMessage({
                  data: '{"type":"new_sign_in","id":"' + id + '","nickName":"' + app.globalData.userInfo.nickName + '","head_portrait":"' + app.globalData.userInfo.avatarUrl + '"}'
                })

                wx.showToast({
                  title: '签到成功',
                  icon: 'success',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.hideToast()
                }, 2000)
              },
              fail: function (res) { },
              complete: function (res) { },
            })

        }


      }
    })
  },

  btn_myCode: function () {
    wx.navigateTo({
      url: '../qr_code/qr_code?type=personage',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }

})