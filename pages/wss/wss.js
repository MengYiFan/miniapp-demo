// pages/wss.js
import { wxRequest } from '../../utils/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 'false',
    access_token: '',
    openid: '',
    sendFlag: false
  },
  sendMessage: function(e) {
    // console.log(this.data.openid)
    if (!this.data.sendFlag) {
      return
    }
    let openid = this.data.openid
    wxRequest({
      url: 'https://api.3mishen.com/self/wx/send/message',
      data: {
        openid: openid
      },
      method: 'POST',
      success: (res) => {
        console.log(res.data)
        if (res.ret) {
          this.setData({
            sendFlag: false
          })
        }
      }
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    let formData = e.detail,
        formId = e.detail.formId

    let self = this
    let access_token = self.data.access_token
    console.log(self)
        //dd
    let data = {
      "touser": self.data.openid,
      "template_id": "4nuFfzOu60rPuaq63EbLen_Cd2rdkwY7tpQ9TJhAnZg",
      "page": "pages/index/index",
      "form_id": formId,
      "data": {
        "keyword1": {
          "value": "3米、",
          "color": "#173177"
        },
        "keyword2": {
          "value": "无",
          "color": "#173177"
        },
        "keyword3": {
          "value": new Date(),
          "color": "#173177"
        },
        "keyword4": {
          "value": "12345678900",
          "color": "#173177"
        },
        "keyword5": {
          "value": "开发",
          "color": "#173177"
        },
        "keyword6": {
          "value": "未知",
          "color": "#173177"
        }
      },
      "emphasis_keyword": "keyword1.DATA"
    }
    console.log(data)
    wxRequest({
      url: 'https://api.3mishen.com/self/wx/message/receiver',
      data: data,
      method: 'POST',
      success: (res) => {
        console.log(res.data)
        if (res.ret) {
          this.setData({
            sendFlag: true
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this,
      openid, sessionKey, access_token
    wx.login({
      success: function (res) {

        if (res.code) {
          // 发起网络请求
          wx.request({
            url: 'https://api.3mishen.com/self/wx/session/key',
            data: {
              jsCode: res.code
            },
            method: 'POST',
            success: function (res) {
              res = res.data
              openid = res.data.openid
              sessionKey = res.data.session_key
              self.setData({
                openid: openid
              })
              console.log('openid:', res)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    
    // wx.connectSocket({
    //   url: 'wss://api.3mishen.com/wss'
    // })
    // var i = 0
    // var sInt
    // var flag = false
    // wx.onSocketOpen(function (res) {
    //   console.log('WebSocket连接已打开！')
    //   sInt = setInterval(function () {
    //     self.setData({
    //       state: i
    //     })
    //     i++
    //   }, 1000)
    // })

    // wx.request({
    //   url: `https://api.3mishen.com/self/wx/get/token`,
    //   success: function (res) {
    //     console.log(res.data)
    //     access_token = res.data.data.access_token
    //     self.setData({
    //       access_token: access_token
    //     })
    //   }
    // })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)

      if (res.data && !flag && false) {
        flag = true
        clearInterval(sInt)

        wx.sendSocketMessage({
          data: 'PLAY!!!!!'
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})