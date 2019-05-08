// pages/shop/orderDetail/orderDetail.js
let common = require('../../../assets/js/common');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id
    })
    // 获取订单详情
    this.getDetail();
  },
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '010-80776002',
    })
  },
  // 获取订单详情
  getDetail(){
    common.get('/orderinfo',{
      order_id: this.data.order_id
    }).then(res=>{
      console.log("获取订单详情")
      console.log(res)
      this.setData({
        detail:res.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 打开核销盒子
  openPop(){
    this.setData({
      confirm:true
    })
  },
  // 关闭核销盒子
  closePop(){
    this.setData({
      confirm:false
    })
  },
  // 输入核销验证码
  inputPass(e){
    this.setData({
      password:e.detail.value
    })
  },
  // 核销
  clerk(){
    common.post('/orderwriteoff',{
      order_id: this.data.order_id,
      key:this.data.password
    }).then(res=>{
      app.showToast(res.data.msg, this, 2000)
    }).catch(res=>{
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
  onReady: function () {
  
  },
})