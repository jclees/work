// pages/coin/coin.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coin: [{
      name: '比特币',
      imgUrl: '../../images/icon-coin-1.png',
      numSS: 299
    }, {
      name: '以太坊',
      imgUrl: '../../images/icon-coin-2.png',
      numSS: 599
    }, {
      name: '莱特币',
      imgUrl: '../../images/icon-coin-3.png',
      numSS: 199
    }, {
      name: '泰达币',
      imgUrl: '../../images/icon-coin-4.png',
      numSS: 299
    }, {
      name: '火币',
      imgUrl: '../../images/icon-coin-5.png',
      numSS: 299
    }, {
      name: '币安币',
      imgUrl: '../../images/icon-coin-6.png',
      numSS: 299
    }, {
      name: 'ICX',
      imgUrl: '../../images/icon-coin-7.png',
      numSS: 299
    }, {
      name: '比特股',
      imgUrl: '../../images/icon-coin-8.png',
      numSS: 299
    }, {
      name: '波场',
      imgUrl: '../../images/icon-coin-9.png',
      numSS: 299
    }, {
      name: '埃欧塔',
      imgUrl: '../../images/icon-coin-10.png',
      numSS: 299
    }, {
      name: '达世币',
      imgUrl: '../../images/icon-coin-11.png',
      numSS: 299
    }, {
      name: '莱特币',
      imgUrl: '../../images/icon-coin-12.png',
      numSS: 299
    }],
    navActive: 2, //nav当前页面
    pop3: false,
    index: 0,
    inputValue: '' //兑换币实时输入个数
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
  popLock: function(event) {
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop3: app.globalData.pop3,
      index: (event.currentTarget.dataset.index == undefined || event.currentTarget.dataset.index == '') ? 0 : event.currentTarget.dataset.index
    });
  },

  bindKeyInput: function(evevt) {
    this.setData({
      inputValue: evevt.detail.value
    })
  },
})