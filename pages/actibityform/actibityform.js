// pages/actibityform/actibityform.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:[
      "http://www.89yxing.top/images/meal1.png",
      "http://www.89yxing.top/images/song1.png",
      "http://www.89yxing.top/images/custom1.png"
    ],
    btndisabled:false,
    type:"",
    initbool:true,
    formboxpeople:false,
    isfouce: true,      // 切换
    textareaVal: '',    // textarea的输入值
    animationOption:{},
    optionsbool:false,
    index:23,
    array: [],
    valuedata:{},
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
  // 时长
  bindDurationChange: function (e) {
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
        this.setData({
          array: array,
          type: options.type
        })
    this.timedispose()
  },
  // 点击调用内置 地图
  getmap(){
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
      fail(){
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
          success: function (res) {
           if (res.confirm) {
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
  // 表单
  formSubmit(e) {
      var remark = this.data.textareaVal
      var address = this.data.sitedata.address
      var latitude = this.data.sitedata.latitude
      var longitude = this.data.sitedata.longitude
      var nickName = app.globalData.userInfo.nickName
      var avatarUrl = app.globalData.userInfo.avatarUrl
      e.detail.value["aa"] = e.detail.value.aa?1:0;
      e.detail.value["allow"] = e.detail.value.allow ? 1 : 0;
      e.detail.value["type"] = this.data.type;
      e.detail.value["remark"] = remark;
      e.detail.value["address"] = address;
      e.detail.value["addrname"] = this.data.sitedata.name;
      e.detail.value["latitude"] = latitude;
      e.detail.value["longitude"] = longitude;
      e.detail.value["nickName"] = nickName;
      e.detail.value["avatarUrl"] = avatarUrl;
      e.detail.value["starttime"] = Date.parse(e.detail.value.date +" " + e.detail.value.time) / 1000;
      e.detail.value["duration"] = e.detail.value.duration ? e.detail.value.duration:23
    if (e.detail.value.address && e.detail.value.remark && e.detail.value.subject){
        this.setData({
          btndisabled:true
        })
       const json = {
        url: app.globalData.hettpsip+'/restaurant',
        data: e.detail.value,
        showcode:true
      }
      app.getAjax(json,(res)=>{
        this.getrestaurant(res.data.msg)
      })
    }else{
      wx.showToast({
        title: '参数不完整',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getrestaurant(id){
    const json = {
      url: app.globalData.hettpsip+'/restaurant/' + id,
      method: "GET"
    }
    var openid = app.globalData.openid
    const seft = this
    var resdatamsg
    app.getAjax(json, (res) => {
      var resdatamsg = res.data.msg
      for (var i = 0; i < resdatamsg.userinfo.length; i++) {
        if (resdatamsg.originator == resdatamsg.userinfo[i].openid) {
          resdatamsg.userinfo[i]["initiator"] = true
          resdatamsg.nickName = resdatamsg.userinfo[i].nickName
          resdatamsg.avatarUrl = resdatamsg.userinfo[i].avatarUrl
        }
      }
      var date = new Date()
      resdatamsg.starttimestr = app.timelayout(resdatamsg.starttime);
      resdatamsg.mapbool = false;
      // 展示本地存储能力
      var resdatamsgdata = wx.getStorageSync('resdatamsgdata') || []
      resdatamsgdata.unshift(resdatamsg)
      wx.setStorageSync('resdatamsgdata', resdatamsgdata)
      wx.navigateTo({
        url: '../activitydetails/activitydetails?id=' + id +"&from=0",
      })
    })
  },
  peoplechange(e){
    this.setData({
      formboxpeople: e.detail.value
    })
  },
  /**
   * 时间转换
   */
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