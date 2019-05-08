const app = getApp()
let member_id = 0,
  page = 1,
  u, t = 666;
Page({
  data: {
    xingWList: []
  },
  onLoad: function(options) {
    debugger
    let that = this;
    member_id = wx.getStorageSync("member_id")
    if (!options.c) return;
    options.t && (t = options.t);
    if (options.c == 0) {
      u = '/action/yesterdayShow'
    } else if (options.c == 1) {
      u = '/action/sevenShow'
    } else if (options.c == 2) {
      u = '/action/monthShow'
    } else if (options.c == 3) {
      u = '/action/allShow'
    } else if (options.c == 666) {
      u = '/action/radar'
      wx.setNavigationBarTitle({
        title: '行为'
      })
     
    }
  },
  onShow() {
    let that = this
    that.setData({
      xingWList: []
    })
    that.getData()
  },
  onHide() {
    page = 1
  },
  onUnload() {
    page = 1
  },
  openJumpPop(e) {
    let that = this,
      pid = e.currentTarget.dataset.id;
    that.setData({
      pop1: !0,
      zhuce: e.currentTarget.dataset.zhuce,
      pid
    })
  },
  jump_parentcard(a) {
    let that = this;
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    that.setData({
      pop1: !0
    })
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab?parent_id=" + this.data.pid
    });
  },
  hideJumpPop() {
    let that = this;
    that.setData({
      pop1: !1
    })
  },
  goChat: function(a) {
    let that = this;
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    app.recordChata(wx.getStorageSync("member_id"), that.data.pid);
    that.setData({
      pop1: !1
    })
  },
  getData() { //初始化数据
    wx.showLoading({
      title: '加载中...',
    })
    // debugger
    let that = this
    console.log({
      member_id: member_id,
      type: t,
      page: page
    })
    app.util.request({
      url: u,
      data: {
        member_id: member_id,
        type: t,
        page: page
      },
      success: function(res) {
        // debugger
        console.log("行为")
        console.log(res)

        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // debugger
        if (res.data.code == 200) {
          // debugger
          let resd = res.data.data
          if (resd.length <= 0) {
            wx.showToast({
              title: "没有更多数据啦~~",
              icon: "none"
            })
            page++
          } else {
            let d = that.data.xingWList
            for (var i = 0; i < resd.length; i++) {
              d.push(resd[i]);
            }
            that.setData({
              xingWList: d
            })
            page++
          }
        } else if (res.data.code == 403) {
          wx.showToast({
            title: "没有更多数据啦~~",
            icon: "none"
          })
          page++
        }
      },
      fail: function(a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.showNavigationBarLoading();
    //获取绘本
    // page++;
    that.getData(page)
  }
})