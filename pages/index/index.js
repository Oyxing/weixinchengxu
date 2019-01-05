const app = getApp()

Page({
  data: {
    // 用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pitchid: 2,
    name: 'user',
    navdata: [
      {
        name: "activity",
        litle: "活动",
        img: "http://www.89yxing.top/images/activity.png",
        imgtrue: "http://www.89yxing.top/images/activity1.png",
      },
      {
        name: "home",
        litle: "首页",
        img: "http://www.89yxing.top/images/home.png",
        imgtrue: "http://www.89yxing.top/images/home1.png",
      },
      {
        name: "user",
        litle: "我的",
        img: "http://www.89yxing.top/images/user.png",
        imgtrue: "http://www.89yxing.top/images/user1.png",
      }
    ]
  },
  onLoad(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function () {
    console.log("ASd")
  },
  bindpitchid(e) {
    this.setData({
      pitchid: e.currentTarget.dataset.index,
      name: e.currentTarget.dataset.name
    })
  }
})