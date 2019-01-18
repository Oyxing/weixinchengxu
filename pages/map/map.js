const app = getApp()
Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    withintime:false
  },
  onReady(){
    // 使用 wx.createMapContext 获取 map 上下文
  },
  onLoad(options) {
    var seft = this
    wx.getLocation({
      success(res) {
          seft.getuserinfo()
          seft.getmarkers()
      },
      fail() {
        wx.showModal({
          title: '是否授权我的地理位置',
          content: '需要授权我的地理位置，请确认授权，否则我的地理位置功能将无法使用',
          success: function (res) {
            if (res.cancel) {
              wx.showToast({
                title: '取消失败',
                icon: 'success',
                duration: 5000
              })
            } else if (res.confirm) {
              wx.openSetting({
                success: function (data) {
                  if (data.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 5000
                    })
                    seft.getuserinfo()
                    seft.getmarkers()
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
    this.inviteid = options.id
    var date = new Date()
    var datenum = Date.parse(date) / 1000
    if ((options.starttime - datenum) < 3600) {
        this.setData({
          withintime:true
        })
    } else {
        this.setData({
          withintime: false
        })
    }
  },
  getuserinfo(){
    this.mapCtx = wx.createMapContext('map')
    const that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      }
    })
    this.mapCtx.getCenterLocation({
      success(res) {
        var userInfo = app.globalData.userInfo
        var mapsite = res
        var json = {
          userInfo: userInfo,
          mapsite: mapsite
        }
      }
    })
  },
  onShow(){
    this.getLocation()
    this.getactivity()
    if (this.data.withintime){
      this.maptime = setInterval(()=>{
          setTimeout(()=>{
            this.getactivity()
          },1000)        
          this.getLocation()
        },120000)
    }else{
      wx.showToast({
        title: '活动前面1小时内显示显示小伙伴的位置',
        icon: 'none',
        duration: 3000
      })
    }
  },
  onUnload(){
    clearInterval(this.maptime)
  },
  getLocation(){
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          var date = new Date()
          // 活动时间 地址更新时间 当前时间
          const json = {
            url: app.globalData.hettpsip+'/UpdateAddr',
            data: {
              openid: app.globalData.openid,
              longitude: res.longitude,
              latitude: res.latitude,
              addrtime: Date.parse(date) / 1000
            }
          }
          app.getAjax(json, (res) => {
            if(!res.data.success){
              // wx.showToast({
              //   title: '位置添加成功',
              //   icon: 'success',
              //   duration: 3000
              // })
            }
          })
        }
      })
  },
  getactivity(){
    const json = {
      url: app.globalData.hettpsip+'/restaurant/' + this.inviteid,
      method: "GET"
    }
    const seft = this
    app.getAjax(json, (res) => {
      seft.getmarkers(res.data.msg.userinfo)
    })
  },
  getmarkers(userinfo) {
    var markers = []
    for (var key in userinfo) {
      markers.push({
          iconPath: userinfo[key].avatarUrl,
          latitude: userinfo[key].latitude,
          longitude: userinfo[key].longitude,
          width: 20,
          height: 20,
          zIndex:99,
          callout: {
            content: this.timejudge(userinfo[key].addrtime)+ userinfo[key].nickName,
              color: "red",
              fontSize: 16,
              borderRadius:20,
              bgColor: "#fff",
              display:'ALWAYS',
              borderRadius: 25
            }
      })
    }
    this.setData({
      markers: markers
    })

  },
  timejudge(time){
    var str = ""
    var date = new Date()
    // 活动时间 地址更新时间 当前时间
    var second = Date.parse(date)/1000 - time
    if (parseInt(second / 60) > 60){
      str = "一个小时之前 -- "
    } else if (parseInt(second / 60) > 30){
      str = "半个小时之前 -- "
    } else if (parseInt(second / 60) < 5){
      str = "位置同步 -- "
    }else{
      str = second + "分钟 -- "
    }
    return str     
  }
})