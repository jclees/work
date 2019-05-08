//app.js
let setting = require('assets/js/setting')
let common = require('assets/js/common');
App({
  data: {
    imgUrl: setting.imgUrl,
    userStatus: true
  },
  onShow: function (options) {
    let _this = this
    if (options.shareTicket) {//取群id
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        complete(res) {
          _this.globalData.shareInfo = res
        }
      })
    }
  },
  getUserInfo: function(cb, success, userinfo) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function(data) {
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo
              typeof success == "function" && success(data, res)
              typeof cb == "function" && cb(that.globalData.userInfo, res)
            }
          })
        }
      })
    }
  },
  showToast: function(text, o, count) {
    var _this = o;
    count = parseInt(count) ? parseInt(count) : 3000;
    _this.setData({
      toastText: text,
      isShowToast: true,
    });
    setTimeout(function() {
      _this.setData({
        isShowToast: false
      });
    }, count);
  },
  globalData: {
    userInfo: null,
    shareInfo:null
  },
  sideIconStatus(id, o) { //普通用户关注提醒
    let _this = o;
    common.get('/user/bombwarn', {
      member_id: id
    }).then(res => {
      console.log("获取是否是普通用户成功111111111")
      console.log(res)
      if (res.data.code == 200) {
        _this.setData({
          userStatus: true
        })
      } else {
        _this.setData({
          userStatus: false
        })
      }
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },

  //升级小咖提示文字、图片
  getXiaokTit(o) {
    let _this = o
    common.get('/user/xiaokatitle', {}).then(res => {
      console.log('升级小咖提示文字、图片')
      console.log(res.data)
      _this.setData({
        xkPopData: res.data
      })
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  },
  //用户类型
  userTypes(id,o) {
    let _this = o
    common.get('/user/memberInfo', {
      member_id: id,
    }).then(res => {
      console.log("用户类型")
      console.log(res)
      if (res.data.type == 1) {
        _this.setData({
          userType: res.data.type,
          posterImgUrl: res.data.qrcode,
          shareNum: res.data.shareNum
        })
        wx.setStorageSync('userType', res.data.type)
        wx.setStorageSync('posterImgUrl', res.data.qrcode)
        wx.setStorageSync('shareNum', res.data.shareNum)
      } else {
        _this.setData({
          userType: res.data.type,
          shareNum: res.data.shareNum
        })
        wx.setStorageSync('userType', res.data.type)
        wx.setStorageSync('shareNum', res.data.shareNum)
      }
    }).catch(res => {
      let reason = [];
      for (let i in res.data.errors) {
        reason.push(res.data.errors[i][0])
      }
      app.showToast(reason[0] || res.data.message, _this, 2000)
    })
  }
})