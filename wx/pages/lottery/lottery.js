const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    type: 'set',
    id: '',
    isShow: false,
    preview: '../../assets/images/iconfont-preview.png',
    add_question: '../../assets/images/iconfont-add_question.png',
    trophy: '../../assets/images/iconfont-trophy.png',
    title_prize: '../../assets/images/iconfont-title_prize.png',
    title_record: '../../assets/images/iconfont-title_record.png',
    title_photo: '../../assets/images/iconfont-title_photo.png',
    choose_default: '../../assets/images/iconfont-choose_default.png',
    choose_icon: '../../assets/images/iconfont-choose_icon.png',
    choose_function: -1,
    lottery_function: ['随机按停抽奖','摇一摇抽奖','拼手速抽奖','根据弹幕数量抽奖'],
    lottery_list:[
      {
        theme: '测试会议',
        time: '2018-01-31',
        grade: '特等奖',
        award: '电饭煲'
      }, {
        theme: '测试会议',
        time: '2018-01-31',
        grade: '特等奖',
        award: '电饭煲'
      }, {
        theme: '测试会议',
        time: '2018-01-31',
        grade: '特等奖',
        award: '电饭煲'
      }, {
        theme: '测试会议',
        time: '2018-01-31',
        grade: '特等奖',
        award: '电饭煲'
      },
    ],
    lottery: [
      {
        grade: '特等奖',
        awards: [
          {
            award:'',
            num: 0
          }, {
            award: '',
            num: 0
          }
        ]
      }, {
        grade: '一等奖',
        awards: [
          {
            award: '',
            num: 0
          }, {
            award: '',
            num: 0
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '抽 奖 管 理',
    })
    var that = this;
    that.setData({id:options.id});
    if (App.globalData.light == 'close') {
      wx.setScreenBrightness({
        value: 0.1,
      })
    }
    this.$wuxPicker = App.Wux().$wuxPicker
    this.$wuxXnumber = App.Wux().$wuxXnumber
    this.$wuxToptips = App.Wux().$wuxToptips
    this.setData({type: options.type})
    if (options.type == 'preview') {

      this.setData({ lottery: JSON.parse(options.vote)});

    }else if (options.type == 'collect'){

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/collect.php',
        data: {
          'type': 'get_lottery',
          'openid': app.globalData.openid
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.setData({ lottery_list: res.data });
        },
        fail: function (res) { },
        complete: function (res) { },
      })

    }else if (options.type=='attend'){

      

    }

    if(this.data.type=='shake'){

      that.data.isShow = true;
      wx.onAccelerometerChange(function (e) {
        if (!that.isShow) {
          return;
        }
        console.log(e.x)
        console.log(e.y)
        console.log(e.z)
        if (e.x > 1 && e.y > 1) {
          wx.showToast({
            title: '摇一摇成功',
            icon: 'success',
            duration: 2000
          })
        }
      })

    }

    // this.$wuxXnumber.init('num6', {
    //   disabled: !1,
    // })
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
    this.setData({isShow: false});
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

  num_input: function(event){

    var award_index = event.currentTarget.id //获取选项在当前问题列表中的下标
    var grade_index = event.currentTarget.dataset.grade_id //获取问题在当前投票列表中的下标
    var lotterys = this.data.lottery //获取当前页面的投票列表
    lotterys[grade_index].awards[award_index].num = event.detail.value //获取选项内容并设置
    this.setData({ lottery: lotterys }) //更新投票列表

  },

  bindtap: function(event) {
    const type = event.currentTarget.dataset.type
    var award_index = event.currentTarget.id //获取选项在当前问题列表中的下标
    var grade_index = event.currentTarget.dataset.grade_id //获取问题在当前投票列表中的下标
    var lotterys = this.data.lottery //获取当前页面的投票列表
    var num = lotterys[grade_index].awards[award_index].num
    if (type=='add'){
      lotterys[grade_index].awards[award_index].num++;//获取选项内容并设置
    } else if (type == 'sub' && num > 0){
      lotterys[grade_index].awards[award_index].num--;//获取选项内容并设置
    }
    this.setData({ lottery: lotterys }) //更新投票列表

  },

  CurentTime: function(){
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


  onTapDefault: function(event) {
    const that = this

    that.$wuxPicker.init('default', {
      items: ['特等奖', '一等奖', '二等奖', '三等奖', '鼓励奖', '参与奖', '幸运奖'],
      onChange(value, values) {
        console.log(value, values)
        
        var index = event.currentTarget.id //获取问题在当前投票列表中的下标
        var lotterys = that.data.lottery //获取当前页面的投票列表
        lotterys[index].grade = values[0] //获取问题内容并设置
        that.setData({ lottery: lotterys }) //更新投票列表

      },
    })
  },

  //设置选项
  award_input: function (event) {
    var award_index = event.currentTarget.id //获取选项在当前问题列表中的下标
    var grade_index = event.currentTarget.dataset.grade_id //获取问题在当前投票列表中的下标
    var lotterys = this.data.lottery //获取当前页面的投票列表
    lotterys[grade_index].awards[award_index].award = event.detail.value //获取选项内容并设置
    this.setData({ lottery: lotterys }) //更新投票列表
  },

  add_award: function (event) {
    console.log(event)
    var index = event.currentTarget.id
    var lotterys = this.data.lottery
    lotterys[index].awards.push({
      award: '',
      num: 0
    })
    this.setData({
      lottery: lotterys
    })
  },

  add_grade: function () {
    var lotterys = this.data.lottery
    lotterys.push({
      grade: '特等奖',
      awards: [
        {
          award: '',
          num: 0
        }, {
          award: '',
          num: 0
        }
      ]
    })
    this.setData({
      lottery: lotterys
    })
  },

  del_grade: function (event) {
    console.log(event)
    var index = event.currentTarget.id
    var lotterys = this.data.lottery
    lotterys.splice(index, 1)
    this.setData({
      lottery: lotterys
    })
  },

  preview: function () {
    var that = this;
    var lottery = JSON.stringify(that.data.lottery);

    wx.navigateTo({
      url: '../lottery/lottery?vote=' + lottery + '&type=preview',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  del_award: function (event) {
    console.log(event)
    var award_index = event.currentTarget.id
    var grade_index = event.currentTarget.dataset.grade_id
    var lotterys = this.data.lottery
    lotterys[grade_index].awards.splice(award_index, 1)
    if (lotterys[grade_index].awards.length == 0) {
      lotterys.splice(grade_index, 1)
    }
    this.setData({
      lottery: lotterys
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

  choose_function: function(e){
    var index = e.currentTarget.id;
    this.setData({ choose_function: index});
  },

  make_sure: function () {
    if (this.data.choose_function!=-1){
      this.setData({ type: 'set' });
    }else {
      const hideToptips = this.$wuxToptips.show({
        timer: 3000,
        text: '请选择抽奖方式',
        success: () => console.log('请选择抽奖方式')
      })
    }
  },

  submit: function (){
    var that = this;
    var lottery = that.data.choose_function;
    if (lottery=='0'){
      lottery = 'random';
    }

    console.log(lottery);

    var lottery_function = {
      function: lottery,
      time: that.CurentTime(),
      range: 'barrage' //暂时暂定一种弹幕方式参与抽奖
    }

    lottery = {
      lottery: that.data.lottery
    }

    var lottery_form = [lottery, lottery_function];

    console.log(lottery_form);

    wx.request({
      url: 'https://www.viaviai.com/thz/sever/manage.php',
      data: {
        'type': 'lottery', //操作类型为投票
        'from': 'wx',
        'id': that.data.id, //会议ID
        'lottery': lottery_form //投票列表
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.showToast({
          title: '抽奖发起成功',
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
      fail: function (res) {
        wx.showToast({
          title: '抽奖发起失败',
          image: '../../images/hint1.png',
          duration: 1500
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
      },
      complete: function (res) { },
    })

    // wx.sendSocketMessage({
    //   data: '{"type":"lottery","lottery_form":"' + lottery_form + '","openid":"' + app.globalData.openid + '"}'
    // })
  }

})