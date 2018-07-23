//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    items: [
      { name: '拉取跑步数据', path: '../werun/werun' },
      { name: 'WSS/收发微信模板', path: '../wss/wss'},
      { name: '画板', path: '../canvas/canvas' },
      { name: '爱心动画', path: '../canvasEvent/canvasEvent' },
      { name: '拖拽，拽', path: '../canvasEvent/canvasEvent' },
    ]
  },
  bindItemTap(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
  },
  onLoad: function () {

  }
})
