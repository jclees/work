// pages/answer/answer.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allNum: 0,
    checkNum: 0,
    img_url: app.data.url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app);
    const _this = this;
    common.get("/question/questionNum", {
      member_id: wx.getStorageSync('member_id')
    }).then(res => {
      console.log(res)
      if (res.statusCode === 200 && res.data) {
        _this.setData({
          allNum: res.data.allNum,
          checkNum: res.data.checkNum
        })
      }
    })
  },
  answer() {
    wx.navigateTo({
      url: '../../pages/topic/topic',
    })
  },
  title() {
    wx.navigateTo({
      url: '../../pages/status/status',
    })
  },
  onShareAppMessage: function (res) {
    const that = this;
    // if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: "好友pk结果",
        path: '/pages/index/index',
        success: function (res) {
          // 转发成功
          // wx.redirectTo({
          //   url: '/pages/index/index',
          // });
          console.log('转发成功')
        },
        fail: function (res) {
          // 转发失败
          console.log('转发失败')
        }
      }
    // }
  }
})