// pages/game/game.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight,
      payname:"1",
      startbool: true,
      joinuser:[1,2,3,4,5,"q7",18,9,10,0,23],
      payindex:1,
      slidernum:40,
      touches:[]
  },
  onReady(){
    const context = wx.createCanvasContext('myCanvas')
    this.newtouchesarr = []
    context.draw()
    this.contextdata = context
  },
  touchstart(e){
    console.log("longtap")
    console.log(e)
    console.log(e.touches)
    const context = this.contextdata
    const colorarr = ["red", "#ff0", "#f0f", "#888888", "#ff9632", "#381100", "#00c777", "#00b26a", "#f0d378", "#80d640", "#2984b9","#d09748"] 
    this.newtouchesarr = []
    for (var i = 0; i < e.touches.length; i++ ){
      context.beginPath()
      context.arc(e.touches[i].x, e.touches[i].y, 40, 0, 2 * Math.PI)
      context.setFillStyle(colorarr[i])
      context.setStrokeStyle(colorarr[i])
      context.fill()
      context.setFillStyle("#fff")
      context.setFontSize(30)
      context.setTextAlign('center')
      context.setTextBaseline('middle')
      context.fillText(i+1, e.touches[i].x, e.touches[i].y)
      context.stroke()
      this.newtouchesarr.push(
        { 
          x: e.touches[i].x,
          y: e.touches[i].y,
          color: colorarr[i],
          text: i + 1,
          show: false 
        }
      )
    }
    context.draw()
  },
  bindstart(){
    clearInterval(time)
    if (this.newtouchesarr.length >=2 ){
      const context = this.contextdata
      var i = parseInt(Math.random() * 3 + 2)  * 5 *2
      var peoplenum = parseInt(Math.random() * this.newtouchesarr.length) 
      console.log("peoplenum")
      console.log(peoplenum)
      var time = setInterval(() => {
        for (var q = 0; q < this.newtouchesarr.length; q++) {
          this.newtouchesarr[q].show = false
        }
        if (i <= 0) {
          clearInterval(time)
        }
        this.newtouchesarr[peoplenum].show = true
        this.changecolor(this.newtouchesarr)
        if (peoplenum <= 0) {
          peoplenum = this.newtouchesarr.length
        }
        peoplenum--
        i--
      }, 500)
    }
  },
  touchmove(e){
    console.log("touchmove")
    console.log(e)
  },
  touchend(e) {
    console.log("touchend")
    console.log(e)
    const context = this.contextdata
    context.stroke()
    context.draw()
  },
  changecolor(newtouchesarr){
    const context = this.contextdata
    for (var i = 0; i < newtouchesarr.length; i++) {
      context.beginPath()
      context.arc(newtouchesarr[i].x, newtouchesarr[i].y, 40, 0, 2 * Math.PI)
      context.setShadow(0, 0, 0, newtouchesarr[i].color)
      if (newtouchesarr[i].show){
        context.setShadow(0, 0, 50, newtouchesarr[i].color)
      }
      context.setStrokeStyle(newtouchesarr[i].color)
      context.setFillStyle(newtouchesarr[i].color)
      context.fill()
      context.stroke()
      context.setFontSize(30)
      context.setFillStyle("#fff")
      context.setTextAlign('center')
      context.setTextBaseline('middle')
      context.fillText(newtouchesarr[i].text, newtouchesarr[i].x, newtouchesarr[i].y)
    }
    context.draw()
  }
})