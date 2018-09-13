var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    id: '', //会议ID
    focus: false, //input自动聚焦关闭
    type: 'choose', //默认为选择页面
    enter: '../../images/enter.png', //“进入”图标地址
    vote_icon: '../../assets/images/iconfont-vote.png',
    vote_record: '../../assets/images/iconfont-note.png',
    vote_result: '../../assets/images/iconfont-vote_result.png',
    preview: '../../assets/images/iconfont-preview.png',
    add_question: '../../assets/images/iconfont-add_question.png',
    function: '../../assets/images/iconfont-title_function.png',
    title_time: '../../assets/images/iconfont-title_time.png',
    title_record: '../../assets/images/iconfont-title_record.png',
    title_photo: '../../assets/images/iconfont-title_photo.png',
    info: {}, //保存会议信息
    vote: [], //保存投票列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '投 票 设 置',
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })
    this.setData({
      type: options.type,
      id: options.id,
      info: {
        theme: options.theme,
        time: options.time
      }
    });

    var that = this;
    if (app.globalData.light == 'close') {
      wx.setScreenBrightness({
        value: 0.1,
      })
    }
    if (options.type=='set'){ //如果操作类型为设置投票

      //当页面为设置投票时设置标题为投票设置
      wx.setNavigationBarTitle({
        title: '投 票 设 置',
      })

      //默认添加两个问题，每个问题有两个默认答案
      this.add_question() 
      this.add_question()

    } else if (options.type=='record_all'){ //如果操作类型为发起过的投票列表总览

      //请求后端投票总列表的数据
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'vote', //操作类型为投票
          'id': that.data.id, //会议ID
          'index': 'null'
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {

          //将后端传入数据设置为当前页面的显示数据
          that.setData({
            vote: res.data
          })

        },
        fail: function(res) {},
        complete: function(res) {},
      })

    } else if (options.type=='record_detail'){ //如果操作类型为投票记录详情

      var index = options.index; //投票下标
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'vote', //操作类型为投票
          'id': that.data.id, //会议ID
          'index': index //投票下标
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {

          that.setData({vote: res.data}); //将后端传入数据设置为当前页面的数据

        },
        fail: function(res) {},
        complete: function(res) {},
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

  //添加选项
  add_choice: function(event) {

    var index = event.currentTarget.id //获取当前要添加选项的问题的下标
    var votes = this.data.vote //获取当前投票列表
    votes[index].choices.push('') //添加一个选项
    this.setData({
      vote: votes //将重置后的列表保存
    })

  },

  //添加问题
  add_question: function() {

    var that = this;
    var votes = this.data.vote; //获取当前页面的投票列表

    //添加一个默认问题和两个默认选项
    votes.push({
      question: '', //问题名称
      radio: "true", //是否为单选（true为是，false为否）
      time: that.CurentTime(), //问题创建时间为当前时间
      choices: [
        '', '' //两个默认选项
      ]
    })
    this.setData({
      vote: votes //更新当前的投票列表
    })

  },

  //删除问题
  del_question: function(event) {

    var index = event.currentTarget.id //获取当前问题在当前投票列表中的下标
    var votes = this.data.vote //获取当前页面的投票列表
    votes.splice(index, 1) //投票数组列表中删除此问题及其答案
    this.setData({
      vote: votes //更新当前的投票列表
    })

  },

  del_choice:  function(event) {

    var choice_index = event.currentTarget.id //获取当前选项在问题中的下标
    var question_index = event.currentTarget.dataset.question_id //获取当前问题在当前投票列表中的下标
    var votes = this.data.vote //获取当前页面的投票列表
    votes[question_index].choices.splice(choice_index,1) //删除特定问题的特定选项
    if (votes[question_index].choices.length == 0 || votes[question_index].choices.length == 1) {
      votes.splice(question_index, 1) //如果当前问题无选项或者只有一个选项时，自动删除该问题
    }
    this.setData({
      vote: votes //更新当前的投票列表
    })
  },

  //设置问题为单选
  btn_radio: function(event) {

    var index = event.currentTarget.id //获取当前问题的下标
    var votes = this.data.vote //获取当前页面的投票列表
    votes[index].radio = "true" //将其属性改为true
    this.setData({vote: votes}) //更新当前的投票列表

  },

  //设置问题为多选
  btn_checkbox: function (event) {

    var index = event.currentTarget.id //获取当前问题的下标
    var votes = this.data.vote //获取当前页面的投票列表
    votes[index].radio = "false" //将其属性改为false
    this.setData({ vote: votes }) //更新当前的投票列表

  },

  //设置问题
  question_input: function(event) {
    var index = event.currentTarget.id //获取问题在当前投票列表中的下标
    var votes = this.data.vote //获取当前页面的投票列表
    votes[index].question = event.detail.value //获取问题内容并设置
    this.setData({ vote: votes }) //更新投票列表
  },

  //设置选项
  choice_input: function(event) {
    var choice_index = event.currentTarget.id //获取选项在当前问题列表中的下标
    var question_index = event.currentTarget.dataset.question_id //获取问题在当前投票列表中的下标
    var votes = this.data.vote //获取当前页面的投票列表
    votes[question_index].choices[choice_index] = event.detail.value //获取选项内容并设置
    this.setData({ vote: votes }) //更新投票列表
  },

  //点击发起新的投票
  btn_set: function() {
    var that = this;
    var theme = this.data.info.theme //获取当前会议的主题
    var time = this.data.info.time //获取当前会议的时间
    wx.navigateTo({
      url: 'vote_manage?type=set&id=' + that.data.id + '&theme=' + theme + '&time=' + time, //转向当前页面（id为会议ID、theme为会议主题、time为会议时间）
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //点击投票记录查询
  btn_record: function () {
    var that = this;
    var theme = this.data.info.theme //获取当前会议的主题
    var time = this.data.info.time //获取当前会议的时间
    wx.navigateTo({
      url: 'vote_manage?type=record_all&id=' + that.data.id + '&theme=' + theme + '&time=' + time, //转向当前页面（id为会议ID、theme为会议主题、time为会议时间）
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //投票预览
  preview: function(){

    var that = this;
    var vote_list = JSON.stringify(that.data.vote);

    wx.navigateTo({
      url: '../vote_attend/vote_attend?vote=' + vote_list + '&type=preview',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  //提交问题及答案
  submit: function() {
    var that = this;
    var count = 0;
    var vote_list = new Array();

    //遍历投票数组去除空问题数组
    for (var i = 0; i < that.data.vote.length; ++i){
      if (that.data.vote[i].question.length != 0){
        vote_list[count] = that.data.vote[i];
        count++;
      }
    }

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/manage.php',
      data: {
        'type': 'vote', //操作类型为投票
        'from': 'wx',
        'id': that.data.id, //会议ID
        'vote': vote_list //投票列表
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.showToast({
          title: '投票发起成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(function () {
          wx.hideToast()
          wx.navigateBack({
            delta: 1,
          })
        }, 2000)

      },
      fail: function(res) {
        wx.showToast({
          title: '投票发起失败',
          image: '../../images/hint1.png',
          duration: 1500
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      },
      complete: function(res) {},
    })
  },

  //获取投票的详细信息
  btn_detail_record: function (event) {

    var index = event.currentTarget.id; //保存当前投票的下标
    var theme = this.data.info.theme
    var time = this.data.info.time

    //跳转当前页面
    wx.navigateTo({
      url: 'vote_manage?type=record_detail&id=' + this.data.id + '&index=' + index, //id为会议ID、index为投票的下标
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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