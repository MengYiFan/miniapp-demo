import { parseRunData, parseLastRunData } from './util'

var app = getApp()
// 请求数据
// @params { method, data, success, fail, complete }
const wxRequest = (params) => {
  if (params.showLoading) {
    wx.showToast({
      mask: true,
      title: '加载中...',
      icon: 'loading'
    })
  }
  wx.showLoading({
    title: '加载中...',
  })
  wx.showNavigationBarLoading()

  wx.request({
    url: params.url,
    method: params.method || 'POST',
    data: params.data || {},
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      console.info('### Request/Response')
      console.info(params)
      console.info(res)
      console.info('########')

      params.success && params.success(res.data)
      wx.hideNavigationBarLoading()

      if (params.showLoading)
        wx.hideToast()
    },
    fail: (res) => {
      params.fail && params.fail(res.data)
    },
    complete: (res) => {
      wx.hideLoading()
      params.complete && params.complete(res.data)
    }
  })
}

// 根据用户id去获得session key
const getSessionKeyByUserId = (userId, cb = null) => {
  wxRequest({
    data: {
      userId
    },
    url: 'https://api.3mishen.com/self/wx/session/key',
    success: res => {
      if (res.ret) {
        typeof cb == 'function' ? cb(res.data) : null
      } else {
        console.log('获得session错误~')
      }
    }
  })
}

// 通过登录获得微信的openID和session key
const wxLogin = (cb) => {
  wx.login({
    success: res => {
      if (res.code) {
        console.log('GET jsCode: ', res.code)
        wxRequest({
          data: {
            jsCode: res.code
          },
          url: 'https://api.3mishen.com/self/wx/session/key',
          success: res => {
            console.log('Get session data: ', res)
            if (res.ret) {
              wx.setStorageSync('userId', res.data.userId)
              wx.setStorageSync('sessionKey', res.data.session_key)
              typeof cb == 'function' ? cb(res.data) : null
            }
          }
        })
      } else {
        console.log('获得jsCode错误...')
      }
    }
  })
}

// 获得session key
const getSession = (cb = null) => {
  wx.checkSession({
    success: () => {
      console.log('Session key is ok.')
      let userId = wx.getStorageSync('userId'),
          sessionKey = wx.getStorageSync('sessionKey')
      if (sessionKey) {
        console.log('Use storage session key.')
        typeof cb == 'function' ? cb({ session_key: sessionKey}) : null
      } else if (userId) {
        console.log('Get session by userId')
        getSessionKeyByUserId(userId, cb)
      } else {
        console.log('Get session by wxLogin()')
        wxLogin(cb)
      }
    },
    fail: () => {// 失效了
      console.log('Session key fail...')
      wxLogin(cb)
    }
  })
}

// 解密数据
const wxBizDataCrypt = (encryptedData, iv, cb) => {
  // 闭包最大重新连数
  const maxReconnectNumber = 3
  let maxReconnect = 1
  function fn(data) {
    wxRequest({
      data: {
        sessionKey: data.session_key,
        encryptedData, iv
      },
      url: 'https://api.3mishen.com/self/wx/biz/data/crypt',
      success: res => {
        if (res.ret) {
          let stepInfoList = parseLastRunData(res.data.stepInfoList)
          typeof cb == 'function' ? cb(stepInfoList) : null
        } else {// 如果请求失败、用 login继续请求
          console.log('重连数:', maxReconnect)
          if (maxReconnect <= maxReconnectNumber) {
            maxReconnect++
            wxLogin(fn)
          } else {
            wx.showToast({
              title: '网络君出错了..\n请稍后再试',
              icon: 'none',
              duration: 2000
            })
            setTimeout(() => {
              maxReconnect = maxReconnectNumber
              if (app.globalData.currentPath) {
                wx.redirectTo({
                  // url: app.globalData.currentPath
                  url: '../../pages/werun/werun'
                })
              }
            }, 2000)
          }
        }
      }
    })
  }
  getSession(fn)
}

module.exports = {
  wxRequest, getSession, wxBizDataCrypt
}