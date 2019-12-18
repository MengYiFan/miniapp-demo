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
      { name: '动效 :-)', path: '../dynamic/dynamic' },
      { name: '薪资计算', path: '../salary/salary' },
    ]
  },
  bindItemTap(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.to
    })
  },
  bindGetUserInfo(e) {
    console.log('bindGetUserInfo', e.detail.userInfo)
    wx.login({
      success(loginRes) {
        if (loginRes.code) {
          console.log(loginRes.code)
          wx.getUserInfo({
            success: function (getUserInfoRes) {
              console.log('getUserInfoRes@', getUserInfoRes)
              wx.request({
                url: 'http://localhost:7001/miniapp/promote/qrCode/recode',
                method: 'POST',
                data: {
                  scene: 'default4455332',
                  id: 18,
                  iv: getUserInfoRes.iv,
                  encryptedData: getUserInfoRes.encryptedData,
                  code: loginRes.code
                },
                success(res) {
                  console.log(res.data)
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onLoad: function (query) {
    const scene = decodeURIComponent(query.scene)
    console.log(query)

    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  }
})
