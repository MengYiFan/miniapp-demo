// pages/canvas/canvas.js 
import { chunkArr } from '../../utils/common'

Page({
  context: null,
  isPainting: false,
  canvasData: [],
  currentCanvasData: [],
  arrX: [],
  arrY: [],
  arrZ: [],
  Uint8ClampedArray: [],
  canvasW: 0,
  canvasH: 0,
  /** 
   * 页面的初始数据 
   */
  data: {
    btnItems: [
      { iconUri: '../../images/font.png', type: 'font' },
      { iconUri: '../../images/back.png', type: 'back' },
      { iconUri: '../../images/eraser.png', type: 'eraser' },
      { iconUri: '../../images/download.png', type: 'download' }
    ],
    colors: [
      '#444444', '#ff6666', '#ff9966', '#99cc99', '#0099cc', '#336699',
      '#888888', '#99ccff', '#ccccff', '#0099ff', '#66FF99'
    ],
    color: '#444444',// 默认笔头颜色
    showListType: '',
    fontSizes: [
      { title: '13px', size: '26rpx' },
      { title: '14px', size: '28rpx' },
      { title: '15px', size: '30rpx' },
      { title: '17px', size: '34rpx' },
      { title: '19px', size: '38rpx' },
      { title: '23px', size: '46rpx' }
    ],
    fontSizeIndex: 0,
    fontSize: 4
  },
  // 开始画
  canvasStart(e) {
    let touchs = e.touches[0],
        x = touchs.x,
        y = touchs.y

    this.context.beginPath()
    this.context.moveTo(x, y)
    this.currentCanvasData = {
      color: this.data.color,
      fontSize: this.data.fontSize,
      data: []
    }
    this.currentCanvasData.data.push({
      x, y,
      type: 'move'
    })

    this.setData({
      showListType: ''
    })
  },
  // 画笔移动
  canvasMove(e) {
    let touchs = e.touches[0],
        x = touchs.x,
        y = touchs.y
    this.currentCanvasData.data.push({
      x, y,
      type: 'line'
    })

    this.context.lineTo(x, y)
    this.context.stroke()
    this.context.draw(true)
    this.context.moveTo(x, y)
    // let currentCanvasData = this.currentCanvasData.data
    // for (var data of currentCanvasData) {
    //   if (data.type == 'line') {
    //     this.context.lineTo(data.x, data.y)
    //   } else {
    //     this.context.moveTo(data.x, data.y)
    //   }
    // }
    // this.context.restore()
    // this.context.stroke()
    // this.context.draw(true)
  },
  // 结束
  canvasEnd(e) {
    let data = this.currentCanvasData.data
    if (typeof data != 'undefined' && data.length > 1) {
      this.canvasData.push(this.currentCanvasData)
      wx.setStorageSync('canvasStorage', this.canvasData)
    }
    console.log(this.canvasData)
  },
  // 撤退
  canvasBack(e) {
    this.canvasData.pop()
    console.log(this.canvasData)
    if (!this.canvasData.length) {
      this.bindCleardrawTap()
      return
    }

    this.paintFn(this.context)
  },
  paintFn(context) {
    context.clearRect(0, 0, this.canvasW, this.canvasH)
    let canvasData = this.canvasData
    context.beginPath()
    console.log(canvasData)
    for (var item of canvasData) {
      let color = item.color,
          fontSize = item.fontSize,
          data = item.data
      
      // context.save()
      context.setStrokeStyle(color)
      this.context.setLineWidth(fontSize)
      this.setData({
        color
      })
      
      for (var currentVal of data) {
        if (currentVal.type == 'line') {
          context.lineTo(currentVal.x, currentVal.y)
        } else {
          context.moveTo(currentVal.x, currentVal.y)
        }
      }
      context.stroke()
      context.draw(true)
      // context.restore()
    }
  },
  // canvas 出错
  canvasIdErrorCallback(e) {
    console.error(e.detail.errMsg)
  },
  bindBtnTap(e) {
    console.log(e)
    let btnType = e.currentTarget.dataset.type
    switch(btnType) {
      case 'font': {
        this.bindFontSizeTap(e)
        break
      }
      case 'eraser': {
        this.bindCleardrawTap()
        break
      }
      case 'back': {
        this.canvasBack(e)
        break
      }
      case 'download': {
        this.bindSaveImageTap()
        break
      } 
    }
  },
  // 换取颜色
  bindColorTap(e) {
    // let color = '#' + Math.random().toString(16).slice(2, 8)
    // this.context.setStrokeStyle(color)
    this.setData({
      showListType: 'colors'
    })
  },
  // 字体设置
  bindFontSizeTap(e) {
    this.setData({
      showListType: 'fontSize'
    })
  },
  // 选取笔头大小
  bindFontSelectorTap(e) {
    let dataset = e.currentTarget.dataset,
        size = parseInt(dataset.size) - 9
    this.context.setLineWidth(size)
    this.setData({
      fontSizeIndex: dataset.index,
      fontSize: size,
      showListType: ''
    })
  },
  // 选取颜色
  bindColorSelectorTap(e) {
    let dataset = e.currentTarget.dataset,
        color = dataset.color

    this.context.setStrokeStyle(color)
    console.log(color, this.data)
    this.setData({
      color,
      showListType: ''
    })
  },
  // 清除画布
  bindCleardrawTap(e) {
    this.context.clearRect(0, 0, this.canvasW, this.canvasH)
    this.context.draw(true)
    this.canvasData = []
    this.currentCanvasData = []
    wx.clearStorageSync()
  },
  // 保存图片
  bindSaveImageTap(e) {
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: res => {
        console.log(res.tempFilePath)
        // 保存图片
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    })
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    let colors = this.data.colors
    this.setData({
      colors: chunkArr(colors, 5)
    })

    wx.getSystemInfo({
      success: (res) => {
        this.canvasW = res.windowWidth; 
        this.canvasH = res.windowHeight
      }
    })

    let data = this.data,
        size = parseInt(data.fontSizes[data.fontSizeIndex].title) - 9
    this.context = wx.createCanvasContext('canvas')

    this.context.setStrokeStyle(data.color)
    this.context.setLineWidth(size)
    this.context.setLineCap('round')
    this.context.setLineJoin('round')
    // this.context.save()
    console.log(options.data)
    if (options.data) {
      this.canvasData = JSON.parse(options.data)
      wx.setStorageSync('canvasStorage', this.canvasData)
    }
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
    if (wx.getStorageSync('canvasStorage')) {
      this.canvasData = wx.getStorageSync('canvasStorage')
      this.paintFn(this.context)
    }
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
    return {
      title: '随便画画不当真',
      path: 'pages/canvas/canvas?data=' + JSON.stringify(this.canvasData),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})  