// pages/actibityform/actibityform.js
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
    btndisabled:false,
    type: "",
    initbool: true,
    formboxpeople: false,
    isfouce: true,      // 切换
    textareaVal: '',    // textarea的输入值
    animationOption: {},
    optionsbool: false,
    index: 23,
    array: [],
    sitedata: {
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
    dateend: "",
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
  // 时长
  bindDurationChange: function (e) {
    console.log("时长" + e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 改变日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 改变时间
  bindTimeChange: function (e) {
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
    for (var i = 1; i <= 25; i++) {
      if (i == 24) {
        str = "不限定"
      } else if (i == 25) {
        str = "半小时"
      } else {
        str = i + "小时"
      }
      array.push(str)
    }
    this.actibitid = options.actibityid
      var participatedata = JSON.parse(options.participatestr)
      var time = new Date(participatedata.starttime * 1000)
      var year = time.getFullYear()
      var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1);
      var date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
      var hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      var minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
      this.setData({
        formboxpeople: participatedata.number,
        time: hours + ":" + minutes,
        date: year + "-" + month + "-" + date,
        textareaVal: participatedata.remark,
        subject: participatedata.subject,
        sitedata:{
          name: participatedata.addrname,
          address: participatedata.address,
          latitude: participatedata.latitude,
          longitude: participatedata.longitude
        },
        index: participatedata.duration,
        number: participatedata.number,
        allow: participatedata.allow,
        aa: participatedata.aa,
        type: participatedata.type,
        array: array
      })
    console.log(this.data.type)
  },
  // 取消活动
  abolish(){
    this.setData({
      btndisabled: true
    })
    wx.showModal({
      content: '是否确定取消此活动',
      success: (res)=> {
        if (res.confirm){
            const json = {
              url: app.globalData.hettpsip+'/deleteactivity',
              data: { id: this.actibitid },
              showcode: false
            }
            app.getAjax(json, (res) => {
              if (!res.data.success) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 5000
                })
                wx.navigateTo({
                  url: '../index/index?pitchid=0&name=activity'
                })
              } else {
                wx.showToast({
                  title: '取消失败',
                  icon: 'none',
                  duration: 5000
                })
              }
            })
        }
      }
    })
  },
  // 点击调用内置 地图
  getmap() {
    const seft = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        wx.chooseLocation({
          success(res) {
            seft.setData({
              sitedata: res
            })
          }
        })
      },
      fail() {
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
          success: function (res) {
            if (res.cancel) {
              console.log("取消")
            } else if (res.confirm) {
              wx.openSetting({
                success: function (data) {
                  if (data.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 5000
                    })
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'success',
                      duration: 5000
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  // 授权
  cancleSet() {
    this.setData({
      openSet: false
    })
  },
  // 点击更多
  bindtapOptions() {
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    if (this.data.optionsbool) {
      animation.rotateZ(0).step()
      this.setData({
        animationOption: animation.export(),
        optionsbool: false,
      })
    } else {
      animation.rotateZ(-90).step()
      this.setData({
        animationOption: animation.export(),
        optionsbool: true,
      })
    }
  },
  // 表单
  formSubmit(e) {
          var remark = this.data.textareaVal
          var address = this.data.sitedata.address
          var latitude = this.data.sitedata.latitude
          var longitude = this.data.sitedata.longitude
          var nickName = app.globalData.userInfo.nickName
          var avatarUrl = app.globalData.userInfo.avatarUrl
          e.detail.value["aa"] = e.detail.value.aa ? 1 : 0;
          e.detail.value["allow"] = e.detail.value.allow ? 1 : 0;
          e.detail.value["remark"] = remark;
          e.detail.value["address"] = address;
          e.detail.value["addrname"] = this.data.sitedata.name;
          e.detail.value["latitude"] = latitude;
          e.detail.value["longitude"] = longitude;
          e.detail.value["nickName"] = nickName;
          e.detail.value["avatarUrl"] = avatarUrl;
          e.detail.value["starttime"] = Date.parse(e.detail.value.date + " " + e.detail.value.time) / 1000;
          e.detail.value["duration"] = e.detail.value.duration ? e.detail.value.duration : 23;
          e.detail.value["id"] = this.actibitid;
          delete e.detail.value.time
          delete e.detail.value.date
          delete e.detail.value.nickName
          delete e.detail.value.avatarUrl
          if (e.detail.value.address && e.detail.value.remark && e.detail.value.subject) {
            wx.showModal({
              content: '是否更新此活动',
              success: (res) => {
                if (res.confirm) {
                  this.setData({
                    btndisabled: true
                  })
                  const json = {
                    url: app.globalData.hettpsip+'/updateinfo',
                    data: e.detail.value,
                    showcode: false
                  }
                  app.getAjax(json, (res) => {
                    wx.navigateTo({
                      url: '../activitydetails/activitydetails?id=' + this.actibitid,
                    })
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '参数不完整',
              icon: 'clear',
              duration: 2000
            })
          }
      
    
  },
  peoplechange(e) {
    this.setData({
      formboxpeople: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.timedispose()
  },
  timedispose() {
    const date = new Date()
    var Year = date.getFullYear()
    var Month = date.getMonth() + 1
    var Day = date.getDate()
    var Hours = date.getHours()
    var Minutes = date.getMinutes()
    this.setData({
      datestart: Year + "-" + Month + "-" + Day,
      timestart: Hours + ":" + Minutes
    })
  }
})