const app = getApp()
const common = require('../../assets/js/common');
const imgUrl = app.data.imgUrl
Page({
  data: {
    img_url: app.data.imgUrl,
    currentTab: 1,
    index: 0,
    navbar: [{
      name: '去年',
      id: 1
    }]
  },
  onLoad: function(options) {
    let that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 396;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    // let member_id = 20;
    // wx.setStorageSync('member_id', member_id)
    if (member_id) {
      that.setData({
        member_id: member_id,
      })
      that.checkStatus();
    } else {
      that.setData({
        isAuthorize: !0
      })
    }
  },
  onHide() {
    let that = this;
    that.setData({
      currentTab: 1,
      index: 0,
    })
  },
  onUnload() {
    let that = this;
    that.setData({
      currentTab: 1,
      index: 0,
    })
  },
  getData() { //初始化数据
    let that = this;
    that.getWages();
    that.getNowYear();
    that.getMemberInfo();
    app.getUserInfo().then(function(res) {
      that.setData({
        userInfo: res
      })
    });
  },
  checkStatus() {
    // debugger
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/member/checkstatus', {
      member_id: that.data.member_id
    }).then(res => {
      wx.hideLoading()
      console.log("个人身份状态")
      console.log(res)
      wx.hideLoading()
      if (res.data.err_code == 0) {
        // debugger
        if (res.data.result.status == 0) {
          wx.reLaunch({
            url: '/pages/idcard/idcard',
          })
          return
        } else if (res.data.result.status == 1) {
          // debugger
          if (res.data.result.is_waitsign == 1) {
            wx.reLaunch({
              url: '/pages/uploadIdcard/uploadIdcard',
            })
          } else {
            if (res.data.result.no_waitsign == 1) {
              wx.reLaunch({
                url: '/pages/readingPact/readingPact',
              })
            }
          }
          return
        } else if (res.data.result.status == 2) {
          wx.reLaunch({
            url: '/pages/uploadIdcard/uploadIdcard',
          })
          return
        } else if (res.data.result.status == 3) {
          if (res.data.result.no_waitsign == 1) {
            wx.reLaunch({
              url: '/pages/readingPact/readingPact',
            })
            return
          }
        }
        // debugger
        that.getData()
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  getMemberInfo() {
    // debugger
    let that = this;
    common.get('/member/center', {
      member_id: that.data.member_id
    }).then(res => {
      console.log("member_info")
      console.log(res)
      if (res.data.err_code == 0) {
        app.globalData.memberInfo = res.data.result
        console.log(app)
        that.setData({
          memberInfo: res.data.result
        })
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  getNowYear() {
    // debugger
    let that = this;
    common.get('/nowYear', {}).then(res => {
      console.log("工资年份")
      console.log(res)
      if (res.data.err_code == 0) {
        let navbar = that.data.navbar;
        if (navbar.length >= 2) return;
        let obj = {};
        obj.name = res.data.result
        obj.id = 0
        navbar.push(obj)
        that.setData({
          navbar
        })
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  getWages(iswho) {
    let that = this;
    let era = iswho || 0;
    common.get('/getWages', {
      member_id: that.data.member_id,
      era: era
    }).then(res => {
      console.log("工资列表")
      console.log(res)
      if (res.data.err_code == 0) {
        that.setData({
          wagesData: res.data.result
        })
        if (res.data.result.length == 0) {
          app.showToast({
            title: '当前年份没有工资列表',
            duration: 3000
          })
        }
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  openDetail(e) {
    app.getFormId(this, e);
    let that = this;
    let wage_id = e.currentTarget.dataset.wage_id;
    that.setData({
      pop1: !0,
      wage_id
    })
    common.get('/getItem', {
      wage_id: wage_id
    }).then(res => {
      console.log("工资详情")
      console.log(res)
      if (res.data.err_code == 0) {
        that.setData({
          detailData: res.data.result
        })
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
  },
  savaData(e) {
    app.getFormId(this, e);
    let cur_id = e.currentTarget.dataset.cur_id;
    let that = this;
    let wage_id = that.data.wage_id;
    let wrong = that.data.tellWrong;
    if (cur_id == 1) {
      console.log(void 0)
      if (wrong == '' || wrong == null || wrong == void 0) {
        app.showToast({
          title: '请填写您遇到的问题',
        })
        return
      }
      common.post('/tellWrong', {
        wage_id,
        wrong
      }).then(res => {
        console.log("一键报错")
        console.log(res)
        if (res.data.err_code == 0) {
          that.setData({
            pop1: !1,
            pop2: !1
          })
        }
        app.showToast({
          title: res.data.msg,
        })
        that.getWages()
      }).catch(e => {
        app.showToast({
          title: "接口获取数据失败 状态码:" + e.data.status_code,
        })
        console.log(e)
      })
    } else {
      that.setData({
        pop1: !1,
        pop2: !1
      })
      wx.navigateTo({
        url: "/pages/module/webview2/webview?id=" + wage_id,
      })

      // common.get('/verify', {
      //   wage_id
      // }).then(res => {
      //   console.log("提交工资")
      //   console.log(res)
      //   if (res.data.err_code == 0) {
      //     that.setData({
      //       pop1: !1,
      //       pop2: !1
      //     })
      //     wx.navigateTo({
      //       url: "/pages/module/webview/webview?url=" + res.data.result.url,
      //     })
      //     that.getWages()
      //   }else{
      //     app.showToast({
      //       title: res.data.msg,
      //     })
      //   }
      // }).catch(e => {
      //   app.showToast({
      //     title: "接口获取数据失败 状态码:" + e.data.status_code,
      //   })
      //   console.log(e)
      // })
    }
  },
  bindInp(e) {
    let that = this;
    let val = e.detail.value;
    that.setData({
      tellWrong: val
    })
  },
  openError(e) {
    app.getFormId(this, e);
    let that = this;
    that.setData({
      pop2: !0
    })
  },
  closeError(e) {
    app.getFormId(this, e);
    let that = this;
    that.setData({
      pop2: !1
    })
  },
  navbarTap(e) {
    let that = this,
      id = e.currentTarget.dataset.id;
    if (id == 0) {
      that.getWages()
    } else if (id == 1) {
      that.getWages(1)
    }
    that.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function(event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  bindgetuserinfoHandler(e) {
    let that = this;
    app.getUserInfo(!0).then(res => {
      console.log(res)
      wx.setStorageSync("member_id", res.member_id)
      that.setData({
        isAuthorize: !1,
        userInfo: res.userInfo,
        member_id: res.member_id
      })
      that.checkStatus()
    })
  }
})