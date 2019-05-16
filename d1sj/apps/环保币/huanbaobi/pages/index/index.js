const app = getApp()
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
let page = 2;

Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    wenzData: [],
    infoData: []
  },
  onLoad: function(options) {
    // wx.showTabBarRedDot({
    //   index:3
    // })
    // wx.setTabBarBadge({
    //   index: 3,
    //   text:"99999999"
    // })
    let that = this
    // 登录
    wx.login({
      success: function(data) {
        that.setData({
          loginData: data
        })
      }
    })
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      that.setData({
        pop1: true
      })
      wx.hideTabBar()
    } else {
      that.setData({
        member_id: member_id,
        pop1: false
      })
      publicMethod.getPos(this)
      that.getData()
    }
  },
  onShow() {
    // wx.setStorageSync('member_id', 35);
    let that = this
    this.audioCtx = wx.createAudioContext('myAudio');
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log('已经授权')
              console.log(res.userInfo)
              wx.setStorageSync('user_info', res.userInfo);
            }
          })
        }
      }
    })
  },
  onHide() {
    this.audioCtx.pause()
  },
  onUnload() {
    this.audioCtx.pause()
  },
  getData() { //初始化数据
    let that = this
    //轮播图地址
    that.getBannerUrls()
    //列表
    that.getwenzhang()
    //全局配置
    publicMethod.getConfig(this)
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/banner/info', {
      member_id: that.data.member_id,
      type: 1
    }).then(res => {
      console.log("banner图")
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          bannerUrls: res.data.data
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
      console.log(e)
    })
  },
  getwenzhang() { //列表
    let that = this
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...'
    })
    common.get('/article/info', {
      member_id: that.data.member_id,
      page: 1
    }).then(res => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      console.log("首页列表")
      console.log(res)
      let infoData = res.data.data
      let wenzData = res.data.data.article

      that.setData({
        wenzData,
        infoData
      })
      page = 2
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
      page = 2
    })
  },
  swiperChange: function(e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onMusicTap(e) { //背景音乐
    publicMethod.getFormId(e, this)
    var that = this;
    that.setData({
      isPlayingMusic: !that.data.isPlayingMusic
    });
    if (!that.data.isPlayingMusic) {
      this.audioCtx.pause()
    } else {
      this.audioCtx.play()
    }
  },
  getUserInfo: function(e) { //授权 获取个人信息
    let that = this
    wx.setStorageSync('user_info', e.detail.userInfo)
    console.log({
      code: that.data.loginData.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    })
    common.post('/member/oauth', {
      code: that.data.loginData.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          pop1: false
        })
        console.log("授权成功")
        wx.showTabBar()
        that.setData({
          member_id: res.data.member_id
        })
        wx.setStorageSync('member_id', that.data.member_id)
        that.onLoad()
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
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
  onShareAppMessage: function(res) { //分享
    let that = this
    return {
      title: '青山派 正在发生…',
      imageUrl: '',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    that.getwenzhang()
  },
  onReachBottom() { //上拉加载
    var that = this;
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    })
    console.log(page)
    common.get('/article/info', {
      member_id: that.data.member_id,
      page: page
    }).then(res => {

      wx.hideLoading()
      console.log("首页列表")
      console.log(res)
      if (res.data.code == 200) {


        let infoData = res.data.data
        let wenzData = res.data.data.article

        if (wenzData.length <= 0) {
          wx.showToast({
            title: "没有更多数据啦~~",
            icon: "none"
          })
          return
        }

        let d = that.data.wenzData
        for (var i = 0; i < wenzData.length; i++) {
          d.push(wenzData[i]);
        }
        that.setData({
          wenzData: d,
          infoData
        })
        page++
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  }
})