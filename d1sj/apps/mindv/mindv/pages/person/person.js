// pages/person/person.js
const app = getApp()
let common = require('../../assets/js/common');
var radarChart = null;
var Charts = require('../../utils/pengjincarts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: app.data.url
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      shareGold: wx.getStorageSync('shareGold'),
      nickname: wx.getStorageSync('name'),
      avatar: wx.getStorageSync('image'),
    })
    // 获取个人中心信息
    that.getPerson();
  },
  onReady: function () {
  },
  // 转发接口
  onShareAppMessage: function (res) {
    let _this = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '唯有不断学习,才能立于不败之地！',
        path: '/pages/index/index',
        imageUrl: wx.getStorageSync('img_center'),
        success: function (res) {

          // 转发成功
          common.post('/member/shareAddGold', {
            member_id: wx.getStorageSync('member_id')
          }).then(result => {
            let gold = wx.getStorageSync('shareGold');
            console.log("111111111")
            console.log(result)
            if (result.data.status == 200) {
              wx.showToast({
                title: '获得金币' + gold,
                icon: 'success'
              })
              wx.setStorageSync('gold', wx.getStorageSync('gold') + wx.getStorageSync('shareGold'));
            }
          })
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    return {
      title: '唯有不断学习，才能立于不败之地！',
      path: '/pages/index/index',
      imageUrl: wx.getStorageSync('img_center'),
      success: function (res) {
        // 转发成功
        common.post('/member/shareAddGold', {
          member_id: wx.getStorageSync('member_id')
        }).then(result => {
          let gold = wx.getStorageSync('shareGold');
          console.log("111111111")
          console.log(result)
          if (result.data.status == 200) {
            wx.showToast({
              title: '获得金币' + gold,
              icon: 'success'
            })
            wx.setStorageSync('gold', wx.getStorageSync('gold') + wx.getStorageSync('shareGold'));
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 获取个人中心的信息
  getPerson() {
    wx.showLoading({
      title: '加载中',
    })
    common.get('/member/center', {
      member_id: this.data.member_id
    }).then(res => {
      wx.hideLoading()
      this.setData({
        person: res.data
      })
      console.log(this.data.person)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  }
})

