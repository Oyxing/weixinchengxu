
const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerTitle: {
      type: String,
      value: '头部标题'
    },
    isShowBack: {
      type: String,
      value: "true"
    },
  },
  data: {
    imageip: app.globalData.imageip,
    image: [
      app.globalData.imageip+"/nostarted.png",
      app.globalData.imageip +"/proceed.png",
      app.globalData.imageip +"/over.png"
    ],
    // 这里是一些组件内部数据
    height: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
    activity:[]
  },
  attached() {
    wx.showLoading({
      title: '加载中',
    })
    var Currenttime = new Date()
    const seft = this
    var overactivity = []
    var marchactivity = []
    //  从本地缓存中 取值
    wx.getStorage({
      key: 'activity',
      success(res) {
        var data = res.data[0]
        marchactivity = []
        overactivity = []
        for (var key in data){
          // starttime
          if (data[key]["state"] == 2) {
            overactivity.push(data[key])
          } else {
            marchactivity.push(data[key])
          }
        }
        if (marchactivity.length > 0){
          seft.setData({
            activity: app.bubbleSort(marchactivity)
          })
        }else{
          seft.setData({
            activity: app.bubbleSort(overactivity)
          })
        }
      }
    })
    // 在组件实例进入页面节点树时执行
    // 登录 直接获取
    var openid = ""
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const json = {
          url: app.globalData.hettpsip+'/getopenid',
          data: {
            nickName: app.globalData.userInfo.nickName,
            avatarUrl: app.globalData.userInfo.avatarUrl
          },
          showcode: true
        }
        app.getAjax(json, (res) => {
          openid = res.data.msg.openid
          const json = {
            url: app.globalData.hettpsip+'/getAllInfo',
            data: {
              openid: res.data.msg.openid,
            },
            method:"GET",
            showcode: false
          }
          app.getAjax(json, (res) => {
            marchactivity = []
            overactivity = []
            for (var key in res.data.msg){
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
              } else if ((Date.parse(Currenttime) / 1000) > (res.data.msg[key].starttime + durationtime)) {
                res.data.msg[key]["state"] = 2
                // 进行中
              } else {
                res.data.msg[key]["state"] = 1
              }
              res.data.msg[key]["starttimestr"] = app.timelayout(res.data.msg[key].starttime)
              if (res.data.msg[key]["state"] == 2){
                overactivity.push(res.data.msg[key])
              }else{
                marchactivity.push(res.data.msg[key])
              }
            }
            if (marchactivity.length > 0) {
              seft.setData({
                activity: app.bubbleSort(marchactivity)
              })
            } else {
              seft.setData({
                activity: app.bubbleSort(overactivity)
              })
            }
              wx.hideLoading()
            // 本地存储
            var activity = wx.getStorageSync('activity') || []
            activity.unshift(app.bubbleSort(res.data.msg))
            wx.setStorageSync('activity', activity)
          })
        })
      }
    })
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
    wx.hideLoading()
  },
  methods: {
    // 这里是一个自定义方法
  
  }
})
