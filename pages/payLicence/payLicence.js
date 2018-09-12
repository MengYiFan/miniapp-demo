// pages/payLicence/payLicence.js
import originalData from './data.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableData: null,
    searchValue: '',
    scrollInto: '',
    searchResIndex: [],
    searchBtnText: '搜索'
  },
  preSearchValue: '',
  searchIndex: 0,
  searchResult: [],

  bindSearchInput(e) {
    let searchBtnText = '搜索'
    if (this.preSearchValue !== '' && this.preSearchValue == e.detail.value) {
      searchBtnText = '下一个'
    }

    this.setData({
      searchBtnText,
      searchValue: e.detail.value
    })
  },

  searchBtnTap() {
    let searchValue = this.data.searchValue,
        tableData = this.data.tableData,
        reg = new RegExp(searchValue, 'gi'),
        res = [],
        searchResIndex = []
    
    if (!searchValue) {
      return
    }

    // if have, do next
    if (this.preSearchValue !== '' 
        && this.preSearchValue === searchValue
        && this.searchResult.length) {
      this.searchIndex++
      this.searchIndex = this.searchIndex >= this.searchResult.length ? 0 : this.searchIndex
      this.setData({
        searchBtnText: `(${this.searchIndex + 1}/${this.searchResult.length})下一个`,
        scrollInto: `cell${this.searchResult[this.searchIndex].index}` || ''
      })
      return
    }

    this.preSearchValue = searchValue
    // do search handle
    this.searchResult = tableData.filter((item, index) => {
      let r = item.original.match(reg)

      if (Array.isArray(r) && r.length) {
        searchResIndex.push(index)
        return true
      }

      return false
    })

    console.log(this.searchResult)

    if (this.searchResult.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '没有搜到结果...',
      })
      return
    }

    // init index and scroll to
    this.searchIndex = 0
    tableData = tableData.map((item, index) => {
      if (searchResIndex.includes(index)) {
        return Object.assign({}, item, {
          highlight: true
        })
      } else {
        return Object.assign({}, item, {
          highlight: false
        })
      }
    })
    this.setData({
      tableData,
      searchResIndex,
      searchBtnText: `(${this.searchIndex + 1}/${this.searchResult.length})下一个`,
      scrollInto: this.searchResult.length && `cell${this.searchResult[this.searchIndex].index}` || ''
    })
  },

  formatData(data) {
    let res = []
    data.match(/(Z[0-9]+) \W+ \d+年\d+月\d+[日|号]+/g).forEach((item, index) => {
      let data = item.split(' ')
      res.push({
        index,
        id: data[0],
        company: data[1],
        date: data[2],
        original: item
      })
    })

    return res
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tableData: this.formatData(originalData)
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