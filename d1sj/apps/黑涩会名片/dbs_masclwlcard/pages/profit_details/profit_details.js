const app = getApp()
let member_id = 0,
  page = 1;
Page({
  data: {
    moneylogData: []
  },
  onLoad: function(s) {
    member_id = wx.getStorageSync('member_id')
    this.getData(page)
  },
  onHide(){
    page = 1
  },
  onUnload(){
    page =1
  },
  getData(p) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    app.util.request({
      url: "/index/moneylog",
      data: {
        member_id: member_id,
        page: p
      },
      success: function(res) {
        //  debugger
        console.log("收益记录")
        console.log(res)
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // debugger
        if (res.data.errno == 0) {
          // debugger
          let resd = res.data.data.lists
          if (resd.length <= 0) {
            wx.showToast({
              title: "没有更多数据啦~~",
              icon: "none"
            })
            page++
          } else {
            let d = that.data.moneylogData
            for (var i = 0; i < resd.length; i++) {
              d.push(resd[i]);
            }
            that.setData({
              moneylogData: d
            })
            page++
          }
        }

      },
      fail: function(res) {
        debugger
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  onPullDownRefresh: function () {
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