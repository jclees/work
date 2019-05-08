const app = getApp()
const common = require('../../assets/js/common');

Page({
  data: {
    img_url: app.data.imgUrl,
    submitTxt: "同意并继续"
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
    if (member_id) {
      that.setData({
        member_id: member_id,
      })
      that.getData()
    } else {
      that.setData({
        isAuthorize: !0
      })
    }
  },
  getData() { //初始化数据
    let that = this;
    that.getPact()
  },
  getPact() {
    // debugger
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/member/get_waitsign_pact', {
      member_id: that.data.member_id
    }).then(res => {
      wx.hideLoading()
      console.log("阅读合同")
      console.log(res)
      if (res.data.err_code == 0) {
        that.setData({
          pactData: res.data.result
        })
      } else {
        app.showToast({
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
  savaData(e) {
    app.getFormId(this, e);
    let that = this;
    that.setData({
      submitTxt: '跳转中...',
    });
    setTimeout(function() {
      wx.reLaunch({
        url: "/pages/module/webview/webview?waitsign_id=" + that.data.pactData.waitsign_id,
      })
    }, 1000)
  },
  _jump: function(a) {
    var t = a.currentTarget.dataset.url;
    wx.navigateTo({
      url: t
    });
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