// pages/money/money.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgUrl,
    rule: false,
    isShowToast: false,
    pop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      user: wx.getStorageSync('user'),
      id: wx.getStorageSync('id'),
      activeId: wx.getStorageSync('activeId'),
      art: wx.getStorageSync('art'),
      title: wx.getStorageSync('title'),
      money: wx.getStorageSync('money')
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  onShow() {
    //用户类型
    // app.userTypes(this.data.id, this)
    this.getData()
  },
  getData() {
    let _this = this
    common.get('/user/balance', {
      id: _this.data.id
    }).then(res => {
      console.log(res)
      _this.setData({
        balance: res.data.data.balance,
        nobalance: res.data.data.nobalance,
        status: res.data.data.status,
        wzurl: res.data.data.task_url
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 提现
  money() {
    let _this = this
    common.post('/user/withdraw', {
      id: _this.data.id,
      action_id: _this.data.activeId
    }).then(res => {
      console.log(res)
      if (res.data.data.code == '200') {
        _this.setData({
          pop: true
        })
      } else if (res.data.data.code == '100') {
        _this.setData({
          balance: res.data.data.balance
        })
        app.showToast(res.data.data.msg, _this, 2000)

      } else {
        app.showToast(res.data.data.msg, _this, 2000)
      }
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  //请求审核
  savaData() {
    let _this = this
    common.post('/user/tocheck', {
      id: _this.data.id
    }).then(res => {
      console.log(res)
      app.showToast(res.data.msg, _this, 2000)
      this.setData({
        pop2: false,
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 打开提现弹出框
  openPop1(e) {
    this.setData({
      pop: true,
    })
  },
  // 关闭弹出框
  closePop1() {
    this.setData({
      pop: false
    })
  },
  // 打开提现弹出框
  openPop2(e) {
    this.setData({
      pop2: true,
    })
  },
  // 关闭弹出框
  closePop2() {
    this.setData({
      pop2: false
    })
  },
  jumpRwdet(){
    let that = this
    let wzurl = that.data.wzurl
    debugger
    wx.navigateTo({
      url: '/pages/webview/webview?wzurl=' + wzurl,
    })
  }
})