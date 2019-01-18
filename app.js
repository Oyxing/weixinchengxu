//app.js
App({
  onLaunch: function (options) {
    var hettpsip = "http://117.34.73.112"
    // var hettpsip = "http://10.1.1.172"
    this.globalData.hettpsip = hettpsip
    wx.clearStorage()
    // 获取 顶部高度
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.platform = res.platform
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }
        that.globalData.screenHeight = res.screenHeight
        that.globalData.screenWidth = res.screenWidth
        that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      },
      failure() {
        that.globalData.statusBarHeight = 0
        that.globalData.titleBarHeight = 0
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录状态查看
    wx.checkSession({
      success(res) {
        console.log("登录状态查看")
        console.log(res)
        // session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() // 重新登录
      }
    })
      var seft = this
      // 获取用户信息
        wx.getUserInfo({
          success:res => {
            seft.globalData.userInfo = res.userInfo
            seft.globalData.signature = res.signature
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (seft.userInfoReadyCallback) {
              seft.userInfoReadyCallback(res)
            }
            wx.login({
              success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                const json = {
                  url: that.globalData.hettpsip + '/getopenid',
                  data: {
                    nickName: seft.globalData.userInfo.nickName,
                    avatarUrl: seft.globalData.userInfo.avatarUrl
                  },
                  showcode: true
                }
                seft.getAjax(json, (res) => {
                  seft.globalData.openid = res.data.msg.openid
                  seft.globalData.session_key = res.data.msg.session_key
                })
                // 获取活动 数据
                const jsonInfo = {
                  url: that.globalData.hettpsip + '/getAllInfo',
                  data: {
                    openid: seft.globalData.openid,
                  },
                  method: "GET",
                  showcode: false
                }
                var Currenttime = new Date()
                this.getAjax(jsonInfo, (res) => {
                  for (var key in res.data.msg) {
                    // 持续时间  res.data.msg[key].duration
                    if (res.data.msg[key].duration == 23) {
                      // 不限时间小时
                      var durationtime = 18000
                    } else if (res.data.msg[key].duration == 24) {
                      // 半个小时
                      var durationtime = 1800
                    } else {
                      var durationtime = (res.data.msg[key].duration + 1) * 3600
                    }
                    // 未开始
                    if (res.data.msg[key].starttime > Date.parse(Currenttime) / 1000) {
                      res.data.msg[key]["state"] = 0
                      // 已结束
                    } else if ((Date.parse(Currenttime) / 1000) > (res.data.msg[key].starttime + durationtime)){
                      res.data.msg[key]["state"] = 2
                      // 进行中
                    } else {
                      res.data.msg[key]["state"] = 1
                    }
                    res.data.msg[key]["starttimestr"] = this.timelayout(res.data.msg[key].starttime)
                    if ((Date.parse(Currenttime) / 1000) - res.data.msg[key].starttime > durationtime) {
                      res.data.msg[key]["activitybool"] = true
                    } else {
                      res.data.msg[key]["activitybool"] = false
                    }
                  }
                  // 展示本地存储能力
                  var activity = wx.getStorageSync('activity') || []
                  activity.unshift(this.bubbleSort(res.data.msg))
                  wx.setStorageSync('activity', activity)
                })
              }
            })
          },
          fail:()=>{
            wx.navigateTo({
              url: '../login/login'
            })
          }
        })
    that.funAjax = this.getAjax
    that.timelayout = this.timelayout
  },
  globalData: {
    userInfo: null
  },
  getAjax(json, callback){
    wx.login({
      success: res => {
        if (json.showcode){
          json.data["code"] = res.code
        }
        wx.request({
          url: json.url, // 仅为示例，并非真实的接口地址
          method: json.method ? json.method:'POST',
          data: json.data ? json.data:{},
          header: {
            'content-type': 'application/x-www-form-urlencoded' 
          },
          success(res) {
            callback(res)
          }
        })
      }
    })
  },
  timelayout(starttime) {
      var weekday = new Array(7);
      var timestr = ""
      weekday[0] = "星期天";
      weekday[1] = "星期一";
      weekday[2] = "星期二";
      weekday[3] = "星期三";
      weekday[4] = "星期四";
      weekday[5] = "星期五";
      weekday[6] = "星期六";
      var time = new Date(starttime * 1000)
      var m = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1);
      var d = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
      var h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      var mm = time.getMinutes() < 10 ? "0" + time.getMinutes(): time.getMinutes();
      var Day = weekday[time.getDay()];
      timestr = m + "-" + d + " " + Day + " " + h + ":" + mm
      return timestr
  },
  bubbleSort(arr) {
    if (arr){
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
          if (Number(arr[j].createtime) < Number(arr[j + 1].createtime)) { //相邻元素两两对比
            var temp = arr[j + 1]; //元素交换
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    }
    return arr;
  }
})