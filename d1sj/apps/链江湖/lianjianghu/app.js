let setting = require('assets/js/setting')
let common = require('assets/js/common')

//app.js
App({
  data:{
    imgUrl: setting.imgUrl,
  },
  onLaunch: function() {
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
  navStatus(o,c,p){//可发表文章状态
    let _this = o
    _this.setData({
      navActive: c ? c : 1
    })
    common.get('/isKa', p).then(res => {
      console.log('iska')
      console.log(res)
      if (res.data.code == 1002) {
        _this.setData({
          showNav: true,
        })
      } else if (res.data.code == 1001){
        _this.setData({
          showNav: false,
        })
      }
      if (res.data.signCode == 200) {
        _this.setData({
          signStatus: false,
        })
      } else if (res.data.signCode == 2001) {
        _this.setData({
          signStatus: true,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "/isKa 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getUserInfo: function (cb, success, userinfo) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (data) {

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof success == "function" && success(data, res)
              typeof cb == "function" && cb(that.globalData.userInfo, res)
            }
          })
        }

      })
    }
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
  showToast: function (param) {
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
        information_id: data.information_id,
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