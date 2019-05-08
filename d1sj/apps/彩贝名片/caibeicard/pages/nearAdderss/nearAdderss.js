const app = getApp()
const common = require('../../assets/js/common');
Page({
  data: {
    img_url: app.data.imgUrl,
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      nearListData: app.globalData.nearListData
    })
  },
  onShow() {
    let that = this
    that.getData()
  },
  jumpMap(){
    app.turnToPage('/pages/map/map')
  },
  copyTBL(e) {
    app.copying(e)
  },
  seeAddress(){
    debugger
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },
  getData() { //初始化数据
    let that = this
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function(event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  }
})