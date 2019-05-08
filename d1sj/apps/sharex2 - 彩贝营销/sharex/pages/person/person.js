// pages/person/person.js
const app = getApp()
let common = require('../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgUrl,
    pop: false,
    isShowToast: false,
    rule: false,
    rule2: false,
    rule3: false,
    rule4:false
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
    //获取弹出申请小咖状态
    // _this.getXiaokStatus()
    //升级小咖提示文字
    app.getXiaokTit(this)
  },
  //打开小咖排行榜
  openRanking() {
    wx.navigateTo({
      url: '../../pages/ranking/ranking',
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
  // 打开弹出框
  openPop2() {
    this.setData({
      rule2: true
    })
  },
  // 关闭弹出框
  closePop2() {
    this.setData({
      rule2: false
    })
  },
  // 打开弹出框
  openPop3() {
    this.setData({
      rule3: true
    })
  },
  // 关闭弹出框
  closePop3() {
    this.setData({
      rule3: false
    })
  },
  // 打开弹出框
  openPop4() {
    this.setData({
      rule4: true
    })
  },
  // 关闭弹出框
  closePop4() {
    this.setData({
      rule4: false
    })
  },
  onShow() {
    // 获取记录
    this.getInfo();
    // 获取数量
    this.getNum();
    // 用户类型
    app.userTypes(this.data.id, this);
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
          action_id: _this.data.activeId ? _this.data.activeId : '',
          encryptedData: user.encryptedData,
          iv: user.iv,
          parent_id: _this.data.parent_id ? _this.data.parent_id : ''
        }).then(res => {
          _this.setData({
            money: res.data.data.balance
          })
          wx.setStorageSync('money', _this.data.money)
        }).catch(res => {
          console.log('获取数据失败1',res)
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
  getInfo() {
    common.get('/user/record', {
      id: this.data.id,
      action_id: this.data.activeId ? this.data.activeId : 1
    }).then(res => {
      console.log("gnx币记录=====")
      console.log(res)
      this.setData({
        list: res.data.data
      })
    }).catch(res => {
      console.log('获取数据失败22', res)
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 跳转页面
  getPhoneNumber(e) {
    // this.setData({
    //   rule4: true
    // })
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData) 

    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      console.log('111111')
    } else {
      console.log('222222')
    }  

    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请完成授权后进行提现',
        success: function (res) { }
      })
    } else {
      console.log("授权手机号")
      console.log(this.data.id)
      console.log(e.detail.encryptedData)
      console.log(e.detail.iv)
      common.post('/user/phone', {
        id: this.data.id,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then(res => {
        console.log("授权手机号成功===")
        console.log(res)
        wx.navigateTo({
          url: '../../pages/money/money',
        })
      }).catch(res => {
        console.log('获取数据失败33', res)
        let reason = [];
        for (let i in res.data.errors) {
          reason.push(res.data.errors[i][0])
        }
        app.showToast(reason[0] || res.data.message, this, 2000)
      })

    }
  },
  //获取弹出申请小咖状态
  getXiaokStatus() {
    let _this = this
    console.log("获取弹出申请小咖状态===")
    common.get('/user/xiaokaWarn', {
      member_id: _this.data.id ? _this.data.id : "",
    }).then(res => {
      console.log("!!!!!!!获取弹出申请小咖状态")
      if (res.data.code == 1000) {
        _this.setData({
          rule2: true
        })
      }
      console.log(res)
    }).catch(res => {
      console.log('获取数据失败444', res)
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  }
})