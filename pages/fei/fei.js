// pages/fei/fei.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperData: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    swiperConfig: {
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 3000
    },
    currentSwiper: 0,
    swiperStyles: [],

    upperThreshold: 100,
    mHeight: 400,
  },

  // 计算正在屏幕上显示的 swiper的 styles数组
  calcSwiperStyles() {
    let data = this.data,
        len = data.swiperData.length,
        max = len - 1,
        current = data.currentSwiper,
        show = 3,
        styles = Array(len).fill('swiper-default')
    
    if (current === 0) {
      styles[max] = 'swiper-active-left'
      styles[0] = 'swiper-active-self'
      styles[1] = 'swiper-active-right'
    } else if (current === max) {
      styles[current - 1] = 'swiper-active-left'
      styles[current] = 'swiper-active-self'
      styles[0] = 'swiper-active-right'
    } else {
      styles[current - 1] = 'swiper-active-left'
      styles[current] = 'swiper-active-self'
      styles[current + 1] = 'swiper-active-right'
    }

    return styles
  },

  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })

    setTimeout(() => {
      this.setData({
        swiperStyles: this.calcSwiperStyles()
      })
    }, 0)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(() => {
      this.setData({
        swiperStyles: this.calcSwiperStyles()
      })
    }, 0)
  },

  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    // console.log(e)
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