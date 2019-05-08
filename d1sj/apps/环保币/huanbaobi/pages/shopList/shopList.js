const app = getApp();
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl;
let page = 2;
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    wenzData: []
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info')
    })
    that.getData()
  },
  onShow() {
    let that = this
    var query = wx.createSelectorQuery() //创建节点查询器 query
    query.select('#affix').boundingClientRect() //这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
    query.exec(function (res) {
      console.log(res)
      console.log(res[0].top); // #affix节点的上边界坐
      that.setData({
        menuTop: (res[0].top)
      })
    });
  },
  onPageScroll: function (e) {
    console.log(e.scrollTop);
    var that = this;
    // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位
    if (e.scrollTop > that.data.menuTop) {
      that.setData({
        menuFixed: true
      })
    } else {
      that.setData({
        menuFixed: false
      })
    }
  },
  getData() { //初始化数据
    let that = this
    //轮播图地址
    that.getBannerUrls()
    //列表
    that.getwenzhang()
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/banner/info', {
      member_id: that.data.member_id,
      type: 2
    }).then(res => {
      console.log("banner图")
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          bannerUrls: res.data.data
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
    })
  },
  getwenzhang() { //列表
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/business/businessList', {
      page: 1
    }).then(res => {

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
  bindInpfocus(e) {
    app.turnToPage('/pages/search/search')
  },
  swiperChange: function (e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  swiperChange: function (e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    that.getwenzhang()
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
        if (wenzData.length <= 0){
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