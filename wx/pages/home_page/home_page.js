var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    search: '../../assets/images/iconfont-search.png',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    count: 0,
    enter: "../../images/enter.png",
    place: "../../images/place.png",
    recommend_conference: [
      {
        theme: '测试推荐会议',
        place: '江南大学图书馆',
        time: '2018-01-21 09:00',
        introduction: '这是一场测试的会议',
        cover: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      }
    ],
    new_conference: [
      {
        theme: '测试推荐会议',
        place: '江南大学图书馆',
        time: '2018-01-21 09:00',
        introduction: '这是一场测试的会议',
        cover: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      }
    ],
    display_conference: [
      {
        theme: '测试最新会议',
        place: '江南大学图书馆',
        time: '2018-01-21 09:00',
        introduction: '这是一场测试的会议',
        cover: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      }
    ],
    info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '当 前',
    })
    this.$wuxDialog = app.Wux().$wuxDialog
    this.refresher = app.Wux().$wuxRefresher({
      onPulling() {
        console.log('onPulling')
      },
      onRefresh() {
        console.log('onRefresh')
        setTimeout(() => {

          //加载页面时自动请求后端数据，更新推荐会议列表
          wx.request({
            url: 'https://www.viaviai.com/thz/sever/search.php', //请求的后端接口
            data: {
              'openid': app.globalData.openid, //用户的openid
              'state': 'recommend' //操作类型为推荐
            },
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              that.setData({ recommend_conference: res.data }) //用后端请求后返回的数据来更新当前页面的推荐会议
            },
            fail: function (res) { },
            complete: function (res) { },
          })


          //加载页面时自动请求后端数据，更新最新会议列表
          wx.request({
            url: 'https://www.viaviai.com/thz/sever/search.php', //请求的后端接口
            data: {
              'openid': app.globalData.openid, //用户的openid
              'state': 'new' //操作类型为最新
            },
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
              that.setData({ new_conference: res.data }); //用后端请求后返回的数据来更新当前页面的推荐会议
              var temp = new Array(); //创建临时数组用来保存一组会议数据
              var max = that.data.count + 3; //设置当前最新会议列表的最多会议数量
              var index = that.data.count; //设置当前最新会议列表的遍历下标
              //循环当当前下标会议存在且下标数不大于最新会议列表的最多会议数量时
              while (that.data.new_conference && that.data.new_conference[index] && index < max) {
                temp.push(that.data.new_conference[index]); //将此会议添加到临时数组中
                index++; //会议列表下标递增
              }
              that.setData({ display_conference: temp }); //用临时数组的会议列表来更新展示列表数据
              that.setData({ count: index }); //保存当前最后一场会议的下标
            },
            fail: function (res) { },
            complete: function (res) { },
          })

          this.events.emit(`scroll.refreshComplete`)
        }, 2000)
      }
    })
    console.log(this.refresher)
    

    var that = this;

    //加载页面时自动请求后端数据，更新推荐会议列表
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/search.php', //请求的后端接口
      data: {
        'openid': app.globalData.openid, //用户的openid
        'state': 'recommend' //操作类型为推荐
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({ recommend_conference: res.data }) //用后端请求后返回的数据来更新当前页面的推荐会议
      },
      fail: function (res) { },
      complete: function (res) { },
    })

    //加载页面时自动请求后端数据，更新最新会议列表
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/search.php', //请求的后端接口
      data: {
        'openid': app.globalData.openid, //用户的openid
        'state': 'new' //操作类型为最新
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({ new_conference: res.data }); //用后端请求后返回的数据来更新当前页面的推荐会议
        var temp = new Array(); //创建临时数组用来保存一组会议数据
        var max = that.data.count + 3; //设置当前最新会议列表的最多会议数量
        var index = that.data.count; //设置当前最新会议列表的遍历下标
        //循环当当前下标会议存在且下标数不大于最新会议列表的最多会议数量时
        while (that.data.new_conference && that.data.new_conference[index] && index < max) {
          temp.push(that.data.new_conference[index]); //将此会议添加到临时数组中
          index++; //会议列表下标递增
        }
        that.setData({ display_conference: temp }); //用临时数组的会议列表来更新展示列表数据
        that.setData({ count: index }); //保存当前最后一场会议的下标
      },
      fail: function (res) { },
      complete: function (res) { },
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

  touchstart: function(e) {
    console.log('touchstart')
    this.refresher.touchstart(e)
  },
  touchmove: function(e) {
    console.log('touchmove')
    this.refresher.touchmove(e)
  },
  touchend: function(e) {
    console.log('touchend')
    this.refresher.touchend(e)
  }, 

  //查询详情时转入相关页面
  btn_more: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../info_conference/info_conference?id=' + id + '&type=search',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //查找会议时转入相关页面
  search: function () {
    wx.navigateTo({
      url: '../conference_list/conference_list?openid=' + app.globalData.openid + '&type=search',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //当滑至接近底层时，自动更新列表数据
  lower: function (e) {
    
    var that = this;
    var temp = that.data.display_conference; //临时数组保存当前最新会议列表数据
    var max = that.data.count + 3; //最新会议列表最大数量加三，即自动刷新添加三场会议信息
    var index = that.data.count; //保存当前最新会议列表的会议数量
    //循环当当前下标会议存在且下标数不大于最新会议列表的最多会议数量时
    while (that.data.new_conference && that.data.new_conference[index] && index < max) {
      temp.push(that.data.new_conference[index]); //将此会议添加到临时数组中
      index++; //会议列表下标递增
    }
    that.setData({ display_conference: temp }); //用临时数组的会议列表来更新展示列表数据
    that.setData({ count: index }); //保存当前最后一场会议的下标
  },

  //生成UID，用于保存为上传图片路径名
  getuid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  },

  btn_apply: function (event) {
    var that = this;
    var uid = that.getuid();
    var index = event.currentTarget.dataset.index;
    var id = event.currentTarget.dataset.id;

    if (event.currentTarget.dataset.type == 'recommend') {
      var apply = that.data.recommend_conference[index].apply
      var password = that.data.recommend_conference[index].password
    } else if (event.currentTarget.dataset.type == 'new') {
      var apply = that.data.display_conference[index].apply
      var password = that.data.display_conference[index].password
    }

    if (apply == 'true' && password) {
      var res = that.data.prompt();
      if (!res) {
        return;
      }
    }

    if (apply == 'true') {

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/search.php',
        data: {
          'state': 'ifapply',
          'id': id,
          'openid': app.globalData.openid,
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data == 'null') {
            wx.request({
              url: 'https://www.viaviai.com/thz/sever/apply.php',
              data: {
                'id': id,
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

                if (event.currentTarget.dataset.type == 'recommend') {
                  var array = that.data.recommend_conference;
                  array.splice(index,1);
                  that.setData({ recommend_conference: array });
                } else if (event.currentTarget.dataset.type == 'new') {
                  var array = that.data.display_conference;
                  array.splice(index, 1);
                  that.setData({ display_conference: array });
                }

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
        fail: function (res) { },
        complete: function (res) { },
      })


    } else if (apply == 'false') {
      wx.showToast({
        title: '暂未开启报名',
        image: '../../images/hint1.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (apply == 'over') {
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

  prompt(password) {
    const that = this
    const alert = (content) => {
      this.$wuxDialog.alert({
        title: '会议密码',
        content: content,
      })
    }

    that.$wuxDialog.prompt({
      title: '提示',
      content: '密码为6位数字',
      fieldtype: 'number',
      password: !0,
      defaultText: '',
      placeholder: '请输入会议密码',
      maxlength: 6,
      onConfirm(e) {
        const value = that.data.$wux.dialog.prompt.response;
        if (value != password) {
          alert('会议密码错误');
          return false;
        } else {
          return true;
        }
      },
    })
  },

})