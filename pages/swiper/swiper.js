const app = getApp()
Component({
  properties: {
   
  },
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    height: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
    imgurl:[
      {
        imageurl: "http://www.89yxing.top/images/meal.png",
        background:"#59b6e6",
        type:"1"
      },
      {
        imageurl: "http://www.89yxing.top/images/song.png",
        background:"#ff0",
        type: "2"
      },
      {
        imageurl: "http://www.89yxing.top/images/custom.png",
        background: "#e26936",
        type: "3"
      }
    ]
  },
  methods: {
    // 这里是一个自定义方法
    
  }
})