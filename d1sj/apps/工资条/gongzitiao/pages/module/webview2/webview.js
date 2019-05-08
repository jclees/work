// pages/webview/webview.js
const app = getApp();
const common = require('../../../assets/js/common');

Page({

  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (member_id) {
      that.setData({
        member_id: member_id,
        id: options.id
      })
      that.getData()
    }
  },
  getData(e) {
    let that = this;
    console.log({
      member_id: that.data.member_id,
      wage_id: that.data.id
    })

    common.get('/verify', {
      member_id: that.data.member_id,
      wage_id: that.data.id
    }).then(res => {
      console.log("获取url")
      console.log(res)
      if (res.data.err_code == 0) {
        that.setData({
          url: res.data.result.url
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})