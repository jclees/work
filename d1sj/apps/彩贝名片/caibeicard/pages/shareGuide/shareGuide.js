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
      book_id: options.book_id,
      userInfo: app.globalData.userInfo,
      bookInfoData: app.globalData.bookInfoData
    })
  },
  onShow() {
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
  },
  onShareAppMessage: function (res) { //分享
    let that = this
    that.setData({
      pop1: false
    })
    let path = '/pages/productDetails/productDetails?book_id=' + that.data.book_id + '&parent_id=' + that.data.member_id
    console.log("分享链接")
    console.log(path)
    if (res.from === 'button') {
      return {
        title: '只为成长，倡导不花钱',
        path: path,
        imageUrl: '',
        success: function (res) {
          // 转发成功
          console.log("转发成功")
          console.log(res)
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    return {
      title: '只为成长，倡导不花钱',
      path: path,
      imageUrl: '',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})