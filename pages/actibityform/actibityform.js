// pages/actibityform/actibityform.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
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