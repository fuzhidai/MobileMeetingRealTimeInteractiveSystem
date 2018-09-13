var util = require('../../utils/util.js');  
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    ifSubmit: false,
    manage_password: '',
    title_personage: '../../assets/images/iconfont-title_personage.png',
    title_company: '../../assets/images/iconfont-title_company.png',
    title_conference: '../../assets/images/iconfont-title_conference.png',
    title_introduction: '../../assets/images/iconfont-introduction.png',
    title_other: '../../assets/images/iconfont-title_other.png',
    title_time: '../../assets/images/iconfont-title_time.png',

    array: ['点击这里选择（必选）','普通大型会议', '专业性会议', '专题研讨性会议', '非正式研讨会','论坛','讲座','培训课程','公司内部会议','娱乐型会议'],
    index: 0,
    date: '2016-09-01',
    time: '12:01',
    begin_date: '2016-09-01',
    begin_time: '12:01',
    over_date: '2016-09-01',
    over_time: '12:01',
    place: '点击这里选择',
    logo: 'none',
    logo_type: 'none',
    cover: 'none',
    cover_type: 'none',
    operation: 'register',
    info: {},
    id: '',
    old_logo: '',
    old_cover: '',
    open: false,
    password: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })

    var that = this
    //设置当前类型：注册/修改
    this.setData({ operation: options.operation})
    this.$wuxToast = app.Wux().$wuxToast //提示框
    this.$wuxToptips = app.Wux().$wuxToptips

    if (that.data.operation == 'register'){
      wx.setNavigationBarTitle({
        title: '创建会议',
      })

    //获取当前时间
    var time = util.formatTime(new Date());
    time = time.replace(' ', '/');
    time = time.split('/');
    var date = time[0] + '-' + time[1] + '-' + time[2];
    time = time[3].split(':');
    time = time[0] + ':' + time[1];
    //设置初始时间为当前时间
    that.setData({
      time: time,
      date: date,
      begin_date: date,
      begin_time: time,
      over_date: date,
      over_time: time
    });  
    } else if (that.data.operation=='update'){

      wx.setNavigationBarTitle({
        title: '更新会议',
      })

            //获取当前会议编号
            that.setData({ id: options.id })
            wx.request({
              url: 'https://www.viaviai.com/thz/sever/search.php',
              data: {
                'id': that.data.id,
                'state': 'record'
              },
              header: {},
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                that.setData({ info: res.data })
                var temp_index = 1
                for (; temp_index < that.data.array.length; temp_index++) {
                  console.log(that.data.info.type)
                  console.log(that.data.array[temp_index])
                  if (that.data.info.type == that.data.array[temp_index]) {
                    break;
                  }
                }
                that.setData({
                  old_logo: that.data.info.logo,
                  old_cover: that.data.info.cover,
                  place: that.data.info.place,
                  index: temp_index,
                })
                //获取注册时的时间设置信息
                var temp_time = that.data.info.time.split(' ')
                var temp_begin = that.data.info.start_apply.split(' ')
                var temp_over = that.data.info.over_apply.split(' ')
                //设置初始时间为注册设置时间
                that.setData({
                  time: temp_time[1],
                  date: temp_time[0],
                  begin_date: temp_begin[0],
                  begin_time: temp_begin[1],
                  over_date: temp_over[0],
                  over_time: temp_over[1],
                });  
              }
            })


    } else if (that.data.operation == 'record'){

      wx.setNavigationBarTitle({
        title: '会议记录',
      })

      //向后台请求数据（已完成会议的记录）
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
        }
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

  //设置会议类型
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  //设置会议日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  //设置会议时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  //设置开始报名日期
  bindDateChange_begin: function (e) {
    this.setData({
      begin_date: e.detail.value
    })
  },

  //设置开始报名时间
  bindTimeChange_begin: function (e) {
    this.setData({
      begin_time: e.detail.value
    })
  },

  //设置结束报名日期
  bindDateChange_over: function (e) {
    this.setData({
      over_date: e.detail.value
    })
  },

  //设置结束报名时间
  bindTimeChange_over: function (e) {
    this.setData({
      over_time: e.detail.value
    })
  },

  //获取文件的后缀名
  getFileName: function (e){
    var arr = e.split('.');
    return arr[arr.length - 1];
  },

  btn_manage_password: function(e){
    this.setData({ manage_password: e.detail.value});
  },

  //设置会议地点
  choose_place: function () {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        if (res.name.length == 0) {
          wx.showToast({
            title: '请选择地点',
            image: '../../images/hint1.png',
            duration: 1500
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        }
        that.setData({ place: res.name })
      },
    })
  },

  //选择logo图片，并保存路径
  upload_LOGO: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFiles = res.tempFiles
        if (tempFiles.size > 1024*1024) {
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
          var logo = that.getFileName(tempFilePaths[0])
          that.setData({ logo: tempFilePaths[0]})
          that.setData({logo_type: logo})
        }
      },
    })
  },

  //选择封面图片，并保存路径
  upload_cover: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFiles = res.tempFiles
        if (tempFiles.size > 1024 * 1024 * 2) {
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
          var cover = that.getFileName(tempFilePaths[0])
          that.setData({ cover: tempFilePaths[0] })
          that.setData({ cover_type: cover })
        }
      },
    })
  },

  btn_open: function (event) {
    var that = this;
    this.setData({
      open: true,
      over_date: that.data.date,
      over_time: that.data.time
    })
  },

  btn_close: function (event) {
    this.setData({ open: false })
  },

  btn_open_password: function (event) {
    this.setData({ password: true })
  },

  btn_close_password: function (event) {
    this.setData({ password: false })
  },

  //生成UID，用于保存为上传图片路径名
  getuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  },

  getNowtime: function () {
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

  //提交表单
  formSubmit: function (e) {

    var that = this;
    var uid = that.getuid();
    var place = {place: this.data.place};
    var operation = { operation: this.data.operation};
    var id = {id: this.data.id};
    var apply = {apply: this.data.open};

    //获取当前时间
    var now_time = this.getNowtime();

    //设置logo和封面文件信息
    if (that.data.logo!='none') {
      var logo_path = this.data.logo;
      var logo = { logo: uid + '.' + that.data.logo_type };
      that.setData({ logo: uid + '.' + that.data.logo_type});
    } else {
      var logo = { logo: ''};
    }

    if (that.data.cover!='none') {
      var cover_path = this.data.cover;
      var cover = { cover: uid + '.' + that.data.cover_type };
      that.setData({ cover: uid + '.' + that.data.cover_type });
    } else {
      var cover = { cover: ''};
    }

    //获取会议创建时间
    var timestamp = new Date().getTime();
    var create_time = {
      create_time: timestamp
    }

    //设置会议状态
    var state = {
      state: 'prepare'
    }

    //设置个人信息
    var info = {
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl
    }

    //将相关信息插入表单
    var openid = { openid: app.globalData.openid};
    e.detail.value = Object.assign(e.detail.value, place, logo, cover, openid, operation, id, apply, create_time, state, info);

    //提交信息前，前端检查信息的准确性
    if (e.detail.value.name.length == 0) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请填写负责人姓名',
        success: () => console.log('toptips请填写负责人姓名')
      })
    } else if (e.detail.value.telephone.length == 0) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请填写负责人电话',
        success: () => console.log('toptips请填写负责人电话')
      })
    } else if (e.detail.value.sponsor.length == 0) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请填写主办方信息',
        success: () => console.log('toptips请填写主办方信息')
      })
    } else if (e.detail.value.theme.length == 0) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请填写会议主题',
        success: () => console.log('toptips请填写会议主题')
      })
    } else if (e.detail.value.type == 0) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请选择会议类型',
        success: () => console.log('toptips请选择会议类型')
      })
    } else if (e.detail.value.manage_password.length != 6) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请正确设置管理密码',
        success: () => console.log('请正确设置管理密码')
      })
    }  else if (e.detail.value.date == this.data.temp_date && e.detail.value.time == this.data.temp_time) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请设置会议时间',
        success: () => console.log('toptips请设置会议时间')
      })
    } else if (this.compareTime(now_time, e.detail.value.date + ' ' + e.detail.value.time + ':00') < 0) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '您选择的会议时间有误',
        success: () => console.log('toptips您选择的会议时间有误')
      })
    } else if (e.detail.value.place == '点击这里选择' && e.detail.value.place_info.length == 0) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请输入会议地点信息',
        success: () => console.log('toptips请输入会议地点信息')
      })
    } else if (that.data.open && (this.compareTime(now_time, e.detail.value.over_date + ' ' + e.detail.value.over_time + ':00') < 0 || this.compareTime(e.detail.value.over_date + ' ' + e.detail.value.over_time + ':00', e.detail.value.begin_date + ' ' + e.detail.value.begin_time + ':00') > 0)) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '报名时间有误',
        success: () => console.log('toptips报名时间有误')
      })
    }else if (e.detail.value.introduction.length == 0) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请填写会议简介',
        success: () => console.log('toptips请填写会议简介')
      })
    } else if (e.detail.value.introduction.length > 140) {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '会议简介字数过多',
        success: () => console.log('toptips会议简介字数过多')
      })
    } else {
      //表单检查无误后，提交表单
      var formdata = e.detail.value;
      var index = e.detail.value.type;
      formdata.type = this.data.array[index];

      if(!that.data.ifSubmit){

        //向后端提交表单
        wx.request({

          url: 'https://www.viaviai.com/thz/sever/register.php',
          data: formdata,
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },

          success: function (res) {
            that.setData({ ifSubmit: true});
            if (that.data.logo != 'none') {
              //上传logo图片
              wx.uploadFile({
                url: 'https://www.viaviai.com/thz/sever/upload.php',
                filePath: logo_path,
                name: 'logo',
                formData: {
                  'path': encodeURI(that.data.logo),
                  'old_path': encodeURI(that.data.old_logo)
                },
              })
            }

            if (that.data.cover != 'none') {
              //上传封面图片
              wx.uploadFile({
                url: 'https://www.viaviai.com/thz/sever/upload.php',
                filePath: cover_path,
                name: 'cover',
                formData: {
                  'path': encodeURI(that.data.cover),
                  'old_path': encodeURI(that.data.old_cover)
                },
              })
            }
            //表单成功提交
            wx.showToast({
              title: '会议创建成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.hideToast()
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)

          }
        })
      }

    }
  }

})