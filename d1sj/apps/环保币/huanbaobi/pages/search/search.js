const app = getApp();
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl;
let page = 2;
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    wenzData: [],
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info')
    })
    that.getData()
  },
  onShow() {
    let that = this
    that.setData({
      inputValue: '遇见淮安',
      tempInpVal: '遇见淮安'
    })
  },
  emptyInp() {
    let that = this
    that.setData({
      searchSucc:false,
      inputValue: "遇见淮安",
    })
    that.getData()
  },
  backPage() {
    app.turnBack(1)
  },
  bindInpChange(e) {
    let that = this
    that.setData({
      inputValue: e.detail.value,
    })
    if (that.data.inputValue == '') {
      that.setData({
        searchSucc: false
      })
    } else {
      that.setData({
        searchSucc: true
      })
    }

  },
  bindInpconfirm(e) { //搜索
    let that = this
    let keyword = that.data.inputValue
    let key = e.currentTarget.dataset.key
    if (key) {
      keyword = key
      that.setData({
        inputValue: keyword
      })
    }
    that.setData({
      searchSucc: true,
      keyword: keyword
    })

    that.getData({
      name: that.data.keyword,
      page: 1
    })
  },
  getData(p) { //列表
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/business/businessList', p).then(res => {

      wx.hideLoading()
      console.log("商家列表")
      console.log(res)

      let wenzData = res.data.data

      that.setData({
        wenzData
      })
      page = 2

    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
      page = 2
    })
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    that.getData()
  },
  onReachBottom() { //上拉加载
    var that = this;
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/business/businessList', {
      member_id: that.data.member_id,
      page: page
    }).then(res => {

      wx.hideLoading()
      console.log("商家列表")
      console.log(res)
      if (res.data.code == 200) {

        let wenzData = res.data.data
        if (wenzData.length <= 0) {
          wx.showToast({
            title: "没有更多数据啦~~",
            icon: "none"
          })
          return
        }

        let d = that.data.wenzData
        for (var i = 0; i < wenzData.length; i++) {
          d.push(wenzData[i]);
        }
        that.setData({
          wenzData: d,
        })
        page++
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  }
})