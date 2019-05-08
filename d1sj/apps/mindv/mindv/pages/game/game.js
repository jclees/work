// pages/game/game.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pop1: false,
    pop2: false,
    pop3: false,
    pop4: false,
    pop5: false,
    isShowToast: false,
    list: [],
    img_url: app.data.url
  },
  openPop() {
    wx.showModal({
      title: '',
      content: '静待开放',
      showCancel: false,
      confirmColor: "#333"
    })
  },
  openPop1() {
    this.setData({
      pop1: true
    })
  },
  openPop2() {
    this.setData({
      pop2: true
    })
  },
  openPop3() {
    this.setData({
      pop3: true
    })
  },
  openPop4() {
    this.setData({
      pop4: true
    })
  },
  openPop5() {
    this.setData({
      pop5: true
    })
  },
  closePop1() {
    this.setData({
      pop1: false
    })
  },
  closePop2() {
    this.setData({
      pop2: false
    })
  },
  closePop3() {
    this.setData({
      pop3: false
    })
  },
  closePop4() {
    this.setData({
      pop4: false
    })
  },
  closePop5() {
    this.setData({
      pop5: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member_id: wx.getStorageSync('member_id'),
      gold: wx.getStorageSync('gold'),
      paiweiStart: wx.getStorageSync('paiweiStart'),
      paiweiEnd: wx.getStorageSync('paiweiEnd'),
      grade: wx.getStorageSync('grade'),
      graderate: wx.getStorageSync('graderate'),
      havestar: wx.getStorageSync('havestar')
    })
    // 获取排位赛的内容
    this.getInfo();
  },
  // 获取排位赛的内容
  getInfo() {
    wx.showLoading({
      title: '加载中',
    })
    common.get('/sports/paiweilist', {
      member_id: this.data.member_id
    }).then(res => {
      wx.hideLoading()
      console.log("技能赛")
      console.log(res)
      if (res.data.code == 403){
        app.showModal({
          content: res.data.msg, confirm: function () {
            app.turnBack();
          }
        });
      }else{
        this.setData({
          list: res.data.data,
        });
        wx.setStorageSync('havestar', res.data.data.havestar)
        wx.setStorageSync('qualifying_id', res.data.data.id)
      }
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 点击跳转匹配
  jump(e) {
    let duanwIndex = e.currentTarget.dataset.index + 1
    let id = e.currentTarget.dataset.item.id;
    let gold = e.currentTarget.dataset.item.gold;
    let is_lock = e.currentTarget.dataset.item.is_lock;
    wx.setStorageSync('special_id', id)
    if (is_lock === 0) {
      wx.navigateTo({
        url: '../../pages/duizhan/duizhan?id=' + id + "&gold=" + gold + "&pw_type=2" + "&duanwIndex=" + duanwIndex,
      })
    }
  },
  onShow: function () {
    this.setData({
      gold: wx.getStorageSync('gold'),
      grade: wx.getStorageSync('grade'),
      graderate: wx.getStorageSync('graderate'),
      havestar: wx.getStorageSync('havestar')
    })
    this.onLoad();
    
  },
})