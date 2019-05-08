// pages/person/person.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgUrl,
    isShowToast: false,
  },
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求  
          console.log(res.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    let _this = this
    this.setData({
      id: wx.getStorageSync('id'),
      activeId: wx.getStorageSync('activeId'),
      art: wx.getStorageSync('art'),
      title: wx.getStorageSync('title'),
      user: wx.getStorageSync('user')
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  onShow() {
    // 获取排行榜记录
    this.getRanKing();
  },
  // 获取排行榜记录
  getRanKing() {
    var _this = this
    common.get('/user/ranking', {
      member_id: this.data.id,
    }).then(res => {
      console.log("获取排行榜记录=====")
      console.log(res)
      var obj = {}
      obj = res.data
      obj.config.first_money = parseInt(obj.config.first_money)
      obj.config.second_money = parseInt(obj.config.second_money)
      obj.config.third_money = parseInt(obj.config.third_money)
      obj.config.fourth_money = parseInt(obj.config.fourth_money)
      _this.setData({
        list: obj,
        listLength:res.data.list.length
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'BST空投150万糖果，交易所正常交易，点击即可领取',
      imageUrl: '',
      path: '/pages/index/index?id=' + this.data.id + '&&activeId=' + this.data.activeId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getFormId(e) {//取FormId
    let _this = this;
    console.log("=============")
    console.log(_this.data.id)
    console.log(e.detail.formId)
    common.get('/user/notes', {
      member_id: _this.data.id,
      form_id: e.detail.formId
    }).then(res => {
      console.log("获取formid成功===")
      console.log(res)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  }
})