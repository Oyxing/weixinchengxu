// pages/feedback/feedback.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btndisabled:false
  },  
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var json = {
      url: app.globalData.hettpsip +"/AddUserFeedback ",
      data: {
        openid: app.globalData.openid,
        content: e.detail.value.feedback,
        phone: e.detail.value.contact,
        createtime: Date.parse(new Date()) / 1000,
      }
    }
    app.getAjax(json, (res) => {
      this.setData({
        btndisabled:true
      })
        if (!res.data.success) {
          wx.showToast({
            title: '反馈成功',
            icon: 'success',
            duration: 5000
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '../index/index?pitchid=2&name=user'
            })
          },500)
         
        } else {
          wx.showToast({
            title: '反馈失败',
            icon: 'none',
            duration: 5000
          })
        }
    })
  },
 
})