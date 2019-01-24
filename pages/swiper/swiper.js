const app = getApp()
Component({
  properties: {
   
  },
  data: {
    indicatorDots: true,
    autoplay: false,
    duration: 500,
    height: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight, 
    imgurl:[
      {
        imageurl: app.globalData.imageip + "/meal.png",
        background:"#59b6e6",
        type:"1"
      },
      {
        imageurl: app.globalData.imageip + "/song.png",
        background:"#ff0",
        type: "2"
      },
      {
        imageurl: app.globalData.imageip + "/custom.png",
        background: "#e26936",
        type: "3"
      }
    ]
  },
  methods: {
    // 这里是一个自定义方法
    
  }
})