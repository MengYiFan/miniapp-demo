Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItems: ['三言', '两语', '一文'],
    toView: 'nav-item-0',
    currentNavIndex: null,
    bulkAnimation: '',
    colorAnimation: '',
    circleRadius: 4,

    mainAnimation: []
  },

  navListRect: {},

  navHandle(event) {
    this.animationHandle(event)
  },

  getPositionX(data) {
    let { width, left } = data
    return left + width / 2 - this.data.circleRadius
  },

  animationHandle(event) {
    let index = event.target.dataset.index
    let currentNavIndex = this.data.currentNavIndex
    if (currentNavIndex === index) return

    this.bulkAnimation = wx.createAnimation({
      duration: 250,
      timingFunction: 'ease',
      delay: 1000 / 60
    })

    let circleRadius = this.data.circleRadius,
        lastNav = this.navListRect[currentNavIndex],
        currentNav = this.navListRect[index],
        
        lastPostionX = this.getPositionX(lastNav),
        finallyPostionX = this.getPositionX(currentNav),
        animationWidth = Math.abs(lastPostionX - finallyPostionX) + circleRadius * 2,
        animationPositionX = index - currentNavIndex > 0
                            ? lastPostionX 
                            : finallyPostionX

    this.bulkAnimation.width(animationWidth).translate(animationPositionX, 0).step()
    this.bulkAnimation.width(circleRadius * 2).translate(finallyPostionX, 0).step()
    
    this.colorAnimation = wx.createAnimation({
      timingFunction: 'ease',
      delay: 0
    })
    this.colorAnimation.width(lastNav.width / 2)
                       .translate(index - currentNavIndex > 0 
                                  ? lastNav.left
                                  : lastNav.left + lastNav.width / 2)
                       .step()
    this.colorAnimation.width(currentNav.width).translate(currentNav.left).step()

    this.setData({
      bulkAnimation: this.bulkAnimation.export(),
      colorAnimation: this.colorAnimation.export(),
      currentNavIndex: index,
      // toView: event.target.id
    })
    wx.nextTick(() => {
      this.setData({ toView: event.target.id })
    })
  },

  initNavRect() {
    let query = wx.createSelectorQuery()

    // Async return the rect, so callback to init navigation position
    query.selectAll('.nav-item').boundingClientRect(rect => {
      this.navListRect = rect
      if(this.data.currentNavIndex === null) {
        this.initNavPostion()
      }
    })

    query.exec()
  },

  initNavPostion() {
    let initNav = this.navListRect[0]
    this.bulkAnimation = wx.createAnimation({
      timingFunction: 'ease',
      delay: 0
    })
    this.bulkAnimation.width(this.data.circleRadius * 2)
                      .translate(this.getPositionX(initNav), 0)
                      .step()

    this.colorAnimation = wx.createAnimation({
      timingFunction: 'ease',
      delay: 0
    })
    this.colorAnimation.width(initNav.width)
                       .translate(initNav.left)
                       .step()

    this.setData({
      bulkAnimation: this.bulkAnimation.export(),
      colorAnimation: this.colorAnimation.export(),
      currentNavIndex: 0
    })
  },

  startX: null,
  startY: null,
  touchStart(e) {
    let touchs = e.touches[0],
        x = touchs.clientX,
        y = touchs.clientY
    console.log(e, y)
    this.startX = x
    this.startY = y
  },

  move(e) {
    let touchs = e.touches[0],
        x = touchs.clientX,
        y = touchs.clientY

    let mainAnimation = wx.createAnimation({
      timingFunction: 'ease',
      delay: 0
    })
    let offsetX = Math.abs(this.startX - x)
    let offsetY = Math.abs(this.startY - y)
    let rate = (offsetX / 200 >= 1 ? 1 : offsetX / 200)
    let opacity = 1 - rate
    mainAnimation.opacity(opacity).rotate(-1 * rate * 20).step()
    console.log(opacity)
    this.setData({
      mainAnimation: [mainAnimation.export()],
    })
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
    this.initNavRect()
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