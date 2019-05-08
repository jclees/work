const app = getApp()
const common = require('../../assets/js/common');
Page({
  data: {
    img_url: app.data.imgUrl,
  },
  onLoad: function(options) {
    let that = this;
    options.pact_id && that.setData({ pact_id: options.pact_id});
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
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
    common.get('/pactsign/pactShow', {
      pact_id: that.data.pact_id
    }).then(res => {
      wx.hideLoading()
      console.log(res)
      if (res.data.err_code == 0) {
        that.setData({
          pactData: res.data.result
        })
      }
    }).catch(e => {
      app.showToast({
        title: "接口获取数据失败 状态码:" + e.data.status_code,
      })
      console.log(e)
    })
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
  },
  onShareAppMessage: function(res) { //分享
    let that = this
    that.setData({
      pop1: false
    })
    let path = '/pages/index/index?parent_id=' + that.data.member_id
    console.log("分享链接")
    console.log(path)
    if (res.from === 'button') {
      return {
        title: '只为成长，倡导不花钱',
        path: path,
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log("转发成功")
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '只为成长，倡导不花钱',
      path: path,
      imageUrl: '',
      success: function(res) {
        // 转发成功
        console.log("转发成功")
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})