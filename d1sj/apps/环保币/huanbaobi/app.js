let setting = require('assets/js/setting')
let common = require('assets/js/common')

App({
  data: {
    imgUrl: setting.imgUrl,
  },
  //授权
  getUserInfo: function(n) {
    let that = this;
    let P = new Promise(function(resolve, reject) {
      // debugger
      if (n) {
        wx.login({
          success: function(o) {
            // debugger
            wx.getUserInfo({
              lang: 'zh_CN',
              success: function(e) {
                common.post('/member/oauth', {
                  iv: e.iv,
                  encryptedData: e.encryptedData,
                  code: o.code
                }).then(res => {
                  // console.log("授权信息")
                  // console.log(res)
                  if (res.data.err_code == 0) {
                    let r = {};
                    r.userInfo = e.userInfo;
                    r.member_id = res.data.result.member_id;
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
              fail: function(res) {
                "function" == typeof n && n(res);
              },
              complete: function() {}
            })
          },
          fail: function() {
            wx.showModal({
              title: "获取信息失败",
              content: "请允许授权以便为您提供给服务",
              success: function(e) {
                e.confirm && this.getUserInfo();
              }
            });
          }
        })
        return
      }
      wx.getSetting({
        success: function(res) {
          // debugger
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              lang: 'zh_CN',
              success: function(res) {
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
  onHide() {
    // wx.pauseBackgroundAudio();
  },
  onUnload() {
    // wx.pauseBackgroundAudio();
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
  showToast: function(param) {
    wx.showToast({
      title: param.title || '成功',
      icon: param.icon || 'none',
      duration: param.duration || 2000
    })
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
    tabBarPagePathArr: '[]',
    userInfo: null,
    pop1: false,
    pop2: false,
    pop3: false,
    pop4: false,
    pop5: false,
    pop6: false,
  },
  popLock: function(id) {
    switch (id) {
      case '1':
        if (!this.globalData.pop1) {
          this.globalData.pop1 = true;
        }
        break;
      case '2':
        if (!this.globalData.pop2) {
          this.globalData.pop2 = true;
        }
        break;
      case '3':
        if (!this.globalData.pop3) {
          this.globalData.pop3 = true;
        }
        break;
      case '4':
        if (!this.globalData.pop4) {
          this.globalData.pop4 = true;
        }
        break;
      case '5':
        if (!this.globalData.pop5) {
          this.globalData.pop5 = true;
        }
        break;
      case '6':
        if (!this.globalData.pop6) {
          this.globalData.pop6 = true;
        }
        break;
      default:
        this.globalData.pop1 = false;
        this.globalData.pop2 = false;
        this.globalData.pop3 = false;
        this.globalData.pop4 = false;
        this.globalData.pop5 = false;
        this.globalData.pop6 = false;
    }
  },
  //多张图片上传
  uploadimg(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    console.log("data.path[i]")
    console.log(data.path[i])
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'image', //这里根据自己的实际情况改
      formData: {
        'content-type': 'multipart/form-data',
        image: data.path,
        content_id: data.content_id,
      }, //这里是上传图片时一起上传的数据
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        console.log("resp")
        console.log(resp)
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用 
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          typeof data.picUpSuccess == 'function' && data.picUpSuccess(data);
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  }
})