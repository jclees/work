// //app.js
// // var goeasy;
// import GoEasy from './utils/goeasy-wx.0.0.1.min'

/**
 * 获取数据 API 模块
 * @type {Object}
 */
var getdata = require('./utils/getdata.js');


App({
  getdata: getdata,
  data: {
    userInfo: null,
    url: 'https://workerman.weixingzpt.com/imgs/',
    tupian: 'https://caibei.weixingzpt.com/image/',//小程序图片地址
  },
  onReady: function () {
    var vm = this;
    vm.onLaunch()
  },

  // 登录微信
  login: function login() {
    var that = this;

    wx.login({
      success: function success(res) {
        if (res.code) {
          //正常获取到jscode
          that.sendCode(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      },
      fail: function fail(res) {
        console.log('login fail: ' + res.errMsg);
      }
    });
  },
  turnToPage: function turnToPage(url, isRedirect) {
    var tabBarPagePathArr = this.getTabPagePathArr();
    // tabBar中的页面改用switchTab跳转
    if (tabBarPagePathArr.indexOf(url) != -1) {
      this.switchToTab(url);
      return;
    }
    if (!isRedirect) {
      wx.navigateTo({
        url: url
      });
    } else {
      wx.redirectTo({
        url: url
      });
    }
  },

  //获取用户信息
  getUserInfo1: function getUserInfo() {
    return this.globalData.userInfo;
  },

  showModal: function showModal(param) {
    //wx弹窗提示
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function success(res) {
        if (res.confirm) {
          //确定
          //res.stype = param.stype||0;//2017-12-08 14:43:45
          typeof param.confirm == 'function' && param.confirm(param);
        } else {
          //取消
          typeof param.cancel == 'function' && param.cancel(param);
        }
      },
      fail: function fail(res) {
        typeof param.fail == 'function' && param.fail(param);
      },
      complete: function complete(res) {
        typeof param.complete == 'function' && param.complete(param);
      }
    });
  },
  // 获取用户openid等信息，并给到全局变量
  setUserInfoStorage: function setUserInfoStorage(info, callback) {
    for (var key in info) { }
    var key = 'userInfo';
    this.globalData.userInfo = info;
    wx.setStorageSync('client_id', this.globalData.userInfo.openid);//2018-03-14 10:05:52
    wx.setStorage({
      key: key,
      data: this.globalData.userInfo
    });
    typeof callback == 'function' && callback();
  },
  showToast: function (text, o, count) {
    var _this = o;
    count = parseInt(count) ? parseInt(count) : 3000;
    _this.setData({
      toastText: text,
      isShowToast: true,
    });
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, count);
  },
  turnBack: function turnBack(options) {
    //options.delta 返回页面数
    wx.navigateBack({
      delta: options ? options.delta || 1 : 1
    });
  },
  getTabPagePathArr: function getTabPagePathArr() {
    return JSON.parse(this.globalData.tabBarPagePathArr);
  },

  turnToPage: function turnToPage(url, isRedirect) {
    var tabBarPagePathArr = this.getTabPagePathArr();
    // tabBar中的页面改用switchTab跳转
    if (tabBarPagePathArr.indexOf(url) != -1) {
      this.switchToTab(url);
      return;
    }
    if (!isRedirect) {
      wx.navigateTo({
        url: url
      });
    } else {
      wx.redirectTo({
        url: url
      });
    }
  },
  globalData: {
    userInfo: null,
    tabBarPagePathArr: '[]',
    // goeasy: ''
    tupian: 'https://caibei.weixingzpt.com/image/',//小程序图片地址
  },
  onLaunch: function (res) {
    var self = this;
    // self.globalData.goeasy = new GoEasy({
    //   appkey: 'BC-4bf7482eb286470e88ec7346ec02f26b'
    // })
    // self.globalData.goeasy.publish({
    //     channel: 'answer_channel',
    //     message: "1212"
    //   })
    // // console.log(self.globalData.goeasy)
    // self.globalData.goeasy.subscribe({
    //   channel: 'answer_channel', onMessage: function (message) {
    //     console.log(message)
    //   }
    // })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },


})