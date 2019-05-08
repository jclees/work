var app = getApp(),
  share_id = 0,
  member_id = 0,
  user_flag,
  parent_id;

Page({
  data: {
    src: "",
    dataLoaded: !1,
    showUser: !1,
    shops: [],
    card: [],
    toPay: !1,
    new_spec: "",
    M_price: 0,
    isAuthorize: !1,
    shops_spec: [],
    selected_num: 1,
    top: -300
  },
  showShopPoster() {
    this.setData({
      shopMask: !0,
      showChoose: !0
    });
  },
  showposter: function() {
    let url;
    console.log(this.data.shops.share_img.length)
    if (this.data.shops.share_img.length > 0) {
      debugger
      url = "/dbs_masclwlcard/pages/poster/index?isStatus=" + 2 + "&pid=" + this.data.shops_id, this.setData({
        shopMask: !1,
        showChoose: !1
      })
    } else {
      if (user_flag == 1) {
        wx.showModal({
          title: '提示',
          content: '您好友的产品未上传海报图片，无法分享朋友圈，快去提醒下吧',
          showCancel: false,
          confirmText: "好的"
        });
        return false
      }
      url = "/dbs_masclwlcard/pages/create_product/create_product?product_id=" + this.data.shops_id + "&is_nullposter=true"
    }
    wx.navigateTo({
      url: url
    })
  },
  hideShopMask: function() {
    this.setData({
      shopMask: !1
    });
  },
  onLoad: function(a) {
    console.log(a)
    let that = this;
    if (a.scene) { //小程序码参数解码
      let scene = decodeURIComponent(a.scene);
      let scene_parent_id = scene.split("&")[0];
      let scene_shops_id = scene.split("&")[1];
      a.parent_id = scene_parent_id.split("=")[1]
      a.shops_id = scene_shops_id.split("=")[1];
    }

    if (a.parent_id && a.shops_id) {
      user_flag = 1
      parent_id = a.parent_id
    } else {
      user_flag = wx.getStorageSync("user_flag")
      parent_id = wx.getStorageSync("parent_id")
    }
    member_id = wx.getStorageSync("member_id")
    that.setData({
      shops_id: a.shops_id,
      user_flag
    })
    if (user_flag == 1) {
      that.getShare()
      let seeProdNum = 0
      let seeProdTime = setInterval(function() {
        seeProdNum++
        if (seeProdNum >= 10) {
          console.log("浏览了10秒 准备发模板消息")
          // 浏览做记录
          app.savaRecord({
            type: 1,
            member_id: member_id,
            be_member_id: parent_id,
            product_id: that.data.shops_id
          })
          clearInterval(seeProdTime);
        }
      }, 1000)
      that.setData({
        s_time: seeProdTime,
        parent_id: parent_id
      })
    } else {
      that.setData({
        parent_id: member_id,
      })
    }
  },
  onShow() {
    this.getData(this.data.shops_id)
  },
  onUnload() {
    clearInterval(this.data.s_time);
  },
  getShare: function () {
    // debugger
    s.util.request({
      url: "/index/share",
      data: {
        parent_id: parent_id,
        member_id: member_id
      },
      method: "POST",
      success: function (t) {
        console.log("分享"), console.log(t);
      },
      fail: function (t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  getData(id) {
    let that = this
    app.util.request({
      url: "/proView",
      data: {
        product_id: id
      },
      success: function(res) {
        // debugger
        console.log("商品详情")
        console.log(res)
        that.setData({
          share_link: res.data.products.share_link || '',
          shops: res.data.products
        })
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
  to_pay: function(a) {
    if (!member_id) {
      this.setData({
        isAuthorize: !0
      })
      return false
    }
    this.data.share_link ? wx.navigateTo({
      url: "/dbs_masclwlcard/pages/webview/webview?url=" + this.data.share_link,
    }) : this.setData({
      toPay: !0
    });
  },
  to_detail_pay: function(a) {
    this.setData({
      toPay: !1
    }), wx.navigateTo({
      url: "/dbs_masclwlcard/pages/order_topay/order_topay?price=" + this.data.M_price + "&shops_num=" + this.data.selected_num + "&shop_name=" + this.data.shops.cate_name + "&o_price=" + this.data.shops.price + "&new_spec=" + this.data.new_spec + "&card_id=" + this.data.card.id + "&shops_id=" + this.data.shops.id
    });
  },
  close_pay: function() {
    this.setData({
      toPay: !1
    });
  },
  reduce: function() {
    var a = this.data.selected_num,
      t = a <= 1 ? 1 : a - 1,
      s = this.data.shops.price * t;
    this.setData({
      M_price: s,
      selected_num: t
    });
  },
  plus: function(a) {
    var t = this.data.selected_num,
      s = this.data.shops.shops_num,
      e = 0 < s && s <= t ? s : t + 1,
      d = this.data.shops.price * e;
    this.setData({
      M_price: d,
      selected_num: e
    });
  },
  spec: function(a) {
    var t = a.currentTarget.dataset.index,
      s = this.data.shops.spec.new_spec;
    s.forEach(function(a) {
      a.selected = !1;
    }), s[t].selected = !0, this.setData({
      "shops.spec.new_spec": s,
      new_spec: s[t].spec_content
    });
  },
  lookimg: function(a) {
    var t = a.currentTarget.dataset.img;
    wx.previewImage({
      current: t,
      urls: [t]
    });
  },
  from_send: function(a) {},
  goChat: function(a) {
    if (!member_id) {
      this.setData({
        isAuthorize: !0
      })
      return false
    }
    let i = user_flag == 1 && parent_id || member_id
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    app.recordChata(wx.getStorageSync("member_id"), i);
  },
  goShops: function(a) {
    wx.navigateBack({
      delta: 1
    })
  },
  to_car: function(a) {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + this.data.card.id
    });
  },
  onShareAppMessage: function() {
    this.setData({
      shopMask: !1,
      showChoose: !1
    })
    var a = this;
    return {
      title: a.data.shops.title,
      imageUrl: '',
      path: "/dbs_masclwlcard/pages/shops/shops_detail?shops_id=" + a.data.shops_id + "&parent_id=" + (user_flag == 1 ? parent_id : member_id)
    };
  },
  bindgetuserinfoHandler: function(t) {
    var e = this;
    t = this;
    app.util.getUserInfo(function(a) {
      member_id = a.data.data.member_id
      user_flag = 1
      a && a.data.data.member_id && (e.setData({
        isAuthorize: !1
      }));
      // e.goChat()
    });
  }
});