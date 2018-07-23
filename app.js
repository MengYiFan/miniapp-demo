//app.js
App({
  onLaunch: function (e) {
    this.globalData.currentPath = e.path
    this.globalData.currentQuery = e.query
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // var userId = wx.getStorageSync('userId')
    // if (userId) {
    //   wx.request({
    //     url: 'http://localhost/self/wx/get/user/seccsion/key',
    //   })
    // } else {

    // }
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  wxLogin() {
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            method: 'POST',
            data: {
              jsCode: res.code
            },
            url: 'https://api.3mishen.com/self/wx/login',
            success: res => {
              console.log(res)
              if (res.ret) {
                wx.setStorageSync('userId', res.data.userId)
                wx.setStorageSync('accessKey', res.data.access_key)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    currentPath: null,
    currentQuery: null
  }
})