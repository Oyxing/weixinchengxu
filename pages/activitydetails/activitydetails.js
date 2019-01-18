// pages/activitydetails/activitydetails.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    image: [
      "http://www.89yxing.top/images/meal1.png",
      "http://www.89yxing.top/images/song1.png",
      "http://www.89yxing.top/images/custom1.png"
    ],
    showBack:true,
    whopaybool:false,
    boxheight:"140rpx",
    operatebool:false,
    height: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
    screenWidth:app.globalData.screenWidth * 0.95+10,
    screenHeight: app.globalData.screenHeight * 0.85,
    initiatorbool: false,
    shareImg:"",
    repeal:false,
    shareimgbool:false,
    participatestr:"",
    participatedatastr:"",
    participate:[],
    commentdata:[],
    activit:{}
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setData({
      showBack: options.from == 1?true:false
    })
    this.inviteid = options.id
    this.getRestaurant()
    this.selComment()
    wx.showLoading({
      title: '加载中',
    })
  },
  onShow(){
    var pages = getCurrentPages()
    // showBack
    const seft = this
    wx.getStorage({
      key: 'selComment',
      success(res) {
        seft.setData({
          commentdata: res.data[0]
        })
      }
    })
    wx.getStorage({
      key: 'resdatamsgdata',
      success(res) {
        var date = new Date()
        var resdatamsg = res.data[0]
        var openid = app.globalData.openid
        if (resdatamsg.originator == openid) {
          seft.setData({
            initiatorbool: true
          })
        } else {
          seft.setData({
            repeal: false,
            initiatorbool: false
          })
          for (var keyuser in resdatamsg.userinfo) {
            if (resdatamsg.userinfo[keyuser].openid == openid) {
              seft.setData({
                repeal: true,
                initiatorbool: false
              })
            } else {
              seft.setData({
                repeal: false,
                initiatorbool: false
              })
            }
          }
        }
        seft.setData({
            activit: resdatamsg,
            operatebool: ((Date.parse(date) / 1000) < (resdatamsg.starttime)) ? true : false,
            boxheight: ((Date.parse(date) / 1000) < (resdatamsg.starttime)) ? "140rpx" : "0rpx",
            participate: resdatamsg.userinfo,
            participatestr: JSON.stringify(resdatamsg.userinfo),
            participatedatastr: JSON.stringify(resdatamsg),
            whopaybool: ((Date.parse(date) / 1000) < (resdatamsg.starttime)) ? false : true
        })
      }
    })
  },
  //  获取活动
  getRestaurant(){
    const json = {
      url: app.globalData.hettpsip+'/restaurant/' + this.inviteid,
      method: "GET"
    }
    var openid = app.globalData.openid
    const seft = this
    var resdatamsg
    app.getAjax(json, (res) => {
      // originator
      resdatamsg = res.data.msg
      for (var i = 0; i < resdatamsg.userinfo.length; i++) {
        if (resdatamsg.originator == resdatamsg.userinfo[i].openid) {
          resdatamsg.userinfo[i]["initiator"] = true
          resdatamsg.nickName = resdatamsg.userinfo[i].nickName
          resdatamsg.avatarUrl = resdatamsg.userinfo[i].avatarUrl
        }
      }
      var date = new Date()
      resdatamsg.starttimestr = app.timelayout(resdatamsg.starttime);
      resdatamsg.mapbool = (resdatamsg.starttime - Date.parse(date) / 1000) > 0 ? true : false;
      if (resdatamsg.originator == openid) {
        seft.setData({
          repeal: false,
          initiatorbool: true
        })
      } else {
        for (var keyuser in resdatamsg.userinfo) {
          if (resdatamsg.userinfo[keyuser].openid == openid) {
            seft.setData({
              repeal: true,
              initiatorbool: false
            })
          } else {
            seft.setData({
              repeal: false,
              initiatorbool: false
            })
          }
        }
      }
      this.setData({
        activit: resdatamsg,
        operatebool: ((Date.parse(date) / 1000) < (resdatamsg.starttime)) ? true : false,
        boxheight: ((Date.parse(date) / 1000) < (resdatamsg.starttime)) ? "140rpx" : "0rpx",
        participate: resdatamsg.userinfo,
        participatestr: JSON.stringify(resdatamsg.userinfo),
        participatedatastr: JSON.stringify(resdatamsg),
        whopaybool: ((Date.parse(date) / 1000) < (resdatamsg.starttime)) ? false : true
      })
      wx.hideLoading()
      // 展示本地存储能力
      var resdatamsgdata = wx.getStorageSync('resdatamsgdata') || []
      resdatamsgdata.unshift(resdatamsg)
      wx.setStorageSync('resdatamsgdata', resdatamsgdata)
    })
  },
  //  查询评论
  selComment() {
    var json = {
      url: "http://117.34.73.112/SelComment",
      method: "GET",
      data: {
        inviteid: this.inviteid
      }
    }
    var openid = app.globalData.openid
    var Dateparse = Date.parse(new Date())/1000
    app.getAjax(json, (res) => {
      for (var key in res.data.msg){
        res.data.msg[key]["createtimestr"] = this.timelayout(res.data.msg[key].createtime)
        if (res.data.msg[key].openid == openid){
          if (((Dateparse - res.data.msg[key].createtime) > 180)) {
            res.data.msg[key]["delbool"] = false
          } else {
            res.data.msg[key]["delbool"] = true
          }
        }else{
          res.data.msg[key]["delbool"] = false
        }
      }
      this.setData({
        commentdata: app.bubbleSort(res.data.msg)
      })
      // 展示本地存储能力
      var selComment = wx.getStorageSync('selComment') || []
      selComment.unshift(app.bubbleSort(res.data.msg))
      wx.setStorageSync('selComment', selComment)
    })
  },
  // 删除评论  
  delcomment(e) {
    wx.showModal({
      content: '是否删除此评论',
      success: (res) => {
          if (res.confirm) {
            var json = {
              url: "http://117.34.73.112/DelComment",
              data: {
                id: e.target.dataset.delid
              }
            }
            app.getAjax(json, (res) => {
              if (!res.data.success) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                this.selComment()
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              }
            })
          }
      }
    })
    
  },
  message(){
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
        console.log("分享成功")
        console.log("res")
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
        console.log("分享失败")
        console.log(res)
      }
    })
  },
  getgame(){
    wx.navigateToMiniProgram({
      appId: 'wxafaccf187999bccd',
      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(){
        console.log("sss")
      }
    })
  },
  //  点击分享
  bindshare(){
    this.setData({
      shareimgbool:true
    })
    this.createdcanvas()
  },
  // 图片制作
  createdcanvas(){
      var seft = this
      var width = 300
      var height = 500
      const ctx = wx.createCanvasContext('shareCanvas')
      ctx.save()
      ctx.setFillStyle('#fff')
      ctx.fillRect(10, 10, width, height)
      ctx.restore()
      // 发起人
      ctx.setFontSize(15)
      ctx.setFillStyle('#e5784a')
      ctx.setTextAlign('center')
      ctx.fillText(this.data.activit.nickName, width / 2, 40)
      // text
      ctx.setFillStyle('#000')
      ctx.setTextAlign('center')
      ctx.fillText('发起了一个活动快去参加吧！', width / 2, 80)
      // 主题
      ctx.setFillStyle('#888888')
      ctx.setTextAlign('left')
      ctx.fillText('主题', 30, 120)
      ctx.setFillStyle('#e5784a')
      ctx.setTextAlign('right')
      ctx.fillText(this.data.activit.subject, width - 20, 120)
      ctx.restore()
      ctx.setTextAlign('#888888')
      ctx.moveTo(30, 130)
      ctx.lineTo(width - 20, 130)
      ctx.setLineWidth(0.9)
      // 时间 
      ctx.setFillStyle('#888888')
      ctx.setTextAlign('left')
      ctx.fillText('时间', 30, 165)
      ctx.setFillStyle('#e5784a')
      ctx.setTextAlign('right')
      ctx.fillText(this.data.activit.starttimestr, width - 20, 165)
      ctx.restore()
      ctx.setTextAlign('#888888')
      ctx.moveTo(30, 175)
      ctx.lineTo(width - 20, 175)
      ctx.setLineWidth(0.9)
      // 地点 
      ctx.setFillStyle('#888888')
      ctx.setTextAlign('left')
      ctx.fillText('地点', 30, 205)
      ctx.setFillStyle('#e5784a')
      ctx.setTextAlign('right')
      ctx.fillText(this.data.activit.addrname, width - 20, 205)
      ctx.restore()
      ctx.setTextAlign('#888888')
      ctx.moveTo(30, 215)
      ctx.lineTo(width - 20, 215)
      ctx.setLineWidth(0.9)
      ctx.stroke()
      ctx.restore()
      wx.downloadFile({
        url: 'http://www.89yxing.top/images/qrcode.png',
        success(res) {
          ctx.beginPath()
          ctx.setFillStyle('#ff0')
          ctx.arc(width / 2, 400, 10, 0, 2 * Math.PI)
          ctx.drawImage(res.tempFilePath, width / 2 / 2, 240, 170, 170)
          ctx.restore()
          // 长按扫描
          ctx.setFillStyle('#000')
          ctx.setTextAlign('center')
          ctx.fillText('长按或扫描查看全部内容', width / 2, 440)
          // 介绍
          ctx.setFillStyle('#888888')
          ctx.setFontSize(14)
          ctx.setTextAlign('center')
          ctx.fillText('微信小程序:组局达人', width / 2, 480)
          ctx.draw()
        }
      })
      setTimeout(()=>{
        this.canvasFilePath(width, height)
      },500)
  },
  canvasFilePath(width, height){
    var seft = this
    console.log(width, height)
    var screenWidth = this.data.screenWidth
    var screenHeight = this.data.screenHeight
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      quality:1,
      destWidth: screenWidth,
      destHeight: screenHeight,
      canvasId: 'shareCanvas',
      success(res) {
        seft.setData({
          shareImg: res.tempFilePath
        })
        wx.hideLoading()
      }
    })
  },
  // 长按分享 
  saveImg() {
    let that = this;
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.shareImg,
                success() {
                  wx.showToast({
                    title: '保存成功'
                  })
                  that.setData({
                    shareimgbool: false
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail() {
              wx.showModal({
                title: '是否授权保存到相册',
                content: '需要授权保存到相册，请确认授权，否则保存到相册功能将无法使用',
                success: function (res) {
                  if (res.cancel) {
                    wx.showToast({
                      title: '取消授权',
                      icon: 'success',
                      duration: 2000
                    })
                  } else if (res.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.writePhotosAlbum"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 2000
                          })
                          wx.saveImageToPhotosAlbum({
                            filePath: that.data.shareImg,
                            success() {
                              wx.showToast({
                                title: '保存成功'
                              })
                              that.setData({
                                shareimgbool: false
                              })
                            },
                            fail() {
                              wx.showToast({
                                title: '保存失败',
                                icon: 'none'
                              })
                            }
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 2000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: that.data.shareImg,
            success() {
              wx.showToast({
                title: '保存成功'
              })
              that.setData({
                shareimgbool: false
              })
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })

  },
  bindclose(){
    this.setData({
      shareimgbool:false
    })
  },
  // 目标地
  getplace(){
      const latitude = 34.22259
      const longitude = 108.94878
      wx.openLocation({
        latitude,
        longitude,
        scale: 18,
        name: this.data.activit.addrname,
        address: this.data.activit.address
      })
  },
  // 参加活动
  joinactiviy(){
    wx.showModal({
      content: '是否参加此活动',
      success: (res) => {
        if (res.confirm) {
          const json = {
            url: app.globalData.hettpsip+'/AddUser',
            data: {
              openid: app.globalData.openid,
              inviteid: this.inviteid
            },
            method: "POST",
            showcode: false
          }
          app.getAjax(json, (res) => {
            if (!res.data.msg.success) {
              wx.showToast({
                title: '成功参加活动'
              })
              this.getRestaurant()
            } else {
              wx.showToast({
                title: '参加活动失败'
              })
            }
          })
        }
      }
    })
  },
  // 时间转换
  timelayout(starttime){
    var timestr = ""
    var time = new Date(starttime * 1000)
    var Y = time.getFullYear() ;
    var m = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1);
    var d = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    var h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    var mm = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    timestr = Y + "-" + m + "-" + d + "  "+ h + ":" + mm
    return timestr
  },
  // 取消活动 
  abolishactiviy(){
    if (this.data.activit.allow){
      wx.showModal({
        content: '是否参加此活动',
        success: (res) => {
          if (res.confirm) {
            const json = {
              url: app.globalData.hettpsip+'/CancelUser',
              data: {
                openid: app.globalData.openid,
                inviteid: this.inviteid
              },
              method: "POST",
              showcode: false
            }
            app.getAjax(json, (res) => {
              if (!res.data.msg.success) {
                wx.showToast({
                  title: '成功取消活动'
                })
                this.getRestaurant()
              } else {
                wx.showToast({
                  title: '取消活动失败'
                })
              }
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '此不可取消活动',
        icon: 'none'
      })
    }
  }
})