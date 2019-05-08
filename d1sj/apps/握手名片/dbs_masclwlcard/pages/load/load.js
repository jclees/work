var app = getApp();
let member_id,page=1;
Page({
  data: {
    openOptions: [],
    newSdk: [],
    dataLoaded: !1,
    friend_list: [],
    cardList: [],
    test_cardList: [{
      card_id: 5,
      card_logo: "https://icard.weixingzpt.com/images/api/o18vt0AcryURWAqtyVCVJIzAIu1c/card_logo_1542076896.png",
      card_name: "夏恒",
      card_tel: "13520835125",
      company_name: "北京第一时间网络科技有限公司",
      email: "262476621@qq.com",
      role_name: "CEO"
    }, {
        card_id: 7,
        card_logo: "https://icard.weixingzpt.com/images/api/o18vt0DCGxK6O_uBcFTnVGB3WauU/card_logo_1541403820.png",
        card_name: "樊林刚",
        card_tel: "13021284549",
        company_name: "北京第一时间网络科技有限公司",
        email: "346415436@qq.com",
        role_name: "合伙人"
      }],
    allCompanyDetail: {}
  },
  onLoad: function(a) {
    member_id = wx.getStorageSync("member_id")
    this.getCardList(1)
  },
  getCardList(p) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    app.util.request({
      url: "/index/myCollects",
      data: {
        member_id: member_id,
        page:p
      },
      success: function(res) {
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // debugger
        console.log("名片列表")
        console.log(res)
        // debugger
        if (res.data.errno == 0) {
          // debugger
          let resd = res.data.data.list
          if (resd.length <= 0) {
            wx.showToast({
              title: "没有更多数据啦~~",
              icon: "none"
            })
            page++
          } else {
            // debugger
            let d = that.data.cardList
            for (var i = 0; i < resd.length; i++) {
              d.push(resd[i]);
            }
            that.setData({
              cardList: d
            })
            page++
          }
        }
      },
      fail: function(a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  send_form: function(a) {
    var i = a.currentTarget.dataset.card_id;
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab?parent_id=" + i
    });
  },
  onReady: function() {},
  onShow: function() {page = 1},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showNavigationBarLoading();
    //获取绘本
    // page++;
    that.getCardList(page)
  }
});