// pages/salary.js
import { ladder, salaryDetail, } from './data.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {    
    showMore: false,
    tab: 1,
    sale: {
      min: 0,
      max: 30000,
      step: 1,
      value: 0
    },

    salaryDetail,
    saleSituation: [
      {
        placeholder: '美妆',
        value: 0,
        min: 0,
        max: 10000,
        step: 1,
        type: '美妆',
        typeValue: '美妆',
        commission: 0.04,
        commissionValue: 0
      }, {
        placeholder: '美绣',
        value: 0,
        min: 0,
        max: 10000,
        step: 1,
        type: '美绣',
        typeValue: '美绣',
        commission: 0.04,
        commissionValue: 0
      }, {
        placeholder: '美睫',
        value: 0,
        min: 0,
        max: 10000,
        step: 1,
        type: '美睫',
        typeValue: '美睫',
        commission: 0.04,
        commissionValue: 0
      }, {
        placeholder: '开卡',
        value: 0,
        min: 0,
        max: 10000,
        step: 1,
        type: '开卡',
        typeValue: '开卡',
        commission: 0.04,
        commissionValue: 0
      }, {
        placeholder: '卡美妆',
        value: 0,
        min: 0,
        max: 10000,
        step: 1,
        type: '卡美妆',
        typeValue: '卡美妆',
        commission: 0.04,
        commissionValue: 0
      }, {
        placeholder: '卡美绣',
        value: 0,
        min: 0,
        max: 10000,
        step: 1,
        type: '卡美绣',
        typeValue: '卡美绣',
        commission: 0.04,
        commissionValue: 0
      }, {
        placeholder: '卡美睫',
        value: 0,
        min: 0,
        max: 10000,
        step: 1,
        type: '卡美睫',
        typeValue: '卡美睫',
        commission: 0.04,
        commissionValue: 0
      }
    ],

    ladder,

    salaryDetail: {
      saleAmount: 0,
      currentLadder: {},
      lastLadder: {},
      data: [],
      commissionSalary: 0,
      basicSalary: 0,
      reward: 0,
      amountSalary: 0
    },

    computeMonth: {
      base_salary: 2500,
      all_days: 31,
      all_rest: 4,
      work_days: 27,
      daily: 92.593,
      result: 2500
    }
  },

  showMoreSwitch() {
    this.setData({
      showMore: !this.data.showMore
    })
  },

  initLadderData() {
    let ladder = [0, 0, 0, 0].map(item => ({
          value: 5000,
          config: [
            {
              placeholder: '美妆',
              commission: 0,
              type: '美妆',
              title: '美妆',
            }, {
              placeholder: '美绣',
              commission: 0,
              type: '美绣',
              title: '美绣',
            }, {
              placeholder: '美睫',
              commission: 0,
              type: '美睫',
              title: '美睫',
            }, {
              placeholder: '开卡',
              commission: 0,
              type: '开卡',
              title: '开卡',
            }, {
              placeholder: '卡美妆',
              commission: 0,
              type: '卡美妆',
              title: '卡美妆',
            }, {
              placeholder: '卡美绣',
              commission: 0,
              type: '卡美绣',
              title: '卡美绣',
            }, {
              placeholder: '卡美睫',
              commission: 0,
              type: '卡美睫',
              title: '卡美睫',
            }, {
              placeholder: '底薪',
              commission: 0,
              type: '底薪',
              title: '底薪',
            }, {
              placeholder: '奖励',
              commission: 0,
              type: '奖励',
              title: '奖励',
            }
          ]
        }))
    this.setData({ ladder })
  },

  showToast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },

  computedFn() {
    let salaryDetail = {
      saleAmount: 0,
      currentLadder: {},
      lastLadder: {},
      data: [],
      commissionSalary: 0,
      basicSalary: 0,
      reward: 0,
      amountSalary: 0
    }
    try {
      let ladder = this.data.ladder
      let saleSituation = this.data.saleSituation
      let amount = saleSituation.reduce((acc, curr) => {
        return acc + curr.value
      }, 0)
      salaryDetail.saleAmount = amount
      // Get current ladder
      let currentLadder = null, lastLadder = null

      for (let index in ladder) {
        let ladderItem = ladder[index]
        if (ladderItem.value > amount) {
          currentLadder = ladderItem
          if (index === 0) {
            lastLadder = {
              value: 0
            }
          } else {
            lastLadder = ladder[index - 1]
          }
          break
        }
      }

      if (currentLadder === null) {
        currentLadder = ladder[ladder.length - 1]
        lastLadder = ladder[ladder.length - 2]
      }

      salaryDetail.currentLadder = currentLadder
      salaryDetail.lastLadder = lastLadder

      let currentLadderConfig = currentLadder.config
      let salaryArray = currentLadderConfig.map(ladderItem => {
        let currentSaleSituation = saleSituation.filter(saleItem => ladderItem.type === saleItem.type)[0]
        if (!!currentSaleSituation) {
          let commissionSalary = +ladderItem.commission * currentSaleSituation.value / 100

          salaryDetail.commissionSalary = parseFloat((salaryDetail.commissionSalary + commissionSalary).toFixed(2))
          return {
            status: true,
            data: {
              ...ladderItem,
              saleVale: currentSaleSituation.value,
              commissionSalary
            }
          }
        } else {
          if (['奖励', '底薪'].includes(ladderItem.type)) {
            if (ladderItem.type === '底薪') {
              salaryDetail.basicSalary = parseFloat(ladderItem.commission.toFixed(2))
            } else {
              salaryDetail.reward = parseFloat(ladderItem.commission.toFixed(2))
            }
            return {
              status: true,
              data: ladderItem
            }
          } else {
            this.showToast(`查找当前的销售情况出问题: ${ladderItem.type}`)
            return {
              status: false,
              data: ladderItem
            }
          }
        }
      })
      salaryDetail.data = salaryArray
    } catch(e) {
      this.showToast(e)
    } finally {
      console.log(salaryDetail)
      salaryDetail.amountSalary = parseFloat((salaryDetail.basicSalary + salaryDetail.commissionSalary + salaryDetail.reward).toFixed(2))
      this.setData({
        salaryDetail
      })
      this.saveStorage(`salaryDetail`, this.data.salaryDetail)
    }
  },

  saveStorage(key, data) {
    wx.setStorageSync(key, data)
  },

  getStorage(key) {
    return wx.getStorageSync(key)
  },

  tabsHandle(e) {
    let index = +e.currentTarget.dataset.index

    this.setData({
      tab: index
    })
  },

  rangeInput(e) {
    let value = e.detail.value,
        index = e.currentTarget.dataset.index

    this.setData({
      [`ladder[${index}].value`]: +value
    })
    this.saveStorage(`ladder`, this.data.ladder)
    this.computedFn()
  },

  computeMonthInput(e) {
    let value = e.detail.value,
        field = e.currentTarget.dataset.field
    
    this.setData({
      [`computeMonth.${field}`]: +value
    })

    try {
      // base_salary: 2500,
      // all_days: 31,
      // all_rest: 4,
      // work_days: 27,
      // result: 2500
      let { base_salary, all_days, all_rest, work_days } = this.data.computeMonth
      let daily = (base_salary / (all_days - all_rest))
      let result = (daily * work_days).toFixed(3)

      this.setData({
        [`computeMonth.result`]: isNaN(result) ? '数据不完整。' : result,
        [`computeMonth.daily`]: isNaN(daily) ? '数据不完整。' : daily.toFixed(3)
      })
    } catch(e) {
      this.setData({
        [`computeMonth.result`]: '数据不完整。',
        [`computeMonth.daily`]: '数据不完整。'
      })
    }
  },

  commissionInput(e) {
    let value = e.detail.value,
        index = e.currentTarget.dataset.index,
        idx = e.currentTarget.dataset.idx,
        config = this.data.ladder[index].config

    this.setData({
      [`ladder[${index}].config[${idx}].commission`]: +value
    })
    this.saveStorage(`ladder`, this.data.ladder)
    this.computedFn()
  },

  valueChange(e) {
    let value = +e.detail.value,
        type = e.currentTarget.dataset.type
    
    this.data.saleSituation.forEach((item, index) => {
      if (item.type === type) {
        this.setData({
          [`saleSituation[${index}]`]: {
            ...item,
            value,
            commissionValue: (item.commission * value).toFixed(2)
          },
        })
      }
    })
    this.saveStorage(`saleSituation`, this.data.saleSituation)
    this.computedFn()
  },

  saleChange(e) {
    let value = +e.detail.value

    this.setData({
      [`sale.value`]: value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let saleSituation = this.getStorage('saleSituation')

    if (saleSituation) {
      this.setData({
        saleSituation
      })
    }
    let ladder = this.getStorage('ladder')
    if (ladder) {
      this.setData({
        ladder: Array.from(ladder)
      })
    } else {
      if (this.data.ladder) {
        this.setData({
          ladder: Array.from(this.data.ladder)
        })
      } else {
        this.initLadderData()
      }
    }
    let salaryDetail = this.getStorage('salaryDetail')
    if (salaryDetail) {
      this.setData({
        salaryDetail
      })
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