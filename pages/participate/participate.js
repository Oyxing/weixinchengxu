// pages/participate/participate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      particpatedata:[
        {
          nickName: "oyx",
          avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ61QG8ib6VQKaV58VuWtX8Liamibzt02Ae5nHgRGHgiaKqkF8hKvnHsM3S38rQE9EBcViabn8DPyOP1Sw/132",
          initiator:false
        },
        {
          nickName: "oyx",
          avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ61QG8ib6VQKaV58VuWtX8Liamibzt02Ae5nHgRGHgiaKqkF8hKvnHsM3S38rQE9EBcViabn8DPyOP1Sw/132",
          initiator: true
        }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      particpatedata: JSON.parse(options.participatestr)
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

  }
})