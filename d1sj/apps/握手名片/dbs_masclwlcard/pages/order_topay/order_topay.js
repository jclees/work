var app = getApp(),
  member_id, user_flag,parent_id;

Page({
  data: {
    src: "",
    dataLoaded: !1,
    NeddPay: !0,
    savaStatus:!0,
    hasAddress: !1,
    isFirstLoad: !0,
    detail: [],
    userName: "",
    telNumber: "",
    address: ""
  },
  onLoad: function(a) {
    let that = this
    member_id = wx.getStorageSync("member_id")
    user_flag = wx.getStorageSync("user_flag")
    parent_id = wx.getStorageSync("parent_id")
    a.price = a.o_price
    
    // a.total_price = parseFloat(a.o_price * a.shops_num)
    a.total_price = (Number(a.o_price) * Number(a.shops_num)).toFixed(2)
    console.log(a.total_price)
    this.setData({
      detail: a,
      parent_id: parent_id
    });
    if (user_flag == 1) {
      // 浏览做记录
      app.savaRecord({
        type: 10,
        member_id: member_id,
        be_member_id: parent_id,
        product_id: that.data.detail.shops_id,
      })
    }
  },
  addaddress: function() {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/myAddr/my_address/index?settings=true"
    });
  },
  onShow: function() {
    var a = this.data.detail;
    if (this.data.isFirstLoad) this.data.isFirstLoad = !1, this.get_address();
    else if (app.globalData.addres) {
      var e = (a = app.globalData.addres).telNumber,
        t = a.userName,
        i = app.globalData.addres.address_id,
        d = a.address;
      this.data.hasAddress = "" != e && "" != t && "" != d, this.setData({
        telNumber: e,
        userName: t,
        address: d,
        hasAddress: this.data.hasAddress,
        address_id: i
      });
    }
    e = this;
  },
  //支付
  payment(e) {
    let that = this
    if (!that.data.savaStatus) return false;
    that.setData({
      savaStatus: !1
    })
    if (user_flag == 1) {
      // 浏览做记录
      app.savaRecord({
        type: 14,
        member_id: member_id,
        be_member_id: parent_id,
        product_id: that.data.detail.shops_id,
      })
    }
    if (!that.data.address_id){
      wx.showToast({
        title: "请填写收货地址",
        icon: "none",
      });
      return false
    }
    wx.showLoading({
      title: '加载中...',
    })
    console.log({
      member_id: member_id,
      product_id: that.data.detail.shops_id,
      price: that.data.detail.o_price,
      address_id: that.data.address_id,
      number: that.data.detail.shops_num,
    })
    app.util.request({
      url: "/order/buy",
      data: {
        member_id: member_id,
        product_id: that.data.detail.shops_id,
        price: that.data.detail.o_price,
        address_id: that.data.address_id,
        number: that.data.detail.shops_num,
      },
      method: "POST",
      success: function (d) {
        // debugger
        console.log("支付")
        console.log(d)
        if (d.data.errno == 0) {
          if (!d.data.data.code){
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
                wx.redirectTo({
                  url: "/dbs_masclwlcard/pages/myOrder/myOrder?is_who=1"
                });
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 1000
                })
                wx.redirectTo({
                  url: "/dbs_masclwlcard/pages/myOrder/myOrder?is_who=1"
                });
              }
            })
          }else{
            wx.redirectTo({
              url: "/dbs_masclwlcard/pages/myOrder/myOrder?is_who=1"
            });
          }
        } else {
          wx.showToast({
            title: d.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        console.log("数据错误");
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  get_address: function() {
    var t = this;
    app.util.request({
      url: "/address/getaddress",
      data: {
        member_id: member_id
      },
      success: function(s) {
        console.log("收货地址列表")
        console.log(s)
        if (s.data.code == 1001 && s.data.data[0].default_address == 1) {
          let d = s.data.data[0]
          t.setData({
            address_id: d.id,
            userName: d.contact_name,
            telNumber: d.contact_phone,
            address: d.province + d.city + d.district + d.address,
            hasAddress: !0,
            dataLoaded: !0
          });
        }
      },
      fail: function(s) {
        console.log("this is a test2");
      }
    });

    // var a = app.siteInfo.uniacid, r = this;
    // app.util.request({
    //     url: "entry/wxapp/default_address",
    //     data: {
    //         m: "dbs_masclwlcard",
    //         uniacid: a
    //     },
    //     success: function(a) {
    //         if (0 == a.data.error && a.data.data) {
    //             var e = a.data.data, t = e.userName, d = e.telNumber, s = e.provinceName + e.cityName + e.countyName + e.detailInfo;
    //             "" != t && "" != d && "" != s && (r.data.hasAddress = !0), r.setData({
    //                 userName: t,
    //                 telNumber: d,
    //                 address: s,
    //                 hasAddress: r.data.hasAddress,
    //                 dataLoaded: !0
    //             });
    //         } else r.setData({
    //             dataLoaded: !0
    //         });
    //     },
    //     fail: function(a) {
    //         console.log("this is a test2");
    //     }
    // });
  },
  to_pay: function() {
    var a = app.siteInfo.uniacid,
      t = this,
      e = this;
    app.util.request({
      url: "entry/wxapp/shops_topay",
      data: {
        m: "dbs_masclwlcard",
        uniacid: a,
        phone: e.data.telNumber,
        name: e.data.userName,
        address: e.data.address,
        card_id: e.data.detail.card_id,
        shops_id: e.data.detail.shops_id,
        shops_num: e.data.detail.shops_num,
        new_spec: e.data.detail.new_spec
      },
      success: function(e) {
        0 == e.data.data.error ? wx.requestPayment({
          timeStamp: e.data.data.timeStamp,
          nonceStr: e.data.data.nonceStr,
          package: e.data.data.package,
          signType: "MD5",
          paySign: e.data.data.paySign,
          success: function(a) {
            t.pay_complete(e.data.data.orderid);
          },
          fail: function(a) {}
        }) : wx.showToast({
          title: e.data.data.message,
          icon: "none",
          mask: !0
        });
      },
      fail: function(a) {
        console.log("this is a test2");
      }
    });
  },
  pay_complete: function(a) {
    var e = this.data,
      t = e.detail.price,
      d = e.userName,
      s = e.address,
      r = e.telNumber;
    app.globalData.order_complete = {
      orderNo: a,
      price: t,
      userName: d,
      address: s,
      card_id: e.detail.card_id,
      telNumber: r
    }, wx.redirectTo({
      url: "/dbs_masclwlcard/pages/order_complete/order_complete"
    });
  }
});