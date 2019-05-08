//index.js
//获取应用实例
const app = getApp()
let common = require('../../assets/js/common');

Page({
  data: {
    pop: false,
    isShowToast: false,
    kaifa: false
  },
  onShow() {
    let _this = this

    // 获取活动信息
    _this.getActive();
    // 获取信息
    _this.getInfo();

  },
  onLoad: function (options) {
    console.log(options.attention)
    let _this = this
    if (options.id) {
      _this.setData({
        parent_id: options.id,
        activeId: options.activeId
      })
    }
    if (options.attention) {
      _this.setData({
        attention: options.attention,
      })
    }
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
  open(e) {
    let _this = this;
    wx.getUserInfo({
      success: function (res) {
        let user = res
        wx.setStorageSync('user', user)
        common.post('/user/info', {
          id: _this.data.id,
          gender: user.userInfo.gender || 0,
          nickname: user.userInfo.nickName,
          avatar: user.userInfo.avatarUrl,
          action_id: _this.data.info.id,
          parent_id: _this.data.parent_id ? _this.data.parent_id : ''
        }).then(res => {
          if (_this.data.attention == 'yes') {
            _this.userType()
          }
          _this.setData({
            money: res.data.data,
            formId: e.detail.formId
          })
          _this.getFormId()
          if (!_this.data.kaifa) {
            wx.redirectTo({
              url: '../../pages/kai/kai?money=' + res.data.data.coin,
            })
          }
          // wx.navigateTo({
          //   url: '../../pages/kai/kai?money=' + res.data.data.coin,
          // })
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
  userType() {//判断用户关注类型
    let _this = this;
    common.get('/user/types', {
      member_id: _this.data.id
    }).then(res => {
      console.log("获取状态成功")
      console.log(res)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  getFormId() {//取FormId
    let _this = this;
    console.log("=============")
    console.log(_this.data.id)
    console.log(_this.data.formId)
    common.get('/user/notes', {
      member_id: _this.data.id,
      form_id: _this.data.formId
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
  // 判断用户是否授权
  getInfo() {
    let _this = this
    wx.login({
      success: function (res) {
        common.get('/user/check', {
          code: res.code
        }).then(result => {
          if (result.data.data.code === 0) {
            // 未授权
            _this.setData({
              id: result.data.data.id
            })
            wx.setStorageSync('id', result.data.data.id)
          } else if (result.data.data.code === 1) {
            _this.setData({
              id: result.data.data.id
            })
            wx.setStorageSync('id', result.data.data.id)
            setTimeout(function () {
              // 已授权,开发为0时才可以跳转
              if (!_this.data.kaifa) {
                wx.redirectTo({
                  url: '../../pages/kai/kai',
                })
              }
              // wx.navigateTo({
              //   url: '../../pages/kai/kai',
              // })
            }, 1000)
          }
        }).catch(result => {
          let reason = [];
          for (let i in result.data.errors) {
            reason.push(result.data.errors[i][0])
          }
          app.showToast(reason[0] || result.data.message, _this, 2000)
        })
      }
    });
  },
  // 获取活动信息
  getActive() {
    common.get('/user/active', {
      id: this.data.activeId ? this.data.activeId : ''
    }).then(res => {
      this.setData({
        info: res.data.data
      })
      wx.setStorageSync('activeId', res.data.data.id)
      wx.setStorageSync('title', res.data.data.name)
      wx.setNavigationBarTitle({
        title: res.data.data.name
      })
      // 获取小程序开发说明
      if (res.data.data.kaifa) {
        this.setData({
          kaifa: true
        })
      }
      // 获取潜力币说明
      this.getArt();
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  },
  // 获取潜力币说明
  getArt() {
    common.get('/active/intro', {
      id: this.data.info.id
    }).then(res => {
      this.setData({
        art: res.data.data
      })
      wx.setStorageSync('art', res.data.data)
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, this, 2000)
    })
  }
})
