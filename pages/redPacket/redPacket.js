// pages/redPacket/redPacket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    bestLuck: 0,
    amount: 0,
    total: 0
  },
  // 最小红包值
  MIN_MONEY: 0.01,
  /**
   * 红包运行函数
   * @params amount/金额 total/数量
   * @return bestLuck/手气最佳 
   *         amount/金额 
   *         total/总红包数 
   *         records/领取纪录
   */
  redPacket(amount, total) {
    if (isNaN(amount) || isNaN(total) 
        || total <= 0 
        || (total | 0) !== total 
        || total * this.MIN_MONEY > amount) {
      console.error(`参数不合法`, amount)
      return {
        ret: false
      }
    }

    let records = [],
        remainSize = total,
        remainMoney = amount,
        money = 0,
        bestLuck = this.MIN_MONEY

    while (remainSize) {
      let { hb, money } = this.getRandomMoney({
        remainSize,
        remainMoney
      })

      remainSize = hb.remainSize
      remainMoney = hb.remainMoney

      bestLuck = money > bestLuck ? money : bestLuck

      records.push({
        money, remainMoney
      })
    }

    return {
      ret: true,
      data: {
        bestLuck,
        amount,
        total,
        records
      }
    }
  },
  /**
   * 红包随机函数
   * @params hb对象 { remainSize, remainMoney }
   * @return money/当前领取的金额 
   *         hb对象 { remainSize, remainMoney }
   */
  getRandomMoney(hb) {
    let { remainSize, remainMoney } = hb,
        money = 0,
        // 预留每人的最小红包值
        moneyPool = remainMoney - remainSize * this.MIN_MONEY
    
    moneyPool = Math.round(moneyPool * 100) / 100

    if (remainSize === 1) {
      money = Math.round(remainMoney * 100) / 100
      remainSize--
      remainMoney = 0
    } else {
      let min = 0,
          max = moneyPool / remainSize * 2
          
      money = Math.random() * max
      money = Math.round((money + this.MIN_MONEY) * 100) / 100
      
      remainSize--
      remainMoney -= money

      remainMoney = Math.round(remainMoney * 100) / 100
    }

    return {
      money,
      hb: {
        remainMoney, remainSize
      }
    }
  },
  bindAmountInput(e) {
    this.setData({
      amount: e.detail.value
    })
  },
  bindTotalInput(e) {
    this.setData({
      total: e.detail.value
    })
  },
  submitHB() {
    let amount = +this.data.amount,
        total = +this.data.total,
        res = this.redPacket(amount, total)

    if (res.ret) {
      this.setData({
        records: res.data.records,
        bestLuck: res.data.bestLuck
      })
    } else {
      wx.showToast({
        title: '输入的数字有问题',
        icon: 'none'
      })
    }
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