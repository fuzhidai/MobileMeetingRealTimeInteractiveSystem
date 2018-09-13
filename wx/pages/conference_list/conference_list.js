const App = getApp()
var util = require('../../utils/util.js');  
const sliderWidth = 96

Page({
  data: {
    tabs: ['全部', '未开始', '已完成'],
    ifSearch_all: false, //判断是否为搜索状态
    ifSearch_prepare: false,
    ifSearch_finish: false,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    typePicker: '主题',
    index: 0, //查询类型默认为0即按主题查询
    search: '../../assets/images/iconfont-search.png',
    now: '../../assets/images/iconfont-now.png',
    place_icon: '../../assets/images/iconfont-place_info.png',
    focus: false,
    list_type: '', //列表类型（create创建\attend参加\recent近期\start即将开始\search搜索）
    prepare_conference_list: [], //未开始会议列表
    finish_conference_list: [], //已完成会议列表
    all_conference_list: [], // 全部会议列表
    search_prepare_conference_list: [],
    search_finish_conference_list: [],
    search_all_conference_list: [],
    input_info: '', //输入的搜索内容
    search_list: '', //搜索到的数据列表
    start_list: '' //即将开始的会议列表
  },
  
  onLoad(options) {
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#ffffff',
    // })
    this.getSystemInfo()
		this.$wuxPicker = App.Wux().$wuxPicker

    var that = this //获取当前页面
    var openid = options.openid //获取openid
    that.setData({ list_type: options.type }) //设置当前页面显示的会议列表类型

    if (that.data.list_type == 'create') { //设置标题为创建的会议
      wx.setNavigationBarTitle({
        title: '创建的会议',
      })
    } else if (that.data.list_type == 'attend') { //设置标题为参加的会议
      wx.setNavigationBarTitle({
        title: '参加的会议',
      })
    } else if (that.data.list_type == 'recent') { //设置标题为近期的会议
      wx.setNavigationBarTitle({
        title: '近期的会议',
      })
    } else if (that.data.list_type == 'start') { //设置标题为近期的会议
      wx.setNavigationBarTitle({
        title: '即将开始的会议',
      })
      that.setData({ 
        tabs: ['全部', '未开始', '进行中'],
      })

    } else if (that.data.list_type == 'search') { //设置标题为搜索
      wx.setNavigationBarTitle({
        title: '搜索',
      })

      //如果是搜索页面输入框自动聚焦
      this.setData({ focus: true });
    }

    //如果列表类型为创建、参加、近期时执行
    if (that.data.list_type == 'create' || that.data.list_type == 'attend' || that.data.list_type == 'recent' || that.data.list_type == 'start') {

      //向后台请求列表数据（未开始的会议）
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/search.php',
        data: {
          'openid': openid, //用户的Openid
          'property': that.data.list_type, //请求的数据列表的性质（create\attend\recent\start）
          'state': 'prepare' //请求数据列表的会议状态为未开始
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {

          console.log(res.data);
          var list = res.data;
          var len = list.length;
          wx.getStorage({
            key: 'currentConference',
            complete: function (res) {
              // console.log(res.data)

              if (res.data) {

                var id = res.data.id;
                for (var i = 0; i < len; ++i) {
                  console.log(list[i]);
                  console.log(i)
                  if (list[i].id == id && list[i].state != 'finish') {
                    var current = { current: 'true' }
                    list[i] = Object.assign(list[i], current);
                    break;
                  }

                }
                // console.log(list);
              }

              that.setData({ prepare_conference_list: list }); //用后端获取的数据更新当前页面的列表

            }

        })
        },

        //如果请求数据失败
        fail: function (res) {

          //显示提示框
          wx.showToast({
            title: '请求数据失败',
            icon: 'loading',
            duration: 1500
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        },
        complete: function (res) { },
      })

      //向后台请求数据（已完成的会议）
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/search.php',
        data: {
          'openid': openid, //用户的openid
          'property': that.data.list_type, //请求的数据列表的性质（create\attend\recent\start）
          'state': 'finish' //请求数据列表的会议状态为已完成
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {

          var list = res.data;
          var len = list.length;
          wx.getStorage({
            key: 'currentConference',
            complete: function (res) {
              // console.log(res.data)

              if(res.data){

                var id = res.data.id;
                for (var i = 0; i < len; ++i) {
                  if (list[i].id == id && list[i].state != 'finish') {
                    var current = {
                      current: 'true'
                    }
                    list[i] = Object.assign(list[i], current);
                    break;
                  }
                }
                console.log(list);

              }

              that.setData({ finish_conference_list: list }); //用后端获取的数据更新当前页面的列表

            }

        })
        },

        //如果请求数据失败
        fail: function (res) {

          //显示提示框
          wx.showToast({
            title: '请求数据失败',
            icon: 'loading',
            duration: 1500
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        },
        complete: function (res) { },
      })


      //向后台请求数据（全部的会议）
      wx.request({
        url: 'https://www.viaviai.com/thz/sever/search.php',
        data: {
          'openid': openid, //用户的openid
          'property': that.data.list_type, //请求的数据列表的性质（create\attend\recent\start）
          'state': 'all' //请求数据列表的会议状态为已完成
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {

          var list = res.data;
          var len = list.length;
          //获取当前时间
          var now_time = that.getNowtime();
          wx.getStorage({
            key: 'currentConference',
            complete: function (res) {
              // console.log(res.data)

              if(res.data){

                var id = res.data.id;
                for (var i = 0; i < len; ++i) {
                  if (list[i].id == id && list[i].state != 'finish') {
                    var current = {
                      current: 'true'
                    }
                    list[i] = Object.assign(list[i], current);
                  }
                  if (that.compareTime(now_time, list[i].time + ':00')>=0 || list[i].state=='finish'){
                    var temp_state = {temp_state: 'prepare'}
                    Object.assign(list[i],temp_state);
                  }else {
                    var temp_state = { temp_state: 'finish' }
                    Object.assign(list[i], temp_state);
                  }
                }

                console.log(list);

              }

              that.setData({ all_conference_list: list }); //用后端获取的数据更新当前页面的列表

            }

          })
        },

        //如果请求数据失败
        fail: function (res) {

          //显示提示框
          wx.showToast({
            title: '请求数据失败',
            icon: 'loading',
            duration: 1500
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
        },
        complete: function (res) { },
      })

    } else if (that.data.list_type=='collect'){

      wx.request({
        url: 'https://www.viaviai.com/thz/sever/collect.php',
        data: {
          'type': 'get_conference',
          'openid': App.globalData.openid
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.setData({
            search_list: res.data,
          });
        },
        fail: function (res) { },
        complete: function (res) { },
      })

    }

  },

  setCurrent: function(list) {

    var that = this;
    var len = list.length;
    wx.getStorage({
      key: 'currentConference',
      success: function (res) {
        console.log(res.data)
        var id = res.data.id;
        for (var i = 0; i < len; ++i) {
          if (list[i].id == id) {
            var current = {
              current: 'true'
            }
            list[i] = Object.assign(list[i], current);
            break;
          }
        }
        console.log(list);
        return list;
      }
    })

  },

  getSystemInfo() {
    const that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
        })
      }
    })
  },

  //切换页面事件
  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    })
  },

  //搜索栏picker进行选择
  onTapDefault() {
    const that = this
    that.$wuxPicker.init('default', {
      items: ['主题', '地点', '时间', 'ID'],
      onChange(value, values) {
        console.log(value, values)
        that.setData({
          typePicker: values,
          index: value[0]
        })
      },
    })
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

  //进入未开始会议详情界面
  more_info_prepare: function (event) {

    var that = this;
    var index = event.currentTarget.dataset.index //获取当前会议在数组中的下标

    if (that.data.activeIndex == 1){
      if (!this.data.ifSearch) {
        var id = this.data.prepare_conference_list[index].id //获取当前会议的ID
      } else {
        var id = this.data.search_prepare_conference_list[index].id //获取当前会议的ID
      }
    } else if (that.data.activeIndex == 0){
      if (!this.data.ifSearch) {
        var id = this.data.all_conference_list[index].id //获取当前会议的ID
      } else {
        var id = this.data.all_prepare_conference_list[index].id //获取当前会议的ID
      }
    }



    //如果列表类型为创建的会议
    if (this.data.list_type == 'create') {

      //跳转至注册会议页面（可以进行数据更新）
      wx.navigateTo({

        //id（会议ID）、操作类型为更新
        url: '../register_conference/register_conference?id=' + id + '&operation=update',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else if (this.data.list_type == 'attend') { //如果列表类型为参加的会议

      //跳转至会议信息页面（参加可见）
      wx.navigateTo({

        //id（会议ID）、类型为参加
        url: '../info_conference/info_conference?type=prepare&id=' + id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

      //如果列表类型为近期的会议
    } else if (this.data.list_type == 'recent') {

      //如果选中会议为参加的会议
      if (this.data.prepare_conference_list[index].attend == 'true') {

        //跳转至会议信息页面（参加可见）
        wx.navigateTo({

          //id（会议ID）、类型为参加
          url: '../info_conference/info_conference?type=prepare&id=' + id,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })

      } else {

        //否则跳转至注册会议页面
        wx.navigateTo({

          //id（会议ID）、操作类型为更新
          url: '../register_conference/register_conference?id=' + id + '&operation=update',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }

  },

  //进入已完成会议详情界面
  more_info_finfish: function (event) {

    var index = event.currentTarget.dataset.index //获取当前会议在数组中的下标
    if (!this.data.ifSearch) {
      var id = this.data.finish_conference_list[index].id //获取当前会议的ID
    } else {
      var id = this.data.search_finish_conference_list[index].id //获取当前会议的ID
    }

    if (this.data.list_type == 'create') { //如果列表类型为创建的会议

      //跳转至创建会议记录（详细）
      wx.navigateTo({
        url: '../register_conference/register_conference?operation=record&id=' + id, //id（会议ID）
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else if (this.data.list_type == 'attend') { //如果列表类型为参加的会议

      //跳转至参加会议记录（简略）
      wx.navigateTo({
        url: '../info_conference/info_conference?type=finish&id=' + id, //id（会议ID）
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else if (this.data.list_type == 'recent') { //如果列表类型为近期的会议

      if (this.data.finish_conference_list[index].attend == 'true') { //如果为参加

        //跳转至参加会议记录
        wx.navigateTo({
          url: '../info_conference/info_conference?type=finish&id=' + id, //id（会议ID）
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })

      } else {

        //跳转至创建会议记录
        wx.navigateTo({
          url: '../register_conference/register_conference?operation=record&id=' + id, //id（会议ID）
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })

      }
    }

  },

  //通过picker获取查询所使用的类型（主题、时间、地点、id）
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  //获取数据的要查询数据
  input_info: function (e) {
    this.setData({ input_info: e.detail.value })
  },

  //提交要查询的信息
  search: function () {

    var that = this; //获取页面实例
    var state = this.data.typePicker; //当前查询类型

    //将前端查询类型转化为英文
    if (state == '主题') {
      state = 'theme'
    } else if (state == '时间') {
      state = 'time'
    } else if (state == '地点') {
      state = 'place'
    } else if (state == 'ID') {
      state = 'id'
    }

    //如果输入不为空则进行查询
    if (this.data.input_info.length != 0) {

      //如果列表类型为搜索
      if (that.data.list_type == 'search') {

        //请求后端
        wx.request({
          url: 'https://www.viaviai.com/thz/sever/search.php',
          data: {
            state: state, //查询方式（主题、时间、地点、id）
            search_info: that.data.input_info //查询的语句
          },
          header: {},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {

            var list = res.data;
            var len = list.length;
            wx.getStorage({
              key: 'currentConference',
              complete: function (res) {
                console.log(res.data)
                if(res.data){

                  var id = res.data.id;
                  for (var i = 0; i < len; ++i) {
                    if (list[i].id == id) {
                      var current = {
                        current: 'true'
                      }
                      list[i] = Object.assign(list[i], current);
                      break;
                    }
                  }

                }
                
                // console.log(list);
                that.setData({ search_list: list }); //用后端获取的数据更新当前页面的列表
              }

            })

          },

          //如果请求失败
          fail: function (res) {

            //显示提示框
            wx.showToast({
              title: '请求数据失败',
              icon: 'loading',
              duration: 1500
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
          },
          complete: function (res) { },
        })

        //如果列表类型为创建、参加、近期
      } else if (that.data.list_type == 'create' || that.data.list_type == 'attend' || that.data.list_type == 'recent' || that.data.list_type == 'start') {

        var list = ''; //创建临时数组保存数据

        if (that.data.activeIndex == 1) { //如果choice为0则为未开始会议的页面

          var list = this.data.prepare_conference_list; //保存临时列表为未开始会议列表
          that.setData({ ifSearch_prepare: true });

        } else if (that.data.activeIndex == 2) { //否则为已完成会议的页面

          var list = this.data.finish_conference_list; //保存临时列表为已完成会议列表
          that.setData({ ifSearch_finish: true });

        } else if (that.data.activeIndex == 0) {

          var list = this.data.all_conference_list; //保存临时列表为全部会议列表
          that.setData({ ifSearch_all: true });

        }

        var temp_list = Array(); //临时数组

        //如果搜索类型为按主题
        if (state == 'theme') {

          for (var i = 0; i < list.length; ++i) { //遍历数组
            if (list[i].theme == that.data.input_info) { //如果当前会议的主题与搜索的主题相同
              temp_list.push(list[i]); //将此会议加入临时数组中
            }
          }

          //如果搜索类型为按时间
        } else if (state == 'time') {

          for (var i = 0; i < list.length; ++i) { //遍历数组
            if (list[i].time == that.data.input_info) { //如果当前会议的时间与搜索的时间相同
              temp_list.push(list[i]); //将此会议加入临时数组中
            }
          }

          //如果搜索类型为按地点
        } else if (state == 'place') {

          for (var i = 0; i < list.length; ++i) { //遍历数组

            //如果当前会议的地点或详细地点与搜索的地点相同
            if (list[i].place == that.data.input_info || list[i].place_info == that.data.input_info) {
              temp_list.push(list[i]); //将此会议加入临时数组中
            }
          }

        }

        if (that.data.input_info) {

          if (that.data.activeIndex == 1) { //如果choice为0则为未开始会议的页面

            that.setData({ search_prepare_conference_list: temp_list }) //保存搜索列表为临时列表

          } else if (that.data.activeIndex == 2) { //否则为已完成会议的页面

            that.setData({ search_finish_conference_list: temp_list }) //保存搜索列表为临时列表

          } else if (that.data.activeIndex == 0) { 

            that.setData({ search_all_conference_list: temp_list }) //保存搜索列表为临时列表

          }

        }

      }

    }

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

  //更多信息事件
  more_info: function (event) {

    var index = event.currentTarget.dataset.index //保存当前会议在当前数组中的下标
    var id = this.data.search_list[index].id //保存当前会议ID

    wx.navigateTo({
      url: '../info_conference/info_conference?id=' + id + '&type=search', //id（会议ID）、类型为搜索
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //进入会议管理页面
  enter: function (event) {

    var index = event.currentTarget.dataset.index //保存当前会议在当前数组中的下标
    var id;
    var attend;

    if(!this.data.ifSearch){
      if (this.data.activeIndex == 1) {
        id = this.data.prepare_conference_list[index].id;
        attend = this.data.prepare_conference_list[index].attend;
      } else if (this.data.activeIndex == 2) {
        id = this.data.finish_conference_list[index].id;
        attend = this.data.finish_conference_list[index].attend;
      } else if (this.data.activeIndex == 0) {
        id = this.data.all_conference_list[index].id;
        attend = this.data.all_conference_list[index].attend;
      }
    }else {
      if (this.data.activeIndex == 1) {
        id = this.data.search_prepare_conference_list[index].id;
        attend = this.data.search_prepare_conference_list[index].attend;
      } else if (this.data.activeIndex == 2) {
        id = this.data.search_finish_conference_list[index].id;
        attend = this.data.search_finish_conference_list[index].attend;
      } else if (this.data.activeIndex == 0) {
        id = this.data.search_all_conference_list[index].id;
        attend = this.data.search_all_conference_list[index].attend;
      }
    }

    if (attend == 'false') {

      wx.navigateTo({
        url: '../manage_conference_open/manage_conference_open?id=' + id + '&type=create', //id（会议ID）、类型为创建
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else if (attend == 'true') {

      wx.navigateTo({
        url: '../manage_conference_open/manage_conference_open?id=' + id + '&type=attend', //id（会议ID）、类型为参加
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    }

  }

})