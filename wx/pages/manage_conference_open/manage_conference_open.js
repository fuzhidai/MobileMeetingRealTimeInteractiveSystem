var app = getApp();
var isShow = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    light: 'open',
    locks: 0,
    focus: false,
    current: "false",
    barrage_content: '',
    picture: '',
    picture_type: '',
    picture_icon: '../../assets/images/iconfont-picture.png',
    sign_in: '../../assets/images/iconfont-sign_in.png',
    prize: '../../assets/images/iconfont-conference_prize.png',
    barrage: '../../assets/images/iconfont-barrage.png',
    note: '../../assets/images/iconfont-note.png',
    vote: '../../assets/images/iconfont-vote.png',
    photo: '../../assets/images/iconfont-photo.png',
    question: '../../assets/images/question.png',
    close_light: '../../assets/images/iconfont-close_light.png',
    open_light: '../../assets/images/iconfont-open_light.png',
    picture: '../../assets/images/send_picture.png',
    file: '../../assets/images/iconfont-file.png',
    setting: '../../assets/images/iconfont-setting.png',
    navigator: '../../assets/images/iconfont-navigator.png',
    over: '../../assets/images/iconfont-over.png',
    now: '../../assets/images/iconfont-now.png',
    place_icon: '../../assets/images/iconfont-place_info.png',
    scrollTop: 0,
    info: {},
    type: 'attend',
    lottery_position: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '当 前 会 议',
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })

    var that = this;
    this.$wuxBackdrop = app.Wux().$wuxBackdrop.init()
    that.setData({
      type: options.type,
      light: app.globalData.light
    });

    wx.getStorage({
      key: 'currentConference',
      complete: function (res) {
        console.log(res.data)
        var current_id = 0;

        if (res.data){
          current_id = res.data.id;
        }

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
            that.setData({ info: res.data });
            if (current_id == res.data.id) {

              that.setData({ current: 'true' })
              var type = { type: that.data.type };
              res.data = Object.assign(res.data, type)
              wx.setStorage({
                key: 'currentConference',
                data: res.data,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })

            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })

      }
    })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data);
      var info = JSON.parse(res.data);

      if (info.type == 'win_prize_inform') {
        
        wx.showModal({
          title: '提示',
          content: '恭喜您已中奖！',
          showCancel: false,
          confirmColor: '#1d93ec',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })


      } else if (info.type == 'race_to_control_start'){
        console.log('ojb98k!');

        var max = 100;
        var min = 0;
        var left = Math.floor(Math.random() * (max - min + 1) + min);
        var top = Math.floor(Math.random() * (max - min + 1) + min);
        var temp_lottery_position = 'position:fixed;left:'+left+'%;top:'+top+'%;';
        that.setData({
          lottery_position: temp_lottery_position
        });
        that.retain();
      }

    });
    wx.sendSocketMessage({
      data: '{"type":"login","client_name":"w_x","room_id":"' + options.id + '"}'
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
    var that = this;
    this.isShow = true;
    wx.onAccelerometerChange(function (e) {
      if (!that.isShow) {
        return
      }

      if (e.x > 1 || e.y > 1 || e.z > 1) {

        console.log(e.x)
        console.log(e.y)
        console.log(e.z)

        wx.sendSocketMessage({
          data: '{"type":"new_shark","nickName":"' + app.globalData.userInfo.nickName + '","avatarUrl":"' + app.globalData.userInfo.avatarUrl + '","openid":"' + app.globalData.openid + '","id":"' + that.data.info.id + '"}'
        })

        wx.showToast({
          title: '摇一摇成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.isShow = false;
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

  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },

  btn_close: function () {
    wx.redirectTo({
      url: '../manage_conference_close/manage_conference_close',
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

  btn_collect: function (e) {

    var that = this;
    var id = that.data.info.id;
    var openid = app.globalData.openid;
    var time = that.CurentTime();

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/collect.php',
      data: {
        'id': id,
        'type': 'conference',
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

  sign_in: function () {

    var id = this.data.info.id;
    var theme = this.data.info.theme;

    if (this.data.type=='create'){
      wx.navigateTo({
        url: '../sign_in_manage/sign_in_manage?id=' + id + '&theme=' + theme,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.navigateTo({
        url: '../sign_in/sign_in?id=' + id,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },

  btn_vote_manage: function() {
    var id = this.data.info.id;
    var theme = this.data.info.theme
    var time = this.data.info.time
    wx.navigateTo({
      url: '../vote_manage/vote_manage?type=choose&id=' + id + '&theme=' + theme + '&time=' + time,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  btn_vote_attend: function () {
    var id = this.data.info.id;
    var theme = this.data.info.theme
    var time = this.data.info.time
    wx.navigateTo({
      url: '../vote_attend/vote_attend?type=list&id=' + id +'&theme=' + theme + '&time=' + time,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_barrage: function() {
    var id = this.data.info.id;
    wx.navigateTo({
      url: '../barrage/barrage?type=choose&id=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  btn_lottery: function() {
    var id = this.data.info.id;
    wx.navigateTo({
      url: '../lottery/lottery?type=set_function&id='+id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //跳转至记笔记页面
  btn_note: function () {
    var id = this.data.info.id;
    wx.navigateTo({
      url: '../note/note?type=note&id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  take_photo: function () {
    var id = this.data.info.id;
    wx.navigateTo({
      url: '../photo/photo?type=photo&id=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  btn_file: function () {
    var id = this.data.info.id;
    console.log(id)
    var identity = this.data.type;
    var openid = app.globalData.openid;
    wx.navigateTo({
      url: '../file/file?id=' + id + '&identity=' + identity + '&openid=' + openid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  input_barrage: function (e) {
    console.log(e)
    this.setData({ barrage_content: e.detail.value});
  },

  //获取文件的后缀名
  getFileName: function (e) {
    var arr = e.split('.');
    return arr[arr.length - 1];
  },

  //选择图片，并保存路径
  choose_picture: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFiles = res.tempFiles
        if (tempFiles.size > 2*1024 * 1024) {
          wx.showToast({
            title: '文件过大！',
            image: '../../images/hint1.png',
            duration: 1500
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        } else {
          var tempFilePaths = res.tempFilePaths
          var type = that.getFileName(tempFilePaths[0])
          that.setData({ 
            picture: tempFilePaths[0],
            picture_type: type
          })
        }
      },
    })
  },

  //生成UID，用于保存为上传图片路径名
  getuid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  },

  btn_setting: function (){

    var that = this;
    var temp_type = that.data.type;
    var current = that.data.current;
    var info = JSON.stringify(that.data.info);
    console.log(info)
    wx.navigateTo({
      url: '../setting/setting?info=' + info + '&type=' + temp_type + '&current=' + current,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  btn_over: function () {

    var that =this;
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/register.php',
      data: {
        'operation': 'update',
        'id': that.data.info.id,
        'openid': app.globalData.openid,
        'state': 'finish'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },      
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  btn_more: function(){

    //跳转至创建会议记录
    var id = that.data.info.id;
    wx.navigateTo({
      url: '../register_conference/register_conference?operation=record&id=' + id, //id（会议ID）
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  btn_send: function () {

    var that = this;
    var uid = that.getuid();

    if (that.data.picture) {
      var picture_path = this.data.picture;
      that.setData({ picture: uid + '.' + that.data.picture_type });
    }

    if (that.data.barrage_state=='false'){
      wx.showToast({
        title: '暂未开启弹幕',
        icon: 'loading',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (that.data.barrage_content.length == 0) {

      wx.showToast({
        title: '内容不得为空',
        icon: 'loading',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)

    } else {

      var timestamp = (new Date()).valueOf();
      // wx.request({
      //   url: 'https://www.viaviai.com/thz/sever/barrage.php',
      //   data: {
      //     'id': that.data.info.id,
      //     'operation': 'save',
      //     'openid': app.globalData.openid,
      //     'time': timestamp,
      //     'nickname': app.globalData.userInfo.nickName,
      //     'head_portrait': app.globalData.userInfo.avatarUrl,
      //     'content': that.data.barrage_content,
      //     'picture': that.data.picture,
      //   },
      //   header: {},
      //   method: 'GET',
      //   dataType: 'json',
      //   responseType: 'text',
      //   success: function(res) {
      //     if (that.data.picture) {
      //       //上传logo图片
      //       wx.uploadFile({
      //         url: 'https://www.viaviai.com/thz/sever/upload.php',
      //         filePath: picture_path,
      //         name: 'barrage',
      //         formData: {
      //           'path': encodeURI(that.data.picture),
      //           'old_path': ''
      //         },
      //       })
      //     }
      //   },
      //   fail: function(res) {},
      //   complete: function(res) {},
      // })

      wx.sendSocketMessage({
        data: '{"type":"barrage","time":"' + timestamp + '","id":"' + that.data.info.id + '","nickName":"' + app.globalData.userInfo.nickName + '","avatarUrl":"' + app.globalData.userInfo.avatarUrl + '","openid":"' + app.globalData.openid + '","content":"' + that.data.barrage_content + '"}'
      })
      that.setData({ barrage_content:''});

    }

  },

  btn_navigator: function(){

    var that = this;
    if (that.data.info.place){
      var place = that.data.info.place;
    }else {
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

  },

  btn_close:function(){
    var that = this;
    wx.getScreenBrightness({
      success: function(res) {
        app.globalData.ScreenBrightness = res.value;
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.setScreenBrightness({
      value: 0.1,
      success: function(res) {
        that.setData({light:'close'});
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  btn_open:function(){
    var that = this;
    wx.setScreenBrightness({
      value: app.globalData.ScreenBrightness,
      success: function (res) {
        that.setData({ light: 'open' });
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  retain: function () {
    this.$wuxBackdrop.retain()
    this.setData({
      locks: this.$wuxBackdrop.backdropHolds
    })
  },
  release: function () {
    var that = this;
    wx.sendSocketMessage({
      data: '{"type":"new_race","nickName":"' + app.globalData.userInfo.nickName + '","avatarUrl":"' + app.globalData.userInfo.avatarUrl + '","openid":"' + app.globalData.openid + '","id":"' + that.data.info.id + '"}'
    })
    this.$wuxBackdrop.release()
    this.setData({
      locks: this.$wuxBackdrop.backdropHolds
    })
  }

})