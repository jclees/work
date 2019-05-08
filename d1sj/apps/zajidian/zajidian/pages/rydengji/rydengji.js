// pages/ryshop/ryshop.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    smallmodel:false,
    tupian: getApp().globalData.imgUrl,
    image: getApp().globalData.siteUrl,
  },
  smallModel:function(){
    this.setData({
      smallmodel:!this.data.smallmodel
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let apiurl = 'Grad/getGradDetail';
    app.getdata.fetchApi(apiurl, {})
      .then(d => {
        if (d.status == 1) {
          this.setData({ list: d.data })
        } else {
          this.showToast({
            title: '暂无数据！',
            icon: 'loading'
          });
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
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