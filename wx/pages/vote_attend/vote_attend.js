var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', //会议ID
    type: 'list', //页面类型（list纵览列表、vote投票页面、preview预览页面）
    index: '', //投票的下标
    title_time: '../../assets/images/iconfont-title_time.png',
    title_record: '../../assets/images/iconfont-title_record.png',
    title_photo: '../../assets/images/iconfont-title_photo.png',
    info: {}, //会议信息列表（会议主题、会议时间）
    vote: [], //投票信息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '投 票',
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })

    var that = this;
    that.setData({
      type: options.type, //当前页面的类型
    })
    if (app.globalData.light == 'close') {
      wx.setScreenBrightness({
        value: 0.1,
      })
    }
    if (options.type != 'preview'){

      that.setData({
        id: options.id, //用户openid
        info: {
          theme: options.theme, //会议主题
          time: options.time //会议时间
        }
      }); 

    }

    //如果当前页面类型为列表
    if (options.type=='list'){

      //请求后端投票总列表的数据
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'vote', //操作类型为投票
          'id': that.data.id, //会议ID
          'index': 'null',
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {

          //将后端传入数据设置为当前页面的显示数据
          that.setData({
            vote: res.data
          })

        },
        fail: function (res) { },
        complete: function (res) { },
      })

    //如果当前页面类型为投票
    }else if (options.type=='vote'){

      var that = this;
      that.setData({
        index: options.index //投票下标
      })
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/manage.php',
        data: {
          'type': 'vote', //操作类型为投票
          'id': that.data.id, //会议ID
          'index': that.data.index //投票下标
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {

          that.set_choices(res.data); //将后端传入数据设置为当前页面的数据

        },
        fail: function (res) { },
        complete: function (res) { },
      })

    }else if (options.type=='preview'){

      that.set_choices(JSON.parse(options.vote));

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

  //对后端传来的投票数据进行处理
  set_choices: function (temp_vote) {

    //遍历答卷的每一个问题
    for (var i = 0; i < temp_vote.length; ++i){

      //遍历答卷的每一个选项
      for (var j = 0; j < temp_vote[i].choices.length; ++j){

        //将每个选项转化为包含选项和判断的JSON对象
        temp_vote[i].choices[j] = {

          value: temp_vote[i].choices[j], //选项值
          checked: false //选项默认为非选

        };

      }

    }

    this.setData({ vote: temp_vote}); //用处理后的答卷表单更新当前页面数据

  },

  //点击选择选项事件
  btn_choose: function(event) {

    var question_index = event.currentTarget.id //获取当前问题的下标
    var choice_index = event.currentTarget.dataset.choice_id //获取当前选项的下标
    var votes = this.data.vote //获取当前答卷表单
    var len = votes[question_index].choices.length //获取当前答卷表单的长度
    votes[question_index].choices[choice_index].checked = true //点击后设置为选择
    if (votes[question_index].radio == true){ //如果选项为单选
      for (var i = 0 ; i < len; i++){ //循环选项列表确定是否之前不存在已选择的选项

        //如果当前选项不是用户选择的选项并且此问题为单选
        if (i != choice_index && votes[question_index].choices[i].checked == true){
          votes[question_index].choices[i].checked = false //将此选项设置为未选择
          break;
        } 
      }
    }
    this.setData({vote: votes}) //用处理后数据更新页面数据
  },

  //点击投票事件
  btn_vote:function (event) {

    var that = this;
    var index = event.currentTarget.id; //保存当前投票的下标
    var theme = this.data.info.theme; //获取当前会议的主题
    var time = this.data.info.time; //获取当前会议的时间

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/vote.php',
      data: {
        'type': 'make_sure', //类型为确认是否已投票
        'openid': app.globalData.openid, //用户的openid
        'id': that.data.id, //会议ID
        'index': that.data.index, //投票下标
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {

        //获取用户状态
        var ifVote = res.data;

        console.log(ifVote)

        //如果用户未投票则进入投票页面
        if (!ifVote){

          //跳转当前页面
          wx.navigateTo({
            url: 'vote_attend?type=vote&id=' + that.data.id + '&index=' + index + '&theme=' + theme + '&time=' + time, //id为会议ID、index为投票的下标、theme为会议主题、time为会议时间
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })

        //否则提示‘您已投票’
        }else{

          wx.showToast({
            title: '您已投票',
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

  },

  //对页面数据进行处理获取答案数组
  get_answer: function (temp_vote) {

    //创建问题答案数组
    var answer = new Array();

    //循环问题列表
    for (var i = 0; i < temp_vote.length; ++i) {

      //创建选项数组
      var choices = new Array();

      //循环选项列表
      for (var j = 0; j < temp_vote[i].choices.length; ++j) {

        //如果此选项被选择，则将其加入已选择选项数组
        if (temp_vote[i].choices[j].checked){
          choices.push(j);
        }

      }

      answer[i] = choices; //将此问题的所有被选项组成数组后设为当前问题下标对应的值

    }

    return answer; //返回处理后的答案数组

  },

  //提交表单事件
  submit: function() {

    var that = this;
    var answer = that.get_answer(that.data.vote); //获取答案数组
    wx.request({
      url: 'https://www.viaviai.com/thz/sever/vote.php',
      data: {
        'type': 'vote', //类型投票
        'id': that.data.id, //会议ID
        'index': that.data.index, //投票下标
        'answer': answer, //答案数组
        'openid': app.globalData.openid //用户openid
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {

        wx.sendSocketMessage({
          data: '{"type":"new_vote","id":"' + that.data.id + '","index":' + that.data.index + ',"answer":' + JSON.stringify(answer) + '}'
        })

        //如果投票成功显示提示信息
        wx.showToast({
          title: '投票成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)

        //返回上次页面
        wx.navigateBack({
          delta: 1,
        })
      },
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