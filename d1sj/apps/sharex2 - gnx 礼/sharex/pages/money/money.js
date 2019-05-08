// pages/money/money.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgUrl,
    rule:false,
    isShowToast: false,
    pop:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user:wx.getStorageSync('user'),
      id:wx.getStorageSync('id'),
      activeId: wx.getStorageSync('activeId'),
      art: wx.getStorageSync('art'),
      title:wx.getStorageSync('title'),
      money: wx.getStorageSync('money')
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  onShow(){
    let _this = this
    _this.getTixData()
  },
  // 输入地址
  inputAdd(e){
    this.setData({
      address:e.detail.value
    })
  },
  // 提现
  money(){
    let _this=this
    common.post('/user/withdraw',{
      id:this.data.id,
      action_id: this.data.activeId,
      address: this.data.address
    }).then(res=>{
      if(res.data.data.code=='200'){
        console.log(res.data.data.coin)
        wx.navigateTo({
          url: '../../pages/person/person?money=' + res.data.data.coin,
        })
      } else if (res.data.data.code == '402'){
        app.showToast(res.data.data.data, _this, 2000) 
      }
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  getTixData(){
    wx.showLoading({
      title: '加载中',
    })
    let _this = this
    common.get('/active/intro', {
      id: _this.data.activeId,
    }).then(res => {
     console.log(res)
      _this.setData({
        tixData:res.data.data
      })
      wx.hideLoading()
    }).catch(res => {
      console.log(res)
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 打开提现弹出框
  openPop1() {
    this.setData({
      pop: true
    })
  },
  // 关闭弹出框
  closePop1() {
    this.setData({
      pop: false
    })
  },
  // 打开弹出框
  openPop(){
    this.setData({
      rule:true
    })
  },
  // 关闭弹出框
  closePop(){
    this.setData({
      rule:false
    })
  }
})