var app = getApp(),
  P = require("../../..//config/card.config.js"),
  user_flag,
  parent_id,
  member_id;

Page({
  data: {
    netWorkData: {},
    cates: [],
    currentTab: 0,
    index: 0,
    dataLoaded: !0,
    currentIndex: "",
    actList: [],
    showKeyboard: 0,
    msgInfo: {},
    msgNum: 0,
    M: 0,
    items: [
      { name: '1', value: '15', checked: 'true' },
      { name: '3', value: '45', },
      { name: '12', value: '180', }
    ],
    isPopCard: !0,
    hasMobile: 0,
    showCardInfo: !1,
    isDoPullMsg: !1,
    is_hmd: !1,
    GetCustomMobile: 0,
    openOptions: [],
    cardStatus: !1,
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
    nav_footer: P.green.footernav.product.nav_footer,
    footer_nav: P.green.footernav.product.footer_nav,
    open_card_detail: 0,
    allCompanyDetail: {}
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  popLock: function (event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  jump_mycard() {
    let that = this
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab"
    });
  },
  jump_url: function (a) {
    var t = a.currentTarget.dataset.url;
    wx.navigateTo({
      url: t
    });
  },
  jumpCreateCard() {
    wx.navigateTo({
      url: '/dbs_masclwlcard/pages/create_card/create_card',
    })
  },
  onLoad: function (options) {
    // debugger
    let r, n = this;
    wx.getSystemInfo({
      success: function (a) {
        r = a.windowHeight, n.setData({
          M: r
        });
      }
    })
    member_id = wx.getStorageSync("member_id");
    n.getCustomlists()
    if (options.nav_footer_active) {
      n.setData({
        nav_footer_active: options.nav_footer_active
      })
      wx.setNavigationBarTitle({
        title: P.green.footernav.product.footer_nav[options.nav_footer_active]
      });
    }
    if (options.parent_id) { //带分享id
      wx.setStorageSync("parent_id", options.parent_id);
      wx.setStorageSync("user_flag", 1);
      parent_id = options.parent_id
      user_flag = 1
      if (member_id) {
        n.setData({
          isAuthorize: !1,
          isPopCard: !1
        })
        n.getShare()
        n.getData()
        n.getLikeStatus(member_id, parent_id)
      } else {
        n.setData({
          isAuthorize: !0,
          isPopCard: !1
        })
      }
    } else { //没有分享id
      wx.setStorageSync("user_flag", 0);
      user_flag = 0
      if (member_id) {
        n.setData({
          isAuthorize: !1,
          isPopCard: !0
        })
        n.getData()
        n.getLikeStatus(member_id, member_id)
      } else {
        n.setData({
          isAuthorize: !0,
          isPopCard: !0
        })
      }
    }
    n.setData({
      user_flag: user_flag
    })
  },
  getData() {
    let that = this;
    if (user_flag == 0) {//个人
      member_id = wx.getStorageSync("member_id")
    } else {//分享
      member_id = wx.getStorageSync("parent_id")
    }
    let nav_footer_active = that.data.nav_footer_active
    // debugger
    if (nav_footer_active == 0) {
      that.getCard(member_id)//名片详情
    } else if (nav_footer_active == 1) {
      // debugger
      that.getCard(member_id)//名片详情
      that.getCate(member_id)//产品分类
      that.getProducts({//产品列表
        cate_id: 0,
        member_id: member_id
      })
    } else if (nav_footer_active == 2) {
      that.getNetwork(member_id)//官网详情
    } else if (nav_footer_active == 3) {

    }
  },
  getCard(id) {
    let r, n = this;
    app.util.request({
      url: "/index/cardInfo",
      data: {
        member_id: id
      },
      success: function (d) {
        // debugger
        console.log("名片详情")
        console.log(d)
        user_flag == 1 && wx.setStorageSync("parentInfo", d.data.data)
        // console.log(d.data.data.card_name)
        d.data.data.card_name != null ? n.setData({
          card_detail: d.data.data
        }) : wx.reLaunch({
          url: "/dbs_masclwlcard/pages/create_card/create_card"
        })
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
  getNetwork(id) {
    let that = this
    app.util.request({
      url: "/network/index",
      data: {
        member_id: id
      },
      success: function (d) {
        // debugger
        console.log("官网")
        console.log(d)
        that.setData({
          netWorkData: d.data.data
        })
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
  getCustomlists() {
    let that = this
    app.util.request({
      url: "/index/customlists",
      data: {
        member_id: member_id
      },
      success: function (d) {
        // debugger
        console.log("获取浏览用户头像")
        console.log(d)
        let t = that.data.card_detail
        t.card_allmembr = d.data.data
        that.setData({
          card_detail: t
        })
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
  getLikeStatus() {
    let that = this
    app.util.request({
      url: "/index/getLikeStatus",
      data: {
        member_id: member_id,
        card_id: parent_id ? parent_id : member_id
      },
      success: function (d) {
        // debugger
        console.log("获取点赞状态")
        console.log(d)
        let t = that.data.card_detail
        t.is_like = d.data.data.is_like
        that.setData({
          card_detail: t
        })
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
  like() {
    let that = this
    app.util.request({
      url: "/index/like",
      data: {
        member_id: member_id,
        card_id: parent_id ? parent_id : member_id
      },
      method: "POST",
      success: function (d) {
        // debugger
        console.log("点赞/取消点赞")
        console.log(d)
        that.getLikeStatus()
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
  seeNetwork() {
    let that = this
    app.util.request({
      url: "/network/showNotes",
      data: {
        member_id: member_id,
        be_member_id: parent_id
      },
      method: "POST",
      success: function (d) {
        // debugger
        console.log("记录官网浏览")
        console.log(d)
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
  getCate(id) {
    // debugger
    let that = this
    app.util.request({
      url: "/cateShow",
      data: {
        member_id: id
      },
      success: function (d) {
        // debugger
        console.log("分类")
        console.log(d)
        let obj = {}
        obj.id = 0
        obj.name = "全部"
        d.data.cates.unshift(obj)
        that.setData({
          cates: d.data.cates
        })
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
  navbarTap(e) {
    let that = this
    let id = e.currentTarget.dataset.typeid
    debugger
    wx.showLoading({
      title: '加载中...'
    })
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    that.getProducts({
      cate_id: id,
      member_id: member_id
    })
  },
  getProducts(p) {
    // debugger
    let that = this
    app.util.request({
      url: "/proIndex",
      data: p,
      success: function (d) {
        wx.hideLoading()
        // debugger
        console.log("产品列表")
        console.log(d)
        that.setData({
          shops: d.data.index
        })
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
  collectCard() {
    let that = this
    app.util.request({
      url: "/index/collectCard",
      data: {
        member_id: member_id,
        card_id: parent_id
      },
      method: "POST",
      success: function (d) {
        console.log("收藏成功")
        console.log(d)
        let t = that.data.card_detail
        t.collectStatus = d.data.data.status
        that.setData({
          card_detail: t
        })
        if (d.data.data.status != 1) {
          wx.showToast({
            title: "收藏成功",
            icon: "none"
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '此名片已收藏,去名片夹看看？',
            showCancel: true,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/dbs_masclwlcard/pages/load/load"
                })
              }
            }
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
  getShare() {
    let that = this
    app.util.request({
      url: "/index/share",
      data: {
        parent_id: parent_id,
        member_id: member_id
      },
      method: "POST",
      success: function (a) {
        // debugger
        console.log("分享")
        console.log(a)
      },
      fail: function (a) {
        debugger
        console.log("数据错误");
        console.log(a);
      }
    })
  },
  bindgetuserinfoHandler: function (t) {
    var e = this;
    t = this;
    app.util.getUserInfo(function (a) {
      member_id = a.data.data.member_id
      a && a.data.data.member_id && (e.setData({
        isAuthorize: !1
      }));
      e.getData()
    });
  },
  record: function (a) {
    var e = this;
    console.log(member_id)
    app.util.request({
      url: "entry/wxapp/offline",
      data: {
        m: "dbs_masclwlcard",
        uniacid: app.siteInfo.uniacid,
        card_id: a,
        member_id: member_id
      },
      success: function (a) {
        // debugger
        if (a.data.data) {
          var t = a.data.data;
          t && 0 < t ? e.setData({
            msgStatus: 1,
            offline: t
          }) : e.setData({
            offline: 0,
            msgStatus: 0
          });
        }
      },
      fail: function (a) {
        // debugger
        console.log("数据错误");
        console.log(a);
      }
    });
  },
  goChat: function (a) {
    let that = this
    app.util.request({
      url: "/chat/userInto",
      data: {
        parent_id: parent_id,
        member_id: member_id
      },
      method: "POST",
      success: function (a) {
        // debugger
        console.log("聊天室 通知发送模板消息")
        console.log(a)
        wx.navigateTo({
          url: "/dbs_masclwlcard/pages/chat_detail/chat_detail"
        });
      },
      fail: function (a) {
        debugger
        console.log("数据错误");
        console.log(a);
      }
    })

  },
  showComments: function (a) {
    var t = this.data.currentIndex,
      e = a.currentTarget.dataset.index;
    t === e && (e = ""), this.setData({
      currentIndex: e
    });
  },
  bindKeyBlur: function () {
    this.setData({
      showKeyboard: 0
    });
  },
  bindKeyInput: function (a) {
    this.setData({
      content: a.detail.value
    });
  },
  _showKeyboard: function (a) {
    var t = a.currentTarget.dataset.id;
    this.setData({
      showKeyboard: 1,
      currentIndex: "",
      postid: t
    });
  },
  _send: function (a) {
    this.setData({
      showKeyboard: 0
    });
    var t = this,
      e = (a.currentTarget.dataset.id, app.siteInfo.uniacid);
    this.data.content ? app.util.request({
      url: "entry/wxapp/card_detail",
      data: {
        m: "dbs_masclwlcard",
        uniacid: e,
        fid: this.data.postid,
        type: 2,
        content: this.data.content,
        card_id: t.data.card_detail.id,
        member_id: member_id

      },
      success: function (a) {
        a.data.data.isAuthorize ? t.setData({
          isAuthorize: !1
        }) : t.setData({
          isAuthorize: !0
        }), t.setData({
          card_detail: a.data.data,
          currentIndex: ""
        });
      },
      fail: function (a) {
        console.log("this is a test2");
      }
    }) : wx.showToast({
      title: "请输入评论..",
      icon: "none",
      duration: 2e3
    });
  },
  _jump: function (a) {
    var t = a.currentTarget.dataset.url;
    wx.navigateTo({
      url: t
    });
  },
  _getList: function () { },
  gZan: function (a) {
    var t = this,
      e = (a.currentTarget.dataset.id, app.siteInfo.uniacid);
    app.util.request({
      url: "entry/wxapp/card_detail",
      data: {
        m: "dbs_masclwlcard",
        uniacid: e,
        type: 3,
        card_id: t.data.card_detail.id,
        member_id: member_id
      },
      success: function (a) {
        a.data.data.isAuthorize ? t.setData({
          isAuthorize: !1
        }) : t.setData({
          isAuthorize: !0
        }), t.setData({
          card_detail: a.data.data,
          currentIndex: ""
        });
      },
      fail: function (a) {
        console.log("this is11111 a test2");
      }
    });
  },
  clickZan: function (a) {
    var t = this,
      e = a.currentTarget.dataset.id,
      i = app.siteInfo.uniacid;
    app.util.request({
      url: "entry/wxapp/card_detail",
      data: {
        m: "dbs_masclwlcard",
        uniacid: i,
        fid: e,
        type: 1,
        card_id: t.data.card_detail.id,
        member_id: member_id

      },
      success: function (a) {
        a.data.data.isAuthorize ? t.setData({
          isAuthorize: !1
        }) : t.setData({
          isAuthorize: !0
        }), t.setData({
          card_detail: a.data.data,
          currentIndex: ""
        });
      },
      fail: function (a) {
        console.log("this is a test2");
      }
    });
  },
  _goback: function () {
    // wx.setStorageSync("hasShowRedBag", ""), wx.reLaunch({
    //   url: "/dbs_masclwlcard/pages/load/load"
    // });
  },
  _changeCardStatus: function () {
    this.data.cardStatus ? this.setData({
      cardStatus: !1
    }) : this.setData({
      cardStatus: !0
    });
  },
  _closePopCard: function () {
    this.data.isPopCard ? this.setData({
      isPopCard: !1
    }) : this.setData({
      isPopCard: !0
    });
  },
  from_send: function (a) {
    // console.log("formId");
    var t = a.detail.formId;
    // console.log(member_id)
    // console.log(parent_id)
    app.util.getFormId(wx.getStorageSync("member_id"), t)
    // this.form_id(t);
  },
  form_id: function (a) {
    app.util.request({
      url: "entry/wxapp/save_form",
      data: {
        m: "dbs_masclwlcard",
        uniacid: app.siteInfo.uniacid,
        formId: a,
        member_id: member_id

      },
      success: function (a) { },
      fail: function (a) {
        console.log("this is a test2");
      }
    });
  },
  getMoreProduct: function () { },
  send_form: function (a) { },
  change_footer_name: function (a) {
    let that = this;
    var t = a.currentTarget.dataset.name;
    wx.getUserInfo({
      success: function (e) {
        that.setData({
          user: wx.getStorageSync("userInfo").wxInfo
        })
      },
      fail() {
      }
    })
    this.data.nav_footer_active;
    this.setData({
      nav_footer_active: t
    }), wx.setNavigationBarTitle({
      title: P.green.footernav.product.footer_nav[t]
    });
    this.getData()
    if (t == 0) {

    } else if (t == 1) {

    } else if (t == 2) {
      if (user_flag == 1) {
        this.seeNetwork()
      }
    } else if (t == 3) {

    }
  },
  optionsCard: function (a) {
    var t = a.currentTarget.dataset.ishide;
    a.currentTarget.dataset.index;
    this.setData({
      openOptions: t ? 0 : 1
    });
  },
  gochatDetailAndGetPhoneNumber: function (a) {
    var t = this;
    a.detail.iv ? app.util.request({
      url: "entry/wxapp/getphonenum",
      data: {
        m: "dbs_masclwlcard",
        uniacid: app.siteInfo.uniacid,
        encryptedData: a.detail.encryptedData,
        iv: a.detail.iv,
        card_id: t.data.card_detail.id,
        member_id: member_id

      },
      success: function (a) {
        t.setData({
          GetCustomMobile: 1
        }), wx.navigateTo({
          url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + t.data.card_detail.id
        });
      },
      fail: function (a) {
        wx.showToast({
          title: "获取失败....",
          icon: "none",
          duration: 2e3
        });
      }
    }) : wx.navigateTo({
      url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + t.data.card_detail.id
    });
  },
  card_options: function (a) {
    var t, e, i, d, s, r = this,
      n = a.currentTarget.dataset.target;
    switch (a.currentTarget.dataset.option) {
      case "call":
        wx.makePhoneCall({
          phoneNumber: n
        });
        break;

      case "copy":
        s = a.currentTarget.dataset.copy, r.report(655, r.data.card_detail.id, s), wx.setClipboardData({
          data: n + "",
          success: function (a) {
            wx.showToast({
              title: "复制成功",
              icon: "success",
              duration: 1e3
            });
          }
        });
        break;

      case "company":
        r.alertcompany();
        break;

      case "company_addr":
        t = r.data.card_detail.card.company_lat, e = r.data.card_detail.card.company_lng,
          i = a.currentTarget.dataset.addr_name, d = a.currentTarget.dataset.addr, wx.openLocation({
            latitude: t,
            longitude: e,
            scale: 28,
            name: i,
            address: d
          });
    }
  },
  go_tab: function (a) {
    var t = a.currentTarget.dataset.card_id;
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab?card_id=" + t
    });
  },
  forbidmove: function (a) { },
  open: function (a) {
    var t = a.currentTarget.dataset.index,
      e = this.data.dynamic_list.open;
    e[t] = !e[t], this.setData({
      "dynamic_list.open": e,
      "dynamic_list.open_input": !1
    });
  },
  addPhoneContact: function () {
    var a = this,
      t = a.data.card_detail;
    wx.addPhoneContact({
      remark: t.card_instr || "",
      photoFilePath: t.card_logo || "",
      firstName: t.card_name,
      mobilePhoneNumber: t.card_tel || "",
      weChatNumber: t.weixinid || "",
      organization: t.company_name || "",
      title: t.role_name,
      workAddressStreet: t.detailed_address || "",
      email: t.email || "",
      hostNumber: t.phone || "",
      success: function () {
        a.setData({
          isPopCard: !0
        })
      }
    });
  },
  report: function (a, t, e) {
    app.util.request({
      url: "entry/wxapp/report",
      data: {
        m: "dbs_masclwlcard",
        uniacid: app.siteInfo.uniacid,
        card_id: t,
        act_id: a,
        copytype: e,
        member_id: member_id

      },
      success: function (a) { },
      fail: function (a) {
        console.log("this is a test2");
      }
    });
  },
  showShopPoster: function () {
    this.setData({
      shopMask: !0,
      showChoose: !0
    });
  },
  hideShopMask: function () {
    this.setData({
      shopMask: !1,
      "card_detail.choose_product": !1,
      "card_detail.savePoster": !1,
      "card_detail.showFriend": !1,
      saveShopBtn: !1,
      showCanvas: !1,
      showFriendCanvas: !1,
      posterList: []
    });
  },
  showposter: function () {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/poster/index?card_id=" + this.data.card_detail.id
    });
  },
  onShareAppMessage: function () {
    let usrr_flag = wx.getStorageSync("usrr_flag")
    let path = "/dbs_masclwlcard/pages/tab/tab?parent_id=" + (usrr_flag == 1 ? parent_id : member_id)
    return {
      title: "你好,我是" + this.data.card_detail.company_name + "的" + this.data.card_detail.card_name + "这是我的名片请惠存",
      imageUrl: this.data.card_detail.card_logo,
      path: path,
      success: (res => { })
    };
  },
  open_sm_box: function (a) { },
  call_phone: function (a) {
    var t = a.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: t
    });
  },
  open_map: function (a) {
    var t = 1 * a.currentTarget.dataset.lat,
      e = 1 * a.currentTarget.dataset.lng,
      i = a.currentTarget.dataset.addr;
    wx.openLocation({
      latitude: t,
      longitude: e,
      scale: 28,
      name: i
    });
  },
  play_video: function (a) {
    var t = a.currentTarget.dataset.video_url;
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/video/video?src=" + t
    });
  },
  go_dynamic: function (a) {
    var t = a.currentTarget.dataset.dynamic_id,
      e = a.currentTarget.dataset.img,
      i = a.currentTarget.dataset.title,
      d = a.currentTarget.dataset.time;
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/web_view/web_view?img=" + e + "&title=" + i + "&time=" + d + "&dyId=" + t
    });
  },
  get_moreshop: function () {
    // var i, d = this,
    //   s = d.data.shops.list,
    //   r = d.data.shops.left_list,
    //   n = d.data.shops.right_list;
    // app.util.request({
    //   url: "entry/wxapp/get_moreshops",
    //   data: {
    //     m: "dbs_masclwlcard",
    //     uniacid: app.siteInfo.uniacid,
    //     card_id: d.data.card_detail.id,
    //     pindex: pindex,
    //     member_id: member_id

    //   },
    //   success: function(a) {
    //     var t = a.data.data.shops,
    //       e = a.data.data.total;
    //     0 < t.length && pindex <= Math.ceil(e / psize) ? (i = s.concat(a.data.data.shops),
    //       r = [], n = [], i.forEach(function(a, t) {
    //         t % 2 == 0 ? r.push(a) : n.push(a);
    //       }), d.setData({
    //         "shops.list": i,
    //         "shops.left_list": r,
    //         "shops.right_list": n
    //       }), pindex++) : d.setData({
    //       "shops.pro_no_more": !0
    //     });
    //   },
    //   fail: function(a) {
    //     console.log("this is a test2");
    //   }
    // });
  },
  _quitcall: function () {
    this.setData({
      androidCallNum: "",
      android: !1
    });
  },
  go_user: function (a) {
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/home/home?card_id=" + this.data.card_detail.id
    });
  },
  onUnload: function () {
    clearInterval(this.data.i_time);
  },
  previewImg: function (a) {
    var t = a.currentTarget.dataset,
      e = t.url,
      i = t.urls;
    wx.previewImage({
      current: e,
      urls: i
    });
  },
  onHide: function () {
    clearInterval(this.data.i_time);
  },
  onReady: function () { },
  onShow: function () {
    let n = this
    member_id = wx.getStorageSync("member_id")
    if (member_id) {
      n.setData({
        user: wx.getStorageSync("userInfo").wxInfo
      })
    }
    // var a = this;
    // if (a.data.dataLoaded) {
    //   a.record(a.data.card_detail.id);
    //   var t = setInterval(function() {
    //     a.record(a.data.card_detail.id);
    //   }, 3e3);
    //   a.setData({
    //     i_time: t
    //   });
    // }
    // console.log("onShow");
  }
});