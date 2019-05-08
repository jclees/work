let setting = require('assets/js/setting')
let common = require('assets/js/common')

//app.js
App({
  data: {
    imgUrl: setting.imgUrl,
  },
  onLaunch: function() {
    let that = this
    // let member_id = wx.getStorageSync('member_id')
    // if (!member_id) {
    //   wx.reLaunch({
    //     url: '/pages/start/start',
    //   })
    // } else {
    //   wx.reLaunch({
    //     url: '/pages/index/index',
    //   })
    // }
  },
  curtail(arr) { //去除数组第一个值
    var m = arr.slice(0);
    m.shift();
    return m;
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
    userInfo: {},
    location: {}, //附近取货地址
    nearListData: [], //附近取货点列表
    sellProductData: null, //发布产品详情
    personData: null, //各人中心数据
    pop1: false,
    pop2: false,
    pop3: false,
    pop4: false,
    pop5: false,
    pop6: false,
  },
  popLock: function(id) {
    // debugger
    if (id == 1) {
      this.globalData.pop1 = true;
      return false
    } else if (id == 2) {
      this.globalData.pop2 = true;
      return false
    } else if (id == 3) {
      this.globalData.pop3 = true;
      return false
    } else if (id == 4) {
      this.globalData.pop4 = true;
      return false
    } else if (id == 5) {
      this.globalData.pop5 = true;
      return false
    } else if (id == 6) {
      this.globalData.pop6 = true;
      return false
    } else {
      this.globalData.pop1 = false;
      this.globalData.pop2 = false;
      this.globalData.pop3 = false;
      this.globalData.pop4 = false;
      this.globalData.pop5 = false;
      this.globalData.pop6 = false;
    }

    // switch (id) {
    //   case '1':
    //     if (!this.globalData.pop1) {
    //       this.globalData.pop1 = true;
    //     }
    //     break;
    //   case '2':
    //     if (!this.globalData.pop2) {
    //       this.globalData.pop2 = true;
    //     }
    //     break;
    //   case '3':
    //     if (!this.globalData.pop3) {
    //       this.globalData.pop3 = true;
    //     }
    //     break;
    //   case '4':
    //     if (!this.globalData.pop4) {
    //       this.globalData.pop4 = true;
    //     }
    //     break;
    //   case '5':
    //     if (!this.globalData.pop5) {
    //       this.globalData.pop5 = true;
    //     }
    //     break;
    //   case '6':
    //     if (!this.globalData.pop6) {
    //       this.globalData.pop6 = true;
    //     }
    //     break;
    //   default:
    //     this.globalData.pop1 = false;
    //     this.globalData.pop2 = false;
    //     this.globalData.pop3 = false;
    //     this.globalData.pop4 = false;
    //     this.globalData.pop5 = false;
    //     this.globalData.pop6 = false;
    // }
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
  },
  getFormId(o, e) { //取FormId
    let that = o;
    // console.log("取FormId")
    // console.log(e)
    common.post('/index/addFormId', {
      member_id: that.data.member_id,
      form_id: e.detail.formId
    }).then(res => {
      console.log("获取formid成功")
      console.log(res)
    }).catch(e => {
      app.showToast({
        title: "/index/addFormId 接口获取数据失败",
      })
      console.log(e)
    })
  },
  getShareCoin(data) { //分享得币
    let that = data.o;
    common.post('/index/shareAddBi', data.param).then(res => {
      // debugger
      console.log("分享得币")
      console.log(res)
    }).catch(e => {
      app.showToast({
        title: "/index/shareAddBi 接口获取数据失败",
      })
      console.log(e)
    })
  },
  copying(e){
    let that = this, txt = e.currentTarget.dataset.txt, msg = e.currentTarget.dataset.msg || "复制成功";
    wx.setClipboardData({
      data: txt,
      success: function (res) {
        that.showToast({
          title: msg
        })
      }
    });
  },
  calling(e) {
    // debugger
    let that = this, phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }
})