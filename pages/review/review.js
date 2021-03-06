// pages/feedback/feedback.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btndisabled:false
  },
  onLoad(options){
    console.log(options)
    this.inviteid = options.inviteid
  },
  formSubmit(e) {
      var json = {
        url: app.globalData.hettpsip+"/AddComment",
        data:{
          openid: app.globalData.openid,
          content: e.detail.value.feedback,
          createtime: Date.parse(new Date())/1000,
          inviteid: this.inviteid
        }
      }
      app.getAjax(json, (res) => {
          this.setData({
            btndisabled:true
          })
            if (!res.data.success) {
              wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 5000
              })
              setTimeout(() => {
                wx.navigateTo({
                  url: "../activitydetails/activitydetails?id=" + this.inviteid
                })
              }, 500)
            } else {
              wx.showToast({
                title: '评论失败',
                icon: 'none',
                duration: 5000
              })
            }
         
      })
  },
})