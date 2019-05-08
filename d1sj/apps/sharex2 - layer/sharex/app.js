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
    if (options.shareTicket){
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        complete(res) {
          console.log("=============")
          console.log(res)
          _this.globalData.shareInfo = res
          console.log("_this.globalData.shareInfo==")
          console.log(_this.globalData.shareInfo)
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
  }
})