// pages/noPass/noPass.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer: [],
    title: "",
    bigclass: "",
    smallclass: "",
    img_url: app.data.url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const _this = this;
    common.get("/question/info", {
      id: options.id
    }).then(res => {
      console.log(res);
      console.log(res.data.data.right);
      if (res.statusCode === 200 && res.data.data.id) {
        _this.setData({
          answer: res.data.data.answer,
          title: res.data.data.name,
          bigclass: options.bigclass,
          smallclass: options.smallclass,
          right: res.data.data.right
        })

      }
    })
    // common
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