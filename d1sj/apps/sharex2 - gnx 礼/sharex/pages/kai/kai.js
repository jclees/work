// pages/kai/kai.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgUrl,
    pop: false,
    pop1: false,
    pop2:false,
    isShowToast: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow:function(){
    this.getNum();
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      money: options.money,
      art: wx.getStorageSync('art'),
      id: wx.getStorageSync('id'),
      activeId: wx.getStorageSync('activeId'),
      title: wx.getStorageSync('title'),
      user: wx.getStorageSync('user'),
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    wx.setStorageSync('money', this.data.money)
    // 获取活动
    this.getActive();
    //普通用户关注提醒
    app.sideIconStatus(this.data.id,this)
  },
  // 获取活动
  getActive() {
    let _this = this
    common.get('/user/active', {
      id: this.data.activeId ? this.data.activeId : ''
    }).then(res => {
      this.setData({
        activeId: res.data.data.id,
        activeName: res.data.data.name
      })
      this.getNum();
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取潜力币
  getNum() {
    let _this = this
    wx.getUserInfo({
      success: function (res) {
        let user = res
        _this.setData({
          user: user
        })
        wx.setStorageSync('user', user)
        common.post('/user/info', {
          id: _this.data.id,
          gender: user.userInfo.gender || 0,
          nickname: user.userInfo.nickName,
          avatar: user.userInfo.avatarUrl,
          action_id: _this.data.activeId
        }).then(res => {
          let a = res.data.data.coin
          _this.setData({
            money: res.data.data.coin,
            //money1: Math.round(parseFloat(_this.data.money * 0.3) * 100) / 100
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '50000糖果来袭，贺GNX上线cybex交易所',
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
  },
  // 打开弹出框
  openPop() {
    this.setData({
      pop: true
    })
  },
  // 关闭弹出框
  closePop() {
    this.setData({
      pop: false
    })
  },
  // 打开弹出框
  openPop1() {
    this.setData({
      pop1: true
    })
  },
  // 关闭弹出框
  closePop1() {
    this.setData({
      pop1: false
    })
  },
  // 打开弹出框
  openPop2() {
    this.setData({
      pop2: true
    })
  },
  // 关闭弹出框
  closePop2() {
    this.setData({
      pop2: false
    })
  },
  // 查看潜力币
  look() {
    wx.navigateTo({
      url: '../../pages/person/person',
    })
  }
})