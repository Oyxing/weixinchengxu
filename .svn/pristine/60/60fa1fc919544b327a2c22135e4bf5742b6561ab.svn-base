const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    // clientX: {
    //   type: Number,
    //   value: 0
    // },
    // clientY: {
    //   type: Number,
    //   value: 0
    // },
    // pageX: {
    //   type: Number,
    //   value: 0
    // },
    // pageY: {
    //   type: Number,
    //   value: 0
    // }
  },
  attached() {
    // 在组件实例进入页面节点树时执行
    // 使用 wx.createContext 获取绘图上下文 context
    const ctx = wx.createCanvasContext('myCanvas', this)
    ctx.setFillStyle('red')
     ctx.fillRect(10, 10, 150, 100)
    ctx.draw()
    ctx.fillRect(50, 50, 150, 100)
    ctx.draw(true)   
  },
  data: {
    // 这里是一些组件内部数据
    statusBarHeight: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
  },
  methods: {
    // 这里是一个自定义方法
    
  }
})