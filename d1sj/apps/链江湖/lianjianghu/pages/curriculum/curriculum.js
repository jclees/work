// pages/curriculum/curriculum.js
let kecheng = [{
  img: '../../images/img-2.png',
  title: '第一课',
  text: '学而时习之，不亦说乎，监督岗你电话李立冬，阿士大夫。',
  num: 2236,
  time: '08-03 17:23'
}, {
  img: '../../images/img-2.png',
  title: '第一课',
  text: '学而时习之，不亦说乎，监督岗你电话李立冬，阿士大夫。',
  num: 2236,
  time: '08-03 17:23'
}, {
  img: '../../images/img-2.png',
  title: '第一课',
  text: '学而时习之，不亦说乎，监督岗你电话李立冬，阿士大夫。',
  num: 2236,
  time: '08-03 17:23'
}, {
  img: '../../images/img-2.png',
  title: '第一课',
  text: '学而时习之，不亦说乎，监督岗你电话李立冬，阿士大夫。',
  num: 2236,
  time: '08-03 17:23'
}]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navActive: 2, //当前选中的是首页还是我的
    kecheng: kecheng,
    tab: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },
  tab1: function(event) {
    console.log();
    if (event.currentTarget.dataset.id == 1) {
      this.setData({
        tab: 1
      });
    } else {

      this.setData({
        tab: 2
      });
    }
  }
})