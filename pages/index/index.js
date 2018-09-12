//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    items: [
      { name: '🏃 拉取跑步数据', path: '../werun/werun' },
      { name: 'WSS/收发信息', path: '../wss/wss'},
      { name: '画板 😋', path: '../canvas/canvas' },
      { name: '爱心动画', path: '../canvasEvent/canvasEvent' },
      { name: '红包算法', path: '../redPacket/redPacket' },
      { name: '支付牌照 💰', path: '../payLicence/payLicence' },
      // { name: '飞 ✈', path: '../fei/fei' },
      // { name: '动效 :-)', path: '../dynamic/dynamic' },
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
