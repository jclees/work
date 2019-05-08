let setting = require('assets/js/setting')
let common = require('assets/js/common')

//app.js
App({
  data: {
    imgUrl: setting.imgUrl,
  },
  // getUserInfo: function (cb, success, userinfo) {
  //   var that = this
  //   if (this.globalData.userInfo) {
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   } else {
  //     //调用登录接口
  //     wx.login({
  //       success: function (data) {
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.globalData.userInfo = res.userInfo
  //             typeof success == "function" && success(data, res)
  //             typeof cb == "function" && cb(that.globalData.userInfo, res)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  //授权
  globalData: {
    userInfo: {},
    shopCurrentNav:0,
    pop1: false,
    pop2: false,
    pop3: false,
    pop4: false,
    pop5: false,
    pop6: false,
  },
  getUserInfo: function (n) {
    let that = this;
    let P = new Promise(function (resolve, reject) {
      // debugger
      if (n) {
        wx.login({
          success: function (o) {
            // debugger
            wx.getUserInfo({
              lang: 'zh_CN',
              success: function (e) {
                common.post('/member/info', {
                  iv: e.iv,
                  encryptedData: e.encryptedData,
                  code: o.code
                }).then(res => {
                  // console.log("授权信息")
                  // console.log(res)
                  debugger
                  if (res.data.code == 200) {
                    let r = {};
                    r.userInfo = e.userInfo;
                    r.member_id = res.data.member_id;
                    resolve(r);
                  } else {
                    reject(res);
                    that.showToast({
                      title: res.data.msg,
                    })
                  }
                }).catch(e => {
                  app.showToast({
                    title: "接口获取数据失败 状态码:" + e.data.status_code,
                  })
                  console.log(e)
                })
              },
              fail: function (res) {
                "function" == typeof n && n(res);
              },
              complete: function () { }
            })
          },
          fail: function () {
            wx.showModal({
              title: "获取信息失败",
              content: "请允许授权以便为您提供给服务",
              success: function (e) {
                e.confirm && this.getUserInfo();
              }
            });
          }
        })
        return
      }
      wx.getSetting({
        success: function (res) {
          // debugger
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              lang: 'zh_CN',
              success: function (res) {
                // console.log('已经授权')
                that.globalData.userInfo = res.userInfo
                wx.setStorageSync("userInfo", res.userInfo);
                resolve(res.userInfo);
              }
            })
          }
        }
      });
    })
    return P
  },
  showToast: function (text, o, count) {
    var _this = o; count = parseInt(count) ? parseInt(count) : 3000;
    _this.setData({
      toastText: text,
      isShowToast: true,
    });
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, count);
  }
})