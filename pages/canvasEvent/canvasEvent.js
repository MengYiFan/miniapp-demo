// pages/canvasEvent/canvasEvent.js
var context = null,
    contextBtn = null,
    factor = {
      speed: .006,
      t: 0
    },
    timer = null,
    btnListenerList = [],
    sysInfo = {}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    heartBtnPosition: {
      x: 0,
      y: 0,
    },
    imgW: 30,
    imgH: 30
  },
  drawImage(data, cb) {
    var p10 = data[0][0]  
    var p11 = data[0][1] 
    var p12 = data[0][2] 
    var p13 = data[0][3] 

    var p20 = data[1][0]
    var p21 = data[1][1]
    var p22 = data[1][2]
    var p23 = data[1][3]

    var p30 = data[2][0]
    var p31 = data[2][1]
    var p32 = data[2][2]
    var p33 = data[2][3]

    var t = factor.t

    var cx1 = 3 * (p11.x - p10.x)
    var bx1 = 3 * (p12.x - p11.x) - cx1
    var ax1 = p13.x - p10.x - cx1 - bx1

    var cy1 = 3 * (p11.y - p10.y)
    var by1 = 3 * (p12.y - p11.y) - cy1
    var ay1 = p13.y - p10.y - cy1 - by1

    var xt1 = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p10.x
    var yt1 = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p10.y
    //
    var cx2 = 3 * (p21.x - p20.x)
    var bx2 = 3 * (p22.x - p21.x) - cx2
    var ax2 = p23.x - p20.x - cx2 - bx2

    var cy2 = 3 * (p21.y - p20.y)
    var by2 = 3 * (p22.y - p21.y) - cy2
    var ay2 = p23.y - p20.y - cy2 - by2

    var xt2 = ax2 * (t * t * t) + bx2 * (t * t) + cx2 * t + p20.x
    var yt2 = ay2 * (t * t * t) + by2 * (t * t) + cy2 * t + p20.y
    //
    var cx3 = 3 * (p31.x - p30.x)
    var bx3 = 3 * (p32.x - p31.x) - cx3
    var ax3 = p33.x - p30.x - cx3 - bx3

    var cy3 = 3 * (p31.y - p30.y)
    var by3 = 3 * (p32.y - p31.y) - cy3
    var ay3 = p33.y - p30.y - cy3 - by3

    var xt3 = ax3 * (t * t * t) + bx3 * (t * t) + cx3 * t + p30.x
    var yt3 = ay3 * (t * t * t) + by3 * (t * t) + cy3 * t + p30.y
    
    var imgW = this.data.imgW
    var imgH = this.data.imgH

    factor.t += factor.speed

    context.drawImage("../../images/heart1.png", xt1, yt1, imgW, imgH)
    context.drawImage("../../images/heart2.png", xt2, yt2, imgW, imgH)
    context.drawImage("../../images/heart3.png", xt3, yt3, imgW, imgH)
    context.draw()

    if (factor.t > 1) {
      factor.t = 0
      // cancelAnimationFrame(timer)
      clearTimeout(timer)
      // this.startTimer()
      cb()
    } else {
      let heartBtnPosition = this.data.heartBtnPosition

      timer = setTimeout(() => {
        this.drawImage([
          [{ x: heartBtnPosition.x, y: heartBtnPosition.y },
          { x: 70, y: 300 }, { x: -50, y: 150 }, { x: 30, y: 0 }],
          [{ x: heartBtnPosition.x, y: heartBtnPosition.y },
          { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 30, y: 0 }],
          [{ x: heartBtnPosition.x, y: heartBtnPosition.y },
          { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 30, y: 0 }]
        ], cb)
      }, 25)
    }
  },
  startTimer(cb) {
    let heartBtnPosition = this.data.heartBtnPosition
    this.drawImage([
      [{ x: heartBtnPosition.x, y: heartBtnPosition.y }, 
      { x: 70, y: 300 }, { x: -50, y: 150 }, { x: 30, y: 0 }],
      [{ x: heartBtnPosition.x, y: heartBtnPosition.y }, 
      { x: 30, y: 300 }, { x: 80, y: 150 }, { x: 30, y: 0 }],
      [{ x: heartBtnPosition.x, y: heartBtnPosition.y },
      { x: 0, y: 90 }, { x: 80, y: 100 }, { x: 30, y: 0 }]
    ], cb)
  },
  start(e) {
    let x = e.touches[0].x,
        y = e.touches[0].y
    console.log(x, y)
    if (btnListenerList.length) {
      for (var item of btnListenerList) {
        if (item.x < x && item.x + item.imgW > x 
          && item.y < y && item.y + item.imgH > y) {
            item.cb(e)
          }
      }
    }
  },
  move(e) {
    let x = e.touches[0].x,
        y = e.touches[0].y
  },
  end(e) {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        sysInfo = res
        console.log(sysInfo)
        this.setData({
          heartBtnPosition: {
            x: sysInfo.windowWidth - 150,
            y: sysInfo.windowHeight - 60, 
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    context = wx.createCanvasContext('canvas')
    // contextBtn = wx.createCanvasContext('canvas-btn')

    let heartBtnPosition = this.data.heartBtnPosition,
      imgW = this.data.imgW,
      imgH = this.data.imgH

    context.drawImage("../../images/heart_button.png", heartBtnPosition.x, heartBtnPosition.y, imgW, imgH)
    context.draw(true)

    btnListenerList.push({
      x: heartBtnPosition.x, y: heartBtnPosition.y,
      imgW, imgH,
      cb: (e) => {
        console.log('yes', this)
        this.startTimer(() => {
          context.drawImage("../../images/heart_button.png", heartBtnPosition.x, heartBtnPosition.y, imgW, imgH)
          context.draw()
        })
      }
    })
    // this.startTimer()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let ctx = wx.createCanvasContext('canvas-cover')
    ctx.drawImage('../../images/avatar.png', sysInfo.windowWidth - 121, sysInfo.windowHeight - 182, 121, 182)
    ctx.draw()
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
    if (this.timer !== null) {
      // cancelAnimationFrame(timer)
      clearTimeout(timer)
    }
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