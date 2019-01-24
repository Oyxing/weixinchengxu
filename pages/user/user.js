
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
    }
  },
  data: {
    // 这里是一些组件内部数据
    // 用户信息
    imageip: app.globalData.imageip,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    usercolumn:[
      {
        litle:"版本号",
        img: app.globalData.imageip+"/set.png",
        url:"",
        version:"1.0.1"
      },
      // {
      //   litle: "客服",
      //   img: app.globalData.imageip+"/service.png",
      //   url: ""
      // },
      {
        litle: "意见反馈",
        img: app.globalData.imageip + "/feedback.png",
        url: "../feedback/feedback"
      },
      // {
      //   litle: "我的活动",
      //   img: app.globalData.imageip+"/activity2.png",
      //   url: ""
      // },
      // {
      //   litle: "我的中奖记录",
      //   img: app.globalData.imageip+"/record.png",
      //   url: ""
      // },
    ]
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
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
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  
  methods: {
    // 这里是一个自定义方法
    getUserInfo: function (e) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },
    nsvto(e){
      if (e.target.dataset.url){
          wx.navigateTo({
            url: e.target.dataset.url
          })
      }
    }
  }
})
