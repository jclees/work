// pages/person/person.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pop:false,
    isShowToast: false,
    rule:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this
    this.setData({
      id:wx.getStorageSync('id'),
      activeId:wx.getStorageSync('activeId'),
      art: wx.getStorageSync('art'),
      title: wx.getStorageSync('title'),
      user: wx.getStorageSync('user')
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  // 打开弹出框
  openPop() {
    this.setData({
      rule: true
    })
  },
  // 关闭弹出框
  closePop() {
    this.setData({
      rule: false
    })
  },
  onShow(){
    // 获取记录
    this.getInfo();
    // 获取数量
    this.getNum();
  },
  
  // 获取数量
  getNum() {
    let _this = this
    wx.getUserInfo({
      success: function (res) {
        let user = res
        wx.setStorageSync('user', user)
        common.post('/user/info', {
          id: _this.data.id,
          gender: user.userInfo.gender||0,
          nickname: user.userInfo.nickName,
          avatar: user.userInfo.avatarUrl,
          action_id: _this.data.activeId
        }).then(res => {
          _this.setData({
            money: res.data.data.coin
          })
          wx.setStorageSync('money', _this.data.money)
        }).catch(res => {
          let reason = [];
          for (let i in res.data.errors) {
            reason.push(res.data.errors[i][0])
          }
          app.showToast(reason[0] || res.data.message, _this, 2000)
        })
      }
    })
  },
  // 获取记录
  getInfo(){
    common.get('/user/record',{
      id:this.data.id,
      action_id: this.data.activeId
    }).then(res=>{
      this.setData({
        list:res.data.data
      })
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 跳转页面
  getPhoneNumber(e){
    common.post('/user/phone',{
      id:this.data.id,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(res=>{
      console.log(res)
    }).catch(res=>{
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
    wx.navigateTo({
      url: '../../pages/money/money',
    })
  }
})