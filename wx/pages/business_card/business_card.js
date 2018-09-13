var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'choose',
    info: '',
    save_openid: '',
    card_list: '',
    title_company: '../../assets/images/iconfont-title_card_company.png',
    title_name: '../../assets/images/iconfont-title_name.png',
    title_position: '../../assets/images/iconfont-title_position.png',
    title_phone: '../../assets/images/iconfont-title_phone.png',
    title_wechat: '../../assets/images/iconfont-title_wechat.png',
    title_email: '../../assets/images/iconfont-title_email.png',
    title_address: '../../assets/images/iconfont-title_address.png',
    title_qq: '../../assets/images/iconfont-title_qq.png',
    title_cards: '../../assets/images/iconfont-title_cards.png',
    mycard: '../../assets/images/iconfont-mycard.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({ type: options.type })
    if (that.data.type=='choose'){

      wx.setNavigationBarTitle({
        title: '名 片 管 理',
      })

    }else if(that.data.type=='set_info'){

      wx.setNavigationBarTitle({
        title: '我 的 名 片',
      })

      wx.request({
        url: 'https://www.viaviai.com/thz/thz/sever/collect.php',
        data: {
          'type': 'get_info',
          'openid': app.globalData.openid
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.setData({
            info: res.data,
          });
        },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else if (that.data.type == 'save_info' || that.data.type =='more_info'){

      wx.setNavigationBarTitle({
        title: '名 片',
      })
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/collect.php',
        data: {
          'type': 'get_info',
          'openid': options.openid
        },        
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          that.setData({
            info: res.data,
            save_openid: options.openid
          });
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }else if (that.data.type=='list'){

      wx.setNavigationBarTitle({
        title: '名片列表',
      })
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/collect.php',
        data: {
          'type': 'get_card',
          'openid': app.globalData.openid
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.setData({
            card_list: res.data,
          });
        },
        fail: function (res) { },
        complete: function (res) { },
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

  formSubmit: function (e) {

    var that = this;
    var openid = app.globalData.openid;
    // console.log(e.detail.value)

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/collect.php',
      data: {
        'type': 'info',
        'openid': openid,
        'info': e.detail.value
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

  save: function(){

    var that = this;
    var id = that.data.save_openid;
    var openid = app.globalData.openid;
    var time = that.CurentTime();

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/collect.php',
      data: {
        'id': id,
        'type': 'card',
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

  btn_mycard: function() {

    wx.navigateTo({
      url: 'business_card?type=set_info',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  btn_card_list: function() {
    wx.navigateTo({
      url: 'business_card?type=list',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_more_info: function(event) {
    var that = this;
    var index = event.currentTarget.id; //保存当前的下标
    var openid = that.data.card_list[index]['openid'];
    wx.navigateTo({
      url: 'business_card?type=more_info&openid=' + openid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }

})