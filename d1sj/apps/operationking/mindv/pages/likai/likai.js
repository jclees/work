// pages/likai/likai.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tupian: getApp().globalData.imgUrl,
    home_type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.get('/pk/homeStatus', {
      home_id: options.home_id
    }).then(res => {
      this.setData({
        home_type: res.data.homeStatus
      })
      switch (this.data.home_type) {
        case 1:
          this.setData({
            home_type: 1
          });
          break;
        case 2:
          this.setData({
            home_type: 2
          });
          break;
        case 2:
          this.setData({
            home_type: 3
          });
          break;
      }


    }).catch(e => {
      console.log('没有获取到房间状态');
    })
  },
  paiwei: function (e) {
    wx.redirectTo({
      url: '/pages/game/game'
    })
  },
  index: function(){
    wx.reLaunch({
      url: '/pages/index/index'
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