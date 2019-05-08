// pages/person/order/order.js
//获取应用实例
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    isShowToast: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      member_id: wx.getStorageSync('member_id')
    })
    this.getOrder();
  },
  // 获取订单列表
  getOrder() {
    common.get('/orderlist', {
      member_id: this.data.member_id
    }).then(res => {
      console.log("获取订单列表")
      console.log(res)
      if (res.data.data.lists.length <= 0) {
        app.showToast("暂无数据", this, 2000)
        return
      }
      this.setData({
        orderList: res.data.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  }
})