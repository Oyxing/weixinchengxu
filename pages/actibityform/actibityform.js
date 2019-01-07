// pages/actibityform/actibityform.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfouce: true,      // 切换
    textareaVal: '',    // textarea的输入值
    animationOption:{},
    optionsbool:false,
    index:23,
    array: [],
    sitedata:{
      name: "点击选择",
    },
    someData: {
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    },
    date: '2016-09-01',
    time: '12:01',
    // 日期
    datestart: "",
    dateend:"",
    // 时间
    timestart: "",
    timeend: "",
  },
  /*
  * 点击切换
  **/
  isfouce: function () {
    this.setData({
      isfouce: false
    })
  },

  /*
  * 失焦事件
  **/
  textarea: function (e) {
    this.setData({
      isfouce: true,
      textareaVal: e.detail.value
    })
  },
  // 改变日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 改变时间
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var array = []
    var str = ""
    for(var i = 1 ; i <= 25; i++){
      
      if(i == 24){
        str = "不限定"
      }else if(i == 25){
        str = "半小时"
      }else{
        str = i + "小时"
      }
      array.push(str)
    }
    this.setData({
      array: array
    })
  },
  // 点击调用内置 地图
  getmap(){
    const seft = this
    wx.chooseLocation({
      success(res) {
        seft.setData({
          sitedata:res
        })
      }
    })
  },
  // 点击更多
  bindtapOptions() {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    if (this.data.optionsbool){
      animation.rotateZ(0).step()
      this.setData({
        animationOption: animation.export(),
        optionsbool: false,
      })
    }else{
      animation.rotateZ(-90).step()
      this.setData({
        animationOption: animation.export(),
        optionsbool: true,
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
    this.timedispose()

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  timedispose(){
    const date = new Date()
    var Year = date.getFullYear()
    var Month = date.getMonth() + 1
    var Day = date.getDate()
    var Hours = date.getHours()
    var Minutes = date.getMinutes()
      this.setData({
        date : Year + "-" + Month + "-" + Day,
        time : Hours + ":" + Minutes,
        datestart: Year + "-" + Month + "-" + Day,
        timestart: Hours + ":" + Minutes
      })
  }
})