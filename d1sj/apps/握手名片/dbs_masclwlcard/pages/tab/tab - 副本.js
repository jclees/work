function t(t, a, e) {
  return a in t ? Object.defineProperty(t, a, {
    value: e,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[a] = e, t;
}
var a,
  e, //user_flag
  o, //parent_id
  n, //member_id
  s = getApp(),
  i = require("../../config/card.config.js"),
  r = !1,//授权状态
  c = !1,//注册状态
  custom_page = 1;

Page((a = {
  data: {
    netWorkData: {},
    cates: [],
    is_like: 0,
    currentTab: 0,
    index: 0,
    dataLoaded: !0,
    currentIndex: "",
    actList: [],
    showKeyboard: 0,
    msgInfo: {},
    msgNum: 0,
    M: 0,
    isPopCard: !0,
    hasMobile: 0,
    showCardInfo: !1,
    isDoPullMsg: !1,
    is_hmd: !1,
    GetCustomMobile: 0,
    openOptions: [],
    cardStatus: !1,
    card_allmembr: [],
    loadFlag: false,
    containerHeight: 0,
    shops: {
      list: [],
      pro_no_more: !1,
      showLoad: !0,
      left_list: [],
      right_list: []
    },
    newSdk: [],
    friend_list: [],
    userInfo: [],
    card_detail: [],
    dynamic_list: [],
    offline: 0,
    main: {
      show_sm_box: !1,
      compandy_addr: "",
      color: "rgba(255,255,255,0.8)",
      select_color: "#fff",
      card_id: "",
      auto_play: !1,
      main: null,
      display_top_img: !0
    },
    nav_footer_active: 0,
    nav_footer: i.green.footernav.product.nav_footer,
    footer_nav: i.green.footernav.product.footer_nav,
    open_card_detail: 0,
    allCompanyDetail: {}
  },
  radioChange: function(t) {
    this.setData({
      vipid: t.detail.value
    });
  },
  popLock: function(t) {
    s.popLock(t.currentTarget.dataset.id), this.setData({
      pop1: s.globalData.pop1,
      pop2: s.globalData.pop2,
      pop3: s.globalData.pop3,
      pop4: s.globalData.pop4
    });
  },
  myCatchTouch: function() {},
  jump_mycard: function() {
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab"
    });
  },
  jump_url: function(t) {
    var a = t.currentTarget.dataset.url;
    wx.navigateTo({
      url: a
    });
  },
  jumpCreateCard: function() {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/create_card2/create_card"
    });
  },
  onLoad: function(t) {
    // debugger
    this.setContainerHeight();
    if (console.log(t), t.scene) {
      var a = decodeURIComponent(t.scene).split("&")[0];
      t.parent_id = a.split("=")[1];
    }
    var r = void 0,
      c = this;
    if (wx.getSystemInfo({
        success: function(t) {
          r = t.windowHeight, c.setData({
            M: r
          });
        }
      }), t.nav_footer_active && (c.setData({
        nav_footer_active: t.nav_footer_active
      }), wx.setNavigationBarTitle({
        title: i.green.footernav.product.footer_nav[t.nav_footer_active]
      })), (n = wx.getStorageSync("member_id")) && t.parent_id) n == t.parent_id ? (e = 0,
      wx.setStorageSync("user_flag", 0), c.setData({
        isPopCard: !1,
        user_flag: e
      })) : (e = 1, o = t.parent_id, wx.setStorageSync("parent_id", t.parent_id), wx.setStorageSync("user_flag", 1), c.setData({
      user_flag: e,
      isPopCard: !1
    }), s.savaRecord({
      type: 4,
      member_id: n,
      be_member_id: o
    }));
    else {
      if (!n && !t.parent_id) return e = 0, wx.setStorageSync("user_flag", 0), c.setData({
        isPopCard: !0,
        user_flag: e
      }), wx.redirectTo({
        url: "/dbs_masclwlcard/pages/create_card2/create_card"
      }), !1;
      if (!n && t.parent_id) return e = 1, o = t.parent_id, s.savaRecord({
          type: 4,
          member_id: n,
          be_member_id: o
        }), wx.setStorageSync("parent_id", t.parent_id),
        wx.setStorageSync("user_flag", 1), c.setData({
          isPopCard: !1,
          user_flag: e
        }), !1;
      e = 0, wx.setStorageSync("user_flag", 0), c.setData({
        isPopCard: !1,
        user_flag: e
      });
    }
  },
  onReady: function() {},
  getData: function() {
    wx.showLoading({
      title: "加载中..."
    });
    var t = this;
    t.data.nav_footer_active;
    t.getCard();
    t.getCollectStatus();
    t.getCustomlists();
    t.getProducts({
      cate_id: 0,
      member_id: 0 == e ? n : o
    });
    t.getCate();
    t.getShops();
    t.getNetwork();
    t.getDynamic();
    t.getVips();
    n && (
      t.is_create_card(n),
      t.getLikeStatus(),
      t.getEarning()
    );
  },
  payment: function(t) {
    wx.showLoading({
      title: "加载中..."
    });
    var a = this;
    s.util.request({
      url: "/viprecharge/recharge",
      data: {
        member_id: n,
        vip_id: a.data.vipid
      },
      method: "POST",
      success: function(t) {
        if (console.log("支付"), console.log(t), 0 == t.data.errno) {
          var i = t.data.data.jssdk;
          wx.hideLoading(), wx.requestPayment({
            appId: i.appId,
            timeStamp: i.timestamp,
            nonceStr: i.nonceStr,
            package: i.package,
            signType: i.signType,
            paySign: i.paySign,
            success: function(t) {
              1 == e && s.savaRecord({
                type: 12,
                member_id: n,
                be_member_id: o
              }), wx.showToast({
                title: "支付成功",
                icon: "success",
                duration: 1e3
              }), a.setData({
                pop1: !1
              }), a.vipGard();
            },
            fail: function(t) {
              wx.showToast({
                title: "支付失败",
                icon: "none",
                duration: 1e3
              });
            }
          });
        }
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getNoReadMsg: function() {
    var t = this;
    s.util.request({
      url: "/chat/getNoReadMsg",
      data: {
        member_id: n
      },
      success: function(a) {
        0 == a.data.errno && t.setData({
          noReadMsgData: a.data.data
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getShops: function() {
    var t = this;
    s.util.request({
      url: "/mallconf/getConf",
      data: {
        member_id: 0 == e ? n : o
      },
      success: function(a) {
        console.log("商城信息详情"), console.log(a), 200 == a.data.code && t.setData({
          shops2: a.data.config
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  getEarning: function() {
    var t = this;
    s.util.request({
      url: "/withdraw/earning",
      data: {
        member_id: n
      },
      success: function(a) {
        console.log("收益余额"), console.log(a), t.setData({
          earning: a.data.data.earning
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  tXianPop: function() {
    this.getEarning(), this.setData({
      pop2: !0
    });
  },
  buyVipPop: function() {
    this.getVips(), this.setData({
      pop1: !0
    });
  },
  tXian: function(t) {
    wx.showLoading({
      title: "加载中..."
    });
    var a = this;
    s.util.request({
      url: "/withdraw/withdraw",
      data: {
        member_id: n
      },
      method: "POST",
      success: function(t) {
        console.log("提现"), console.log(t), 0 == t.data.errno ? (wx.hideLoading(), wx.showToast({
          title: t.data.message,
          icon: "success",
          duration: 1e3
        }), a.getEarning()) : wx.showToast({
          title: t.data.message,
          icon: "none",
          duration: 1e3
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getVips: function() {
    var t = this;
    s.util.request({
      url: "/viprecharge/getvips",
      data: {},
      success: function(a) {
        console.log("会员套餐列表"), console.log(a);
        var e = a.data.data.lists;
        e[0].checked = "true", t.setData({
          vipLists: e,
          vipid: e[0].id
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getCard: function() {
    var t = this;
    s.util.request({
      url: "/index/cardInfo",
      data: {
        member_id: 0 == e ? n : o
      },
      success: function(a) {
        console.log("名片详情");
        console.log(a);
        null != a.data.data.card_tel ? (
          wx.hideLoading(),
          (a.data.data.parent_id != null && e == 1 && n) && t.getShare(),
          t.setData({
            card_detail: a.data.data
          })
        ) : e == 0 && wx.reLaunch({
          url: "/dbs_masclwlcard/pages/create_card2/create_card"
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  getCard2: function() {
    var t = this;
    t.getGrade(), s.util.request({
      url: "/index/cardInfo",
      data: {
        member_id: n
      },
      success: function(a) {
        console.log("自己的名片"), 
        console.log(a), 
        null != a.data.data.card_tel ? (
          t.setData({
            card_detail2: a.data.data
            }), 
            wx.setStorageSync("memberInfo", a.data.data)
        ) : e == 0 && wx.reLaunch({
          url: "/dbs_masclwlcard/pages/create_card2/create_card"
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getGrade: function() {
    var t = this;
    s.util.request({
      url: "/index/center",
      data: {
        member_id: n
      },
      success: function(a) {
        console.log("等级"), console.log(a), 0 == a.data.errno && t.setData({
          vipGard: a.data.data
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getDynamic: function() {
    var t = this;
    s.util.request({
      url: "/network/dynamic",
      data: {
        member_id: 0 == e ? n : o
      },
      success: function(a) {
        console.log("展示最新的三条动态"), console.log(a), 200 == a.data.code && t.setData({
          news: a.data.data
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getNetwork: function() {
    var t = this;
    s.util.request({
      url: "/network/index",
      data: {
        member_id: 0 == e ? n : o
      },
      success: function(a) {
        console.log("官网"), console.log(a), t.setData({
          netWorkData: a.data.data
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  jump_parentcard(a) {
    s.util.getFormId(wx.getStorageSync("member_id"), a);
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab?parent_id=" + o
    });
  },
  openJumpPop(e) {
    let that = this,
      w = e.currentTarget.dataset.w;
    o = that.data.card_allmembr[w].customer_id
    // debugger
    that.setData({
      pop5: !0,
      zhuce: e.currentTarget.dataset.zhuce
    })
  },
  hideJumpPop() {
    let that = this;
    that.setData({
      pop5: !1
    })
  },
  setContainerHeight() {
    const systemInfo = wx.getSystemInfoSync();
    this.data.containerHeight = systemInfo.windowHeight - 50;
  },
  loadMoreCustom(e) {
    console.log(e);
    let that = this;
    that.setData({
      coolLoading: true
    });
    setTimeout(function() {
      that.getCustomlists(custom_page)
    }, 1000);
  },
  getCustomlists: function(p) {
    var that = this;
    /*下面是对设置的开关的处理*/
    if (that.data.loadFlag) {
      that.setData({
        loadFlag: true
      })
      return;
    }
    that.setData({
      loadFlag: true
    })
    s.util.request({
      url: "/index/customlists",
      data: {
        // member_id: 5,
        member_id: 0 == e ? n : o,
        page: p
      },
      success: function(res) {
        console.log("获取浏览用户头像")
        console.log(res)
        if (res.data.errno == 0) {
          let resd = res.data.data.lists
          if (resd.length <= 0) {
            that.setData({
              coolLoading: false,
              loadFlag: false,
              allDataing: true
            })
            custom_page++
          } else {
            let d = that.data.card_allmembr
            // debugger
            for (var i = 0; i < resd.length; i++) {
              d.push(resd[i]);
            }
            that.setData({
              card_allmembr: d,
              card_allmembr_total: res.data.data.total,
              coolLoading: false,
              loadFlag: false
            })
            custom_page++
          }
        }
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getCollectStatus: function() {
    var t = this;
    s.util.request({
      url: "/index/is_collect",
      data: {
        member_id: n,
        card_id: o
      },
      success: function(a) {
        console.log("收藏名片的状态"), console.log(a), 0 == a.data.errno && t.setData({
          is_collect: a.data.data.status
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getLikeStatus: function() {
    var t = this;
    s.util.request({
      url: "/index/getLikeStatus",
      data: {
        member_id: n,
        card_id: 0 == e ? n : o
      },
      success: function(a) {
        console.log("获取点赞状态"), console.log(a), t.setData({
          is_like: a.data.data.is_like
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  like: function() {
    var t = this;
    // if (!r && !c) return t.setData({
    //   isAuthorize: !0
    // }), !1;
    if (!r){
      t.setData({
        isAuthorize: !0
      })
      return
    }
    if(!c){
      wx.redirectTo({
        url: "/dbs_masclwlcard/pages/create_card2/create_card"
      })
    }
    s.util.request({
      url: "/index/like",
      data: {
        member_id: n,
        card_id: 0 == e ? n : o
      },
      method: "POST",
      success: function(a) {
        console.log("点赞/取消点赞"), console.log(a), t.getLikeStatus(), t.getCard();
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  getCate: function(t) {
    var a = this;
    s.util.request({
      url: "/cateShow",
      data: {
        member_id: 0 == e ? n : o
      },
      success: function(t) {
        console.log("分类"), console.log(t);
        var e = {};
        e.id = 0, e.name = "全部", t.data.cates.unshift(e), a.setData({
          cates: t.data.cates
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  navbarTap: function(t) {
    var a = this,
      s = t.currentTarget.dataset.typeid;
    wx.showLoading({
      title: "加载中..."
    }), a.setData({
      currentTab: t.currentTarget.dataset.idx
    }), a.getProducts({
      cate_id: s,
      member_id: 0 == e ? n : o
    });
  },
  getProducts: function(t) {
    var a = this;
    s.util.request({
      url: "/proIndex",
      data: t,
      success: function(t) {
        wx.hideLoading(), console.log("产品列表"), console.log(t), a.setData({
          shops: t.data.index
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  collectCard: function(t, a) {
    // debugger
    var i = this;
    if (!r && !c && !n) return i.setData({
      isAuthorize: !0
    }), !1;
    s.util.request({
      url: "/index/collectCard",
      data: {
        member_id: n,
        card_id: o
      },
      method: "POST",
      success: function(t) {
        console.log("收藏成功"), console.log(t), t.data.errno == 0 && (i.parentCollectCard()), a || (1 != t.data.data.status ? (wx.showToast({
          title: "收藏成功",
          icon: "none"
        }), i.setData({
          is_collect: 1
        }), 1 == e && s.savaRecord({
          type: 8,
          member_id: n,
          be_member_id: o
        })) : wx.navigateTo({
          url: "/dbs_masclwlcard/pages/load/load"
        }));
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  parentCollectCard() {
    console.log(o, n)
    var i = this;
    s.util.request({
      url: "/index/collectCard",
      data: {
        member_id: o,
        card_id: n
      },
      method: "POST",
      success: function(t) {
        // debugger
        console.log("对方收藏成功"), console.log(t)
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t)
      }
    });
  },
  getShare: function() {
    // debugger
    s.util.request({
      url: "/index/share",
      data: {
        parent_id: o,
        member_id: n
      },
      method: "POST",
      success: function(t) {
        console.log("分享"), console.log(t);
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  bindgetuserinfoHandler: function(t) {
    if (!c) {
      wx.redirectTo({
        url: "/dbs_masclwlcard/pages/create_card2/create_card"
      })
    }
    var a = this;
    s.util.getUserInfo(function(t) {
      r = !0;
      t && t.data.data.member_id && (
        n = t.data.data.member_id,
        e == 1 && (
          a.is_create_card(n),
          s.savaRecord({
            type: 4,
            member_id: n,
            be_member_id: o
          }),
          a.getShare()
        ),
        a.setData({
          isAuthorize: !1,
          card_allmembr: []
        }),
        a.getData(),
        a.getCard2()
      );
    });
  },
  is_create_card: function(t) {
    var a = this;
    s.util.request({
      url: "/index/is_create_card",
      data: {
        member_id: t
      },
      success: function(t) {
        console.log("判断是否注册");
        console.log(t);
        0 == t.data.errno && (
          1 == t.data.data.status ? (
            1 == e && a.collectCard(1, !0),
            a.setData({
              is_nullmember_id: !1
            }),
            c = !0
          ) : (
            a.setData({
              is_nullmember_id: !0
            }),
            c = !1
          )
        );
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  record: function(t) {
    var a = this;
    console.log(n), s.util.request({
      url: "entry/wxapp/offline",
      data: {
        m: "dbs_masclwlcard",
        uniacid: s.siteInfo.uniacid,
        card_id: t,
        member_id: n
      },
      success: function(t) {
        if (t.data.data) {
          var e = t.data.data;
          e && 0 < e ? a.setData({
            msgStatus: 1,
            offline: e
          }) : a.setData({
            offline: 0,
            msgStatus: 0
          });
        }
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  goChat: function(t) {
    s.util.getFormId(wx.getStorageSync("member_id"), t);
    debugger
    var a = this,
      e = t.currentTarget.dataset.pid;
    if (!r && !c) return a.setData({
      isAuthorize: !0
    }), !1;
    void 0 == e && (e = o), wx.navigateTo({
      url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?parent_id=" + e
    })

    //  s.util.request({
    //   url: "/chat/userInto",
    //   data: {
    //     parent_id: o,
    //     member_id: n
    //   },
    //   method: "POST",
    //   success: function(t) {
    //     console.log("聊天室 通知发送模板消息"), console.log(t), wx.navigateTo({
    //       url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?parent_id=" + e
    //     });
    //     a.setData({
    //       pop4: !1,
    //       pop5: !1
    //     })
    //   },
    //   fail: function(t) {
    //     console.log("数据错误"), console.log(t);
    //   }
    // });
  },
  showComments: function(t) {
    var a = this.data.currentIndex,
      e = t.currentTarget.dataset.index;
    a === e && (e = ""), this.setData({
      currentIndex: e
    });
  },
  bindKeyBlur: function() {
    this.setData({
      showKeyboard: 0
    });
  },
  bindKeyInput: function(t) {
    this.setData({
      content: t.detail.value
    });
  },
  _showKeyboard: function(t) {
    var a = t.currentTarget.dataset.id;
    this.setData({
      showKeyboard: 1,
      currentIndex: "",
      postid: a
    });
  },
  _send: function(t) {
    this.setData({
      showKeyboard: 0
    });
    var a = this,
      e = (t.currentTarget.dataset.id, s.siteInfo.uniacid);
    this.data.content ? s.util.request({
      url: "entry/wxapp/card_detail",
      data: {
        m: "dbs_masclwlcard",
        uniacid: e,
        fid: this.data.postid,
        type: 2,
        content: this.data.content,
        card_id: a.data.card_detail.id,
        member_id: n
      },
      success: function(t) {
        t.data.data.isAuthorize ? a.setData({
          isAuthorize: !1
        }) : a.setData({
          isAuthorize: !0
        }), a.setData({
          card_detail: t.data.data,
          currentIndex: ""
        });
      },
      fail: function(t) {
        console.log("this is a test2");
      }
    }) : wx.showToast({
      title: "请输入评论..",
      icon: "none",
      duration: 2e3
    });
  },
  _jump: function(t) {
    var a = t.currentTarget.dataset.url;
    wx.navigateTo({
      url: a
    });
  },
  _getList: function() {},
  gZan: function(t) {
    var a = this,
      e = (t.currentTarget.dataset.id, s.siteInfo.uniacid);
    s.util.request({
      url: "entry/wxapp/card_detail",
      data: {
        m: "dbs_masclwlcard",
        uniacid: e,
        type: 3,
        card_id: a.data.card_detail.id,
        member_id: n
      },
      success: function(t) {
        t.data.data.isAuthorize ? a.setData({
          isAuthorize: !1
        }) : a.setData({
          isAuthorize: !0
        }), a.setData({
          card_detail: t.data.data,
          currentIndex: ""
        });
      },
      fail: function(t) {
        console.log("this is11111 a test2");
      }
    });
  },
  clickZan: function(t) {
    var a = this,
      e = t.currentTarget.dataset.id,
      o = s.siteInfo.uniacid;
    s.util.request({
      url: "entry/wxapp/card_detail",
      data: {
        m: "dbs_masclwlcard",
        uniacid: o,
        fid: e,
        type: 1,
        card_id: a.data.card_detail.id,
        member_id: n
      },
      success: function(t) {
        t.data.data.isAuthorize ? a.setData({
          isAuthorize: !1
        }) : a.setData({
          isAuthorize: !0
        }), a.setData({
          card_detail: t.data.data,
          currentIndex: ""
        });
      },
      fail: function(t) {
        console.log("this is a test2");
      }
    });
  },
  _goback: function() {},
  _changeCardStatus: function() {
    this.data.cardStatus ? this.setData({
      cardStatus: !1
    }) : this.setData({
      cardStatus: !0
    });
  },
  _closePopCard: function() {
    c || this.setData({
      is_nullmember_id: !0
    }), this.data.isPopCard ? this.setData({
      isPopCard: !1
    }) : this.setData({
      isPopCard: !0
    });
  },
  from_send: function(t) {
    s.util.getFormId(wx.getStorageSync("member_id"), t);
  },
  form_id: function(t) {
    s.util.request({
      url: "entry/wxapp/save_form",
      data: {
        m: "dbs_masclwlcard",
        uniacid: s.siteInfo.uniacid,
        formId: t,
        member_id: n
      },
      success: function(t) {},
      fail: function(t) {
        console.log("this is a test2");
      }
    });
  },
  getMoreProduct: function() {},
  send_form: function(t) {},
  change_footer_name: function(t) {
    var a = this,
      d = t.currentTarget.dataset.name;
    if (wx.getUserInfo({
        success: function(t) {
          a.setData({
            user: wx.getStorageSync("userInfo").wxInfo
          });
        },
        fail: function() {}
      }), this.data.nav_footer_active, this.setData({
        nav_footer_active: d,
        currentTab: 0
      }), wx.setNavigationBarTitle({
        title: i.green.footernav.product.footer_nav[d]
      }), 0 == d) 1 == e && s.savaRecord({
      type: 4,
      member_id: n,
      be_member_id: o
    });
    else if (1 == d) 1 == e && s.savaRecord({
      type: 16,
      member_id: n,
      be_member_id: o
    });
    else if (2 == d) 1 == e && s.savaRecord({
      type: 2,
      member_id: n,
      be_member_id: o
    });
    else if (3 == d && !r && !c) return a.setData({
      isAuthorize: !0
    }), !1;
  },
  optionsCard: function(t) {
    var a = t.currentTarget.dataset.ishide;
    t.currentTarget.dataset.index, this.setData({
      openOptions: a ? 0 : 1
    });
  },
  gochatDetailAndGetPhoneNumber: function(t) {
    var a = this;
    t.detail.iv ? s.util.request({
      url: "entry/wxapp/getphonenum",
      data: {
        m: "dbs_masclwlcard",
        uniacid: s.siteInfo.uniacid,
        encryptedData: t.detail.encryptedData,
        iv: t.detail.iv,
        card_id: a.data.card_detail.id,
        member_id: n
      },
      success: function(t) {
        a.setData({
          GetCustomMobile: 1
        }), wx.navigateTo({
          url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + a.data.card_detail.id
        });
      },
      fail: function(t) {
        wx.showToast({
          title: "获取失败....",
          icon: "none",
          duration: 2e3
        });
      }
    }) : wx.navigateTo({
      url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + a.data.card_detail.id
    });
  },
  card_options: function(t) {
    var a, i, r, c, d, l = this,
      u = t.currentTarget.dataset.target;
    switch (t.currentTarget.dataset.option) {
      case "call":
        wx.makePhoneCall({
          phoneNumber: u
        }), 1 == e && s.savaRecord({
          type: 13,
          member_id: n,
          be_member_id: o
        });
        break;

      case "copy":
        d = t.currentTarget.dataset.copy, l.report(655, l.data.card_detail.id, d), wx.setClipboardData({
          data: u + "",
          success: function(t) {
            wx.showToast({
              title: "复制成功",
              icon: "success",
              duration: 1e3
            });
          }
        }), 1 == e && "wxid" == d && s.savaRecord({
          type: 3,
          member_id: n,
          be_member_id: o
        });
        break;

      case "company":
        l.alertcompany();
        break;

      case "company_addr":
        a = l.data.card_detail.card.company_lat, i = l.data.card_detail.card.company_lng,
          r = t.currentTarget.dataset.addr_name, c = t.currentTarget.dataset.addr, wx.openLocation({
            latitude: a,
            longitude: i,
            scale: 28,
            name: r,
            address: c
          });
    }
  },
  go_tab: function(t) {
    var a = t.currentTarget.dataset.card_id;
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab?card_id=" + a
    });
  },
  forbidmove: function(t) {},
  open: function(t) {
    var a = t.currentTarget.dataset.index,
      e = this.data.dynamic_list.open;
    e[a] = !e[a], this.setData({
      "dynamic_list.open": e,
      "dynamic_list.open_input": !1
    });
  },
  splitName: function(t) {
    var a = ["欧阳", "太史", "端木", "上官", "司马", "东方", "独孤", "南宫", "万俟", "闻人", "夏侯", "诸葛", "尉迟", "公羊", "赫连", "澹台", "皇甫", "宗政", "濮阳", "公冶", "太叔", "申屠", "公孙", "慕容", "仲孙", "钟离", "长孙", "宇文", "城池", "司徒", "鲜于", "司空", "汝嫣", "闾丘", "子车", "亓官", "司寇", "巫马", "公西", "颛孙", "壤驷", "公良", "漆雕", "乐正", "宰父", "谷梁", "拓跋", "夹谷", "轩辕", "令狐", "段干", "百里", "呼延", "东郭", "南门", "羊舌", "微生", "公户", "公玉", "公仪", "梁丘", "公仲", "公上", "公门", "公山", "公坚", "左丘", "公伯", "西门", "公祖", "第五", "公乘", "贯丘", "公皙", "南荣", "东里", "东宫", "仲长", "子书", "子桑", "即墨", "达奚", "褚师"],
      e = t.length,
      o = "",
      n = "";
    if (e > 2) {
      var s = t.substr(0, 2);
      console.log(a.indexOf(s)), console.log(t), console.log(s), -1 != a.indexOf(s) ? (o = s,
        n = t.substr(2)) : (o = t.substr(0, 1), n = t.substr(1));
    } else 2 == e ? (o = t.substr(0, 1), n = t.substr(1)) : o = t;
    return [o, n];
  },
  addPhoneContact: function() {
    var t = this,
      a = t.data.card_detail,
      i = t.splitName(a.card_name);
    wx.addPhoneContact({
      lastName: i[0],
      remark: a.card_instr || "",
      photoFilePath: a.card_logo || "",
      firstName: i[1],
      mobilePhoneNumber: a.card_tel || "",
      weChatNumber: a.weixinid || "",
      organization: a.company_name || "",
      title: a.role_name,
      workAddressStreet: a.detailed_address || "",
      email: a.email || "",
      hostNumber: a.phone || "",
      success: function() {
        wx.showToast({
          title: "保存成功"
        }), t.setData({
          isPopCard: !0
        }), 1 == e && s.savaRecord({
          type: 5,
          member_id: n,
          be_member_id: o
        });
      }
    });
  },
  report: function(t, a, e) {
    s.util.request({
      url: "entry/wxapp/report",
      data: {
        m: "dbs_masclwlcard",
        uniacid: s.siteInfo.uniacid,
        card_id: a,
        act_id: t,
        copytype: e,
        member_id: n
      },
      success: function(t) {},
      fail: function(t) {
        console.log("this is a test2");
      }
    });
  },
  showShopPoster: function() {
    this.setData({
      shopMask: !0,
      showChoose: !0
    });
  },
  hideShopMask: function() {
    this.setData({
      shopMask: !1,
      showChoose: !1,
      "card_detail.choose_product": !1,
      "card_detail.savePoster": !1,
      "card_detail.showFriend": !1,
      saveShopBtn: !1,
      showCanvas: !1,
      showFriendCanvas: !1,
      posterList: []
    });
  },
  showposter: function() {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/poster/index?isStatus=1"
    });
  },
  onShareAppMessage: function(t) {
    var a = this;
    1 == e && s.savaRecord({
      type: 11,
      member_id: n,
      be_member_id: o
    }), a.setData({
      nav_footer_active: 0,
      shopMask: !1,
      showChoose: !1
    });
    var i = "/dbs_masclwlcard/pages/tab/tab?parent_id=" + (1 == e ? o : n);
    return console.log("分享链接"), console.log(i), t.from, {
      title: "我是" + this.data.card_detail.card_name + "，这是我的名片请点击保存。找我时搜索：握手名片",
      imageUrl: "",
      path: i,
      success: function(t) {}
    };
  },
  open_sm_box: function(t) {},
  call_phone: function(t) {
    var a = t.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: a
    });
  },
  open_map: function(t) {
    var a = 1 * t.currentTarget.dataset.lat,
      e = 1 * t.currentTarget.dataset.lng,
      o = t.currentTarget.dataset.addr;
    wx.openLocation({
      latitude: a,
      longitude: e,
      scale: 28,
      name: o
    });
  },
  play_video: function(t) {
    var a = t.currentTarget.dataset.video_url;
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/video/video?src=" + a
    });
  },
  go_dynamic: function(t) {
    var a = t.currentTarget.dataset.dynamic_id,
      e = t.currentTarget.dataset.img,
      o = t.currentTarget.dataset.title,
      n = t.currentTarget.dataset.time;
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/web_view/web_view?img=" + e + "&title=" + o + "&time=" + n + "&dyId=" + a
    });
  },
  get_moreshop: function() {},
  _quitcall: function() {
    this.setData({
      androidCallNum: "",
      android: !1
    });
  },
  go_user: function(t) {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/home/home?card_id=" + this.data.card_detail.id
    });
  },
  onUnload: function() {
    clearInterval(this.data.i_time), clearInterval(this.data.msgTime);
  },
  previewImg: function(t) {
    var a = t.currentTarget.dataset,
      e = a.url,
      o = a.urls;
    wx.previewImage({
      current: e,
      urls: o
    });
  },
  onHide: function() {
    clearInterval(this.data.i_time), clearInterval(this.data.msgTime);
  }
}, t(a, "onReady", function() {}), t(a, "onShow", function() {
  var t = this;
  custom_page = 1
  if (n = wx.getStorageSync("member_id"), t.getData(), n) {
    t.getCard2();
    t.getNoReadMsg();
    t.data.nav_footer_active;
    var a = setInterval(function() {
      t.getNoReadMsg();
    }, 3e3);
    t.setData({
      msgTime: a,
      currentTab: 0,
      card_allmembr: [],
      user: wx.getStorageSync("userInfo").wxInfo
    });
  }
}), a));