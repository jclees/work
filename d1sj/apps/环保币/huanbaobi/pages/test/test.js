const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
let page = 2;
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    isPlayingMusic: true,
    savaStatus: true,
    textVal: '',
    inpPlaceholder: '发表评论',
    wenzData: [],
    page1: [],
    loadend: [],
    showFull: [],
    unData: {
      unlauds: 0,
      unreads: 0,
      uncomment: 0
    },
    isReset: 0 //子页面跳转是否刷新页面
  },

  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
    })
    that.getData()
  },
  onShow() {
    this.audioCtx = wx.createAudioContext('myAudio');
    this.audioCtx.play()
    setTimeout(() => {
      // 未读
      publicMethod.getUnreadNum(this)
    }, 500)


    let that = this
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
    if (that.data.isReset == 1) { //是否刷新页面
      that.setData({
        page1: [],
        showFull: []
      })
      that.getData()
    }
    that.setData({
      isPlayingMusic: true
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
  },
  goOtherCircle(e) { //去别人的发圈
    publicMethod.getFormId(e, this)
    let that = this;
    if (e.currentTarget.dataset.business_id != 0) {
      wx.reLaunch({
        url: '/pages/shop/shop?business_id=' + e.currentTarget.dataset.business_id,
      })
      return
    }
    wx.navigateTo({
      url: '/pages/otherCircle/index?is_who=' + e.currentTarget.dataset.id,
    })
  },
  getwenzhang() { //列表
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/content/personalList', {
      member_id: that.data.member_id,
      page: 1
    }).then(res => {

      wx.hideLoading()
      console.log("环保圈列表")
      console.log(res)
      let wenzData = res.data.contents
      if (wenzData.length <= 0) {
        setTimeout(function() {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
      for (var i = 0; i < wenzData.length; i++) {
        let obj = {}
        that.data.page1.push(1)
        that.data.loadend.push(false)
        obj.leng = wenzData[i].words.length
        obj.status = false
        that.data.showFull.push(obj)
      }

      that.setData({
        showFull: that.data.showFull,
        wenzData
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
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/banner/info', {
      member_id: that.data.member_id,
      type: 3
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
  goChat(e) {
    publicMethod.getFormId(e, this)
    wx.showTabBar()
    this.setData({
      pop3: false,
      popidx: false
    })
    wx.navigateTo({
      url: '/pages/chatDetail/index?be_member_id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
    })
  },
  getFormId(e) { //取formid
    publicMethod.getFormId(e, this)
  },
  guanzhu(e) { //关注
    let that = this;
    let data = that.data.wenzData;
    let idx = e.currentTarget.dataset.idx;

    publicMethod.guanzhu(e, this, function(res) {
      if (res.msg == "已关注") {
        data[idx].is_concern = 1
      } else {
        data[idx].is_concern = 0
      }
      that.setData({
        wenzData: data
      })
    })
  },
  openFun(e) { //打开私信和拨打电话
    publicMethod.openFun(e, this)
  },
  callTel(e) { //打电话
    publicMethod.callTel(e, this)
  },
  openFulltxt(e) { //打开全文
    publicMethod.openFulltxt(e, this)
  },
  previewImage: function(e) { //图片预览
    publicMethod.previewImage(e, this)
  },
  delCircle(e) { //删除图文
    publicMethod.delCircle(e, this)
  },
  loadMore(e) { //加载更多评论
    publicMethod.loadMore(e, this)
  },
  hfComment(e) { //回复评论
    publicMethod.hfComment(e, this)
  },
  openComment(e) { //打开评论弹框
    publicMethod.openComment(e, this)
  },
  bindTextChange(e) { //留言val
    publicMethod.bindTextChange(e, this)
  },
  sendComment(e) { //评论
    publicMethod.sendComment(e, this)
  },
  like(e) { //点赞
    publicMethod.like(e, this)
  },
  swiperChange: function(e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onMusicTap: function(event) { //背景音乐
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
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function(event) { // 初始化弹框
    wx.showTabBar()
    this.setData({
      textVal: '',
      inpPlaceholder: '发表评论'
    })
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
    console.log(res)
    let url = 'pages/circle/circle';
    if (res.from === 'button') {
      let shareTxt = res.target.dataset.sharetxt;
      return {
        title: '青山派 ' + shareTxt,
        path: url,
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '青山派 正在发生…',
      imageUrl: '',
      path: url,
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
    that.setData({
      page1: [],
      showFull: [],
      loadend: []
    })
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
    common.get('/content/personalList', {
      member_id: that.data.member_id,
      page: page
    }).then(res => {

      wx.hideLoading()
      console.log("环保圈列表")
      console.log(res)
      if (res.data.code == 200) {

        let wenzData = res.data.contents

        let d = that.data.wenzData
        for (var i = 0; i < wenzData.length; i++) {
          d.push(wenzData[i]);
          that.data.page1.push(1)

          let obj = {}
          obj.leng = wenzData[i].words.length
          obj.status = false
          that.data.showFull.push(obj)
          that.data.loadend.push(false)
        }


        that.setData({
          loadend: that.data.loadend,
          showFull: that.data.showFull,
          wenzData: d,
        })
        page++
      } else if (res.data.code == 206) {
        wx.showToast({
          title: "没有更多数据啦~~",
          icon: "none"
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