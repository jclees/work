const app = getApp()
let member_id, page = 1;
Page({
  data: {
    topbarTab: 1,
    ordIdx: 0,
    orderList: [],
    is_uplodicon: true
  },
  jumpProductDetails(e) {
    let pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/shops/shops_detail?shops_id=" + pid
    })
  },
  openJumpPop(e) {
    let that = this,
      pid = e.currentTarget.dataset.id;
    that.setData({
      pop3: !0,
      zhuce: e.currentTarget.dataset.zhuce,
      pid
    })
  },
  jump_parentcard(a) {
    let that = this;
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    that.setData({
      pop3: !0
    })
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab?parent_id=" + this.data.pid
    });
  },
  hideJumpPop() {
    let that = this;
    that.setData({
      pop3: !1
    })
  },
  goChat: function(a) {
    debugger
    let that = this;
    let i = a.currentTarget.dataset.id
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    app.recordChata(wx.getStorageSync("member_id"), i || that.data.pid);
    that.setData({
      pop1: !1
    })
  },
  goMine: function(a) {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/tab/tab?nav_footer_active=" + 3
    });
  },
  card_options: function(a) {
    var t, e, i, d, s, r = this,
      n = a.currentTarget.dataset.target,
      pid = a.currentTarget.dataset.pid;

    switch (a.currentTarget.dataset.option) {
      case "call":
          // 浏览做记录
          app.savaRecord({
            type: 13,
            member_id: member_id,
            be_member_id:pid,
          })
        wx.makePhoneCall({
          phoneNumber: n
        });
        break;
      case "copy":
        s = a.currentTarget.dataset.copy, wx.setClipboardData({
          data: n + "",
          success: function(a) {
            wx.showToast({
              title: "复制成功",
              icon: "success",
              duration: 1e3
            });
          }
        });
        break;
    }
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
  swichtopbarTab(e) {
    let that = this
    if (e.currentTarget.dataset.id == 2) {
      this.setData({
        topbarTab: 1,
        currentTab: 0,
        orderList: [],
        is_uplodicon:true,
      });
      //卖家订单 
      page = 1
      that.getOrder(1, 2)
    } else {
      this.setData({
        topbarTab: 2,
        currentTab: 0,
        orderList: [],
        is_uplodicon: false
      });
      //买家订单 
      page = 1
      that.getOrder(1, 1)
    }

  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  onLoad: function(o) {
    let that = this;
    member_id = wx.getStorageSync('member_id')
    console.log(o)
    o.is_who == 1 ? (that.setData({
      topbarTab: 2,
      is_uplodicon: false
    }), that.getOrder(1, 1)) : (that.getOrder(1, 2))
  },
  onShow() {
    let that = this
    page = 1
  },
  //支付
  payment(e) {
    let that = this,
      oi = e.currentTarget.dataset.oi;
    // debugger
    wx.showLoading({
      title: '加载中...',
    })
    app.util.request({
      url: "/order/buy",
      data: {
        order_id: oi,
      },
      method: "POST",
      success: function(d) {
        // debugger
        console.log("支付")
        console.log(d)
        if (d.data.errno == 0) {
          if (d.data.data.code != 200){
            let data = d.data.data.jssdk
            wx.hideLoading();
            wx.requestPayment({
              'appId': data.appId,
              'timeStamp': data.timestamp,
              'nonceStr': data.nonceStr,
              'package': data.package,
              'signType': data.signType,
              'paySign': data.paySign,
              'success': function (res) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1000
                })
                page = 1
                that.setData({ orderList:[]})
                that.getOrder(1, 1)
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            })
          }else{
            // debugger
            wx.showToast({
              title: "支付成功",
              icon: 'none',
              duration: 1000
            })
            page = 1
            that.setData({ orderList: [] })
            that.getOrder(1, 1)
          }
        } else {
          wx.showToast({
            title: d.data.message,
            icon: 'none',
            duration: 1000
          })
          page = 1
          that.getOrder(1, 1)
        }
      },
      fail: function(res) {
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  copyTBL(e) {
    app.copying(e)
  },
  changePrice(e) {
    let that = this,
      idx = e.currentTarget.dataset.idx;
    // debugger
    that.setData({
      pop1: true,
      ordIdx: idx
    })
  },
  changeInp(e) {
    let that = this,
      val = e.detail.value,
      m = 'orderList[' + that.data.ordIdx + '].money';
    console.log(val)
    that.setData({
      [m]: val
    })
  },
  savaPrice(e) {
    let that = this,
      id = e.currentTarget.dataset.id,
      val = that.data.orderList[that.data.ordIdx].money,
      product_id = that.data.orderList[that.data.ordIdx].product_id,
      parent_id = that.data.orderList[that.data.ordIdx].sell_member_id;

    // debugger
    app.util.request({
      url: "/order/upOrder",
      data: {
        order_id: id,
        alter_money: val,
      },
      method: "POST",
      success: function(a) {
        // debugger
        console.log("修改订单金额")
        console.log(a)
        if (a.data.code == 200) {
          that.getOrder(1, 2)
          wx.showToast({
            title: '修改成功',
            icon: "none"
          })
          that.setData({
            pop1: false,
            orderList:[]
          })
          // 浏览做记录
          app.savaRecord({
            type: 7,
            member_id: member_id,
            be_member_id: parent_id,
            product_id: product_id
          })
        } else {
          wx.showToast({
            title: a.data.msg,
            icon: "none"
          })
        }
      },
      fail: function(a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  getOrder(p, w) { //我的订单
    // debugger
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    app.util.request({
      url: "/order/getorder",
      data: {
        member_id: member_id,
        page: p,
        is_who: w,
      },
      success: function(res) {
        // debugger
        console.log("我的订单")
        console.log(res)
        if (res.data.errno == 0) {
          if (w == 1) {
            let resd = res.data.data.buys
            if (resd.length <= 0) {
              wx.showToast({
                title: "没有更多数据啦~~",
                icon: "none"
              })
              page++
            } else {
              let d = that.data.orderList
              // debugger
              for (var i = 0; i < resd.length; i++) {
                d.push(resd[i]);
              }
              that.setData({
                orderList: d
              })
              page++
            }
          } else {
            let resd = res.data.data.sells
            if (resd.length <= 0) {
              wx.showToast({
                title: "没有更多数据啦~~",
                icon: "none"
              })
              page++
            } else {
              let d = that.data.orderList
              // debugger
              for (var i = 0; i < resd.length; i++) {
                d.push(resd[i]);
              }
              that.setData({
                orderList: d
              })
              page++
            }
          }

          wx.hideLoading()
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
    //订单 
    if (that.data.topbarTab == 2) {
      that.getOrder(page, 1)
    } else {
      that.getOrder(page, 2)
    }
  },
})