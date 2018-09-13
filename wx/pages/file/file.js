  var app = getApp();

  Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0, //可滚动视图区域scroll-view竖向滚动条位置
    choice: 0, //数值0为未开始会议列表、数值1为已完成会议列表
    id: '', //会议ID
    index: '',
    type: 'list', //默认为选择页面
    identity: 'attend',
    ppt: '../../images/ppt.png',
    can_download: '../../assets/images/iconfont-can_download.png',
    cannot_download: '../../assets/images/iconfont-cannot_download.png',
    title_record: '../../assets/images/iconfont-title_record.png',
    title_photo: '../../assets/images/iconfont-title_photo.png',
    file_collect: '../../assets/images/iconfont-file_collect.png',
    open: '../../assets/images/iconfont-open_file.png',
    title_file: '../../assets/images/iconfont-title_file.png',
    ppt: '../../assets/images/iconfont-ppt.png',
    pptx: '../../assets/images/iconfont-pptx.png',
    docx: '../../assets/images/iconfont-word.png',
    pdf: '../../assets/images/iconfont-pdf.png',
    txt: '../../assets/images/iconfont-txt.png',
    xls: '../../assets/images/iconfont-xls.png',

    file_list_prepare: [
      {
        id: '1',
        name: '年终总结',
        type: 'pdf',
        time: '2018-01-12',
      }, {
        name: '年终总结',
        type: 'ppt',
        time: '2018-01-12'
      }, {
        name: '年终总结',
        type: 'word',
        time: '2018-01-12'
      }, {
        name: '年终总结',
        type: 'ppt',
        time: '2018-01-12'
      },
    ],
    file_list_download: [
      {
        name: '学习资料',
        type: 'ppt',
        time: '2018-01-12'
      }, {
        name: '学习资料',
        type: 'ppt',
        time: '2018-01-12'
      }, {
        name: '学习资料',
        type: 'ppt',
        time: '2018-01-12'
      }, {
        name: '学习资料',
        type: 'ppt',
        time: '2018-01-12'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '文 件 管 理',
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })

    var that = this;
    this.$wuxActionSheet = app.Wux().$wuxActionSheet;
    this.$wuxToast = app.Wux().$wuxToast

    if (app.globalData.light == 'close') {
      wx.setScreenBrightness({
        value: 0.1,
      })
    }

    if (options.identity=='attend'){

      that.setData({
        id: options.id,
        identity: options.identity
      });

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/download.php',
        data: {
          'id': options.id,
          'type': 'getAccessList',
          'openid': options.openid,
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.setData({
            file_list_prepare: res.data[0],
            file_list_download: res.data[1]
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else if (options.identity=='create'){

      that.setData({
        id: options.id,
        identity: options.identity
      });

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/download.php',
        data: {
          'type': 'manage',
          'id': options.id
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.setData({
            file_list_prepare: res.data
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else if (options.identity == 'collect'){

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/collect.php',
        data: {
          'type': 'get_file',
          'openid': app.globalData.openid
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.setData({ 
            file_list_prepare: res.data,
            identity: options.identity
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

  btn_collect: function (index) {

    var that = this;
    var id = that.data.file_list_prepare[index].id;
    var openid = app.globalData.openid;
    var time = that.CurentTime();

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/collect.php',
      data: {
        'id': id,
        'type': 'file',
        'openid': openid,
        'time': time
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {

        if (res.data){

          that.$wuxToast.show({
            type: 'success',
            timer: 1500,
            color: '#fff',
            text: '收藏成功',
            success: () => console.log('收藏成功')
          })

        }else{

          that.$wuxToast.show({
            type: 'cancel',
            timer: 1500,
            color: '#fff',
            text: '您已收藏过',
            success: () => console.log('您已收藏过')
          })

        }

      },
      fail: function (res) {
        that.$wuxToast.show({
          type: 'cancel',
          timer: 1500,
          color: '#fff',
          text: '请稍后重试',
          success: () => console.log('请稍后重试')
        })
      },
      complete: function (res) { },
    })

  },

  btn_preview: function(e) {

    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList)
        if (res.fileList.length > 0) {
          var len = res.fileList.length;
          for(var i=len; i > 0; --i){

            wx.removeSavedFile({
              filePath: res.fileList[i-1].filePath,
              complete: function (res) {
                console.log(res)
              }
            })
          }

        }
      }
    })

    var that = this;
    var index = e.currentTarget.id;
    var id = that.data.file_list_prepare[index].id;
    var filepath = that.data.file_list_prepare[index].path;
    wx.showLoading({
      title: '文件加载中',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.downloadFile({
      url: 'https://www.viaviai.com/thz/sever/upload/file/' + filepath,
      header: {},
      success: function(res) {
        wx.hideLoading();
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })

      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  btn_manage: function (e) {

    var that = this;
    var index = e.currentTarget.id;
    var file = that.data.file_list_prepare[index];
    if (file.download == 'true') {
      file.download = 'false';
    } else {
      file.download = 'true';
    }

    var file_list = that.data.file_list_prepare;
    file_list[index] = file;

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/download.php',
      data: {
        'type': 'update',
        'file_id': file.id,
        'download': file.download
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({ file_list_prepare: file_list });
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  showActionSheet1: function(e) {
    var that = this;
    var file_index = e.currentTarget.id
    file_index = {currentTarget: {id: file_index}}

    const hideSheet = this.$wuxActionSheet.show({
      titleText: '文件操作',
      buttons: [
        {
          text: '查看文件'
        },
        {
          text: '收藏文件'
        },
        {
          text: '下载文件'
        }
      ],
      buttonClicked(index, item) {

        index === 0 && that.btn_preview(file_index)

        index === 1 && that.btn_collect(file_index);

        index === 2 && wx.navigateTo({
          url: '/pages/dialog/index'
        })

        return true
      },
    })

  },

  showActionSheet2: function (e) {
    var that = this;
    var file_index = e.currentTarget.id
    file_index = { currentTarget: { id: file_index } }

    const hideSheet = this.$wuxActionSheet.show({
      titleText: '文件操作',
      buttons: [
        {
          text: '查看文件'
        },
        {
          text: '隐藏文件'
        },
        {
          text: '收藏文件'
        },
        {
          text: '下载文件'
        },
      ],
      buttonClicked(index, item) {

        index === 0 && that.btn_preview(file_index);

        index === 1 && that.btn_manage(file_index);

        index === 2 && that.btn_collect(file_index);

        index === 3 && wx.navigateTo({
          url: '/pages/dialog/index'
        })

        return true
      },
    })

  },

  showActionSheet3: function (e) {
    var that = this;
    var file_index = e.currentTarget.id
    file_index = { currentTarget: { id: file_index } }

    const hideSheet = this.$wuxActionSheet.show({
      titleText: '文件操作',
      buttons: [
        {
          text: '查看文件'
        },
        {
          text: '下载文件'
        }
      ],
      buttonClicked(index, item) {

        index === 0 && that.btn_preview(file_index)

        index === 1 && wx.navigateTo({
          url: '/pages/dialog/index'
        })

        return true
      },
    })

  },

  //点击切换至可下载的会议的页面
  btn_finish: function () {
    this.setData(
      {
        choice: 1, //1为已完成列表
        scrollTop: 0
      }
    )
  },

  //点击切换至已下载的会议的页面
  btn_prepare: function () {
    this.setData(
      {
        choice: 0, //0为未开始列表
        scrollTop: 0
      }
    )
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