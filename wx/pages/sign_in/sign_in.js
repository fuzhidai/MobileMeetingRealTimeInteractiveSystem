var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scan_code_icon: '../../assets/images/iconfont-scan_code.png',
    personage_icon: '../../assets/images/iconfont-personage.png',
    wifi_icon: '../../assets/images/iconfont-wifi.png',
    function: '../../assets/images/iconfont-title_function.png',
    title_signin: '../../assets/images/iconfont-title_signin.png',
    title_record: '../../assets/images/iconfont-title_record.png',
    title_photo: '../../assets/images/iconfont-title_photo.png',
    id: '',
    choose: false,
    type: '',
    name: '',
    telephone: '',
    QR: false,
    personage: false,
    WIFI: false,
    sign_in: "false"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })
    that.setData({id: options.id});
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
      success: function(res) {
        that.setData({
          QR: res.data.QR_sign,
          personage: res.data.personage_sign,
          WIFI: res.data.WIFI_sign,
          sign_in: res.data.sign_in
        })
      },
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

  CurentTime: function () {   
    var now = new Date();  
          
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  

    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss = now.getSeconds();           //秒  

    var clock = year + "-";  
          
    if(month < 10)  
            clock += "0";  
          
    clock += month + "-";  
          
    if(day < 10)  
            clock += "0";  
              
    clock += day + " ";  
          
    if(hh < 10)  
            clock += "0";  
              
    clock += hh + ":";  
    if(mm < 10) clock += '0';   
    clock += mm + ":";   
           
    if(ss < 10) clock += '0';   
    clock += ss;   
    return(clock);

  },  

  btn_QR: function () {
    // 只允许从相机扫码
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        var type = res.result.split(':')[0];
        var client_id = res.result.split(':')[1];
        var openid = app.globalData.openid;

        if (type == 'sign_in') {

          if (client_id == (parseInt(that.id) + 123456) ^ 31415926){
            wx.request({
              url: 'https://www.viaviai.com/thz/sever/signin.php',
              data: {
                'state': 'sign_in',
                'id': that.data.id,
                'openid': app.globalData.openid,
                'nickname': app.globalData.userInfo.nickName,
                'head_portrait': app.globalData.userInfo.avatarUrl,
                'type': that.data.type,
                'time': that.CurentTime(),
                'name': 'null',
                'telephone': 'null'
              },
              header: {},
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: function(res) {

                wx.sendSocketMessage({
                  data: '{"type":"new_sign_in","id":"' + that.data.id + '","nickName":"' + app.globalData.userInfo.nickName + '","head_portrait":"' + app.globalData.userInfo.avatarUrl+'"}'})

                wx.showToast({
                  title: '签到成功',
                  icon: 'success',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.hideToast()
                }, 2000)
                wx.navigateBack({
                  delta: 1,
                })
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          }

        }
      }
    })
  },

  btn_personage: function () {

    var that = this;
    that.setData({
      choose: true,
      type: 'personage'
    });

  },

  btn_WIFI: function () {

  },

  name: function (event) {
    this.setData({ name: event.detail.value});
  },

  telephone: function (event) {
    this.setData({ telephone: event.detail.value });
  },

  submit: function () {

    var that = this;
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/signin.php',
      data: {
        'state': 'sign_in',
        'id': that.data.id,
        'openid': app.globalData.openid,
        'nickname': app.globalData.userInfo.nickName,
        'head_portrait': app.globalData.userInfo.avatarUrl,
        'type': that.data.type,
        'time': that.CurentTime(),
        'name': that.data.name,
        'telephone': that.data.telephone
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {

        wx.sendSocketMessage({
          data: '{"type":"new_sign_in","id":"' + that.data.id + '","nickName":"' + app.globalData.userInfo.nickName + '","head_portrait":"' + app.globalData.userInfo.avatarUrl + '"}'
        })
        
        that.setData({
          sign_in: "true",
          choose: false
        })

        //表单成功提交
        wx.showToast({
          title: '签到成功！',
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