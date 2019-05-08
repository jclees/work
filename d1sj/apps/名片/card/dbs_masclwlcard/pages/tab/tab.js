var app = getApp(), pindex = 1, psize = 8, P = require("../../config/card.config.js"), v = -1, y = !0;

Page({
    data: {
        dataLoaded: !1,
        currentIndex: "",
        actList: [],
        showKeyboard: 0,
        msgInfo: {},
        msgNum: 0,
        isPopCard: !0,
        hasMobile: 0,
        showCardInfo: !1,
        isDoPullMsg: !1,
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
    onLoad: function(s) {
     

        var r, a = app.siteInfo.uniacid, n = this;
        1 == s.nav_footer_active && n.setData({
            nav_footer_active: s.nav_footer_active
        });
      // 登录
      wx.login({
        success: function (data) {
          n.setData({
            loginData: data
          })
        }
      })
        wx.getSystemInfo({
            success: function(a) {
                r = a.windowHeight, n.setData({
                    "card_detail.winHeight": r,
                    "business.winHeight": r,
                    "dynamic_list.winHeight": r,
                    "main.winHeight": r
                });
            }
        }), app.util.request({
            url: "entry/wxapp/card_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: a,
                card_id: s.card_id
            },
            success: function(a) {
              // debugger
                if (n.setData({
                    card_detail: a.data.data,
                    "card_detail.winHeight": r,
                    GetCustomMobile: a.data.data.GetCustomMobile
                }), a.data.data.shops) { 
                    var t = a.data.data.shops, e = [], i = [];
                    t.forEach(function(a, t) {
                        t % 2 == 0 ? e.push(a) : i.push(a);
                    }), n.setData({
                        "shops.list": t,
                        "shops.left_list": e,
                        "shops.right_list": i
                    });
                }
                a.data.data.isAuthorize ? (n.setData({
                    isAuthorize: !1
                }), 1 == a.data.data.card_membr.isPopCard ? n.setData({
                    isPopCard: !0
                }) : n.setData({
                    isPopCard: !1
                })) : n.setData({
                    isAuthorize: !0
                }), n.setData({
                    dataLoaded: !0
                }), n.report(656, s.card_id, 0);
                var d = setInterval(function() {
                    // n.record(n.data.card_detail.id);
                }, 3e3);
                n.setData({
                    i_time: d
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    record: function(a) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/offline",
            data: {
                m: "dbs_masclwlcard",
                uniacid: app.siteInfo.uniacid,
                card_id: a
            },
            success: function(a) {
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
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    goChat: function(a) {
      console.log(this.data.card_detail.id)
        wx.navigateTo({
            url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + this.data.card_detail.id
        });
    },
    showComments: function(a) {
        var t = this.data.currentIndex, e = a.currentTarget.dataset.index;
        t === e && (e = ""), this.setData({
            currentIndex: e
        });
    },
    bindKeyBlur: function() {
        this.setData({
            showKeyboard: 0
        });
    },
    bindKeyInput: function(a) {
        this.setData({
            content: a.detail.value
        });
    },
    _showKeyboard: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            showKeyboard: 1,
            currentIndex: "",
            postid: t
        });
    },
    _send: function(a) {
        this.setData({
            showKeyboard: 0
        });
        var t = this, e = (a.currentTarget.dataset.id, app.siteInfo.uniacid);
        this.data.content ? app.util.request({
            url: "entry/wxapp/card_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: e,
                fid: this.data.postid,
                type: 2,
                content: this.data.content,
                card_id: t.data.card_detail.id
            },
            success: function(a) {
                a.data.data.isAuthorize ? t.setData({
                    isAuthorize: !1
                }) : t.setData({
                    isAuthorize: !0
                }), t.setData({
                    card_detail: a.data.data,
                    currentIndex: ""
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        }) : wx.showToast({
            title: "请输入评论..",
            icon: "none",
            duration: 2e3
        });
    },
    _jump: function(a) {
        var t = a.currentTarget.dataset.url;
        wx.navigateTo({
            url: t
        });
    },
    _getList: function() {},
    gZan: function(a) {
        var t = this, e = (a.currentTarget.dataset.id, app.siteInfo.uniacid);
        app.util.request({
            url: "entry/wxapp/card_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: e,
                type: 3,
                card_id: t.data.card_detail.id
            },
            success: function(a) {
                a.data.data.isAuthorize ? t.setData({
                    isAuthorize: !1
                }) : t.setData({
                    isAuthorize: !0
                }), t.setData({
                    card_detail: a.data.data,
                    currentIndex: ""
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    clickZan: function(a) {
        var t = this, e = a.currentTarget.dataset.id, i = app.siteInfo.uniacid;
        app.util.request({
            url: "entry/wxapp/card_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: i,
                fid: e,
                type: 1,
                card_id: t.data.card_detail.id
            },
            success: function(a) {
                a.data.data.isAuthorize ? t.setData({
                    isAuthorize: !1
                }) : t.setData({
                    isAuthorize: !0
                }), t.setData({
                    card_detail: a.data.data,
                    currentIndex: ""
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    _goback: function() {
        wx.setStorageSync("hasShowRedBag", ""), wx.reLaunch({
            url: "/dbs_masclwlcard/pages/load/load"
        });
    },
    _changeCardStatus: function() {
        this.data.cardStatus ? this.setData({
            cardStatus: !1
        }) : this.setData({
            cardStatus: !0
        });
    },
    _closePopCard: function() {
        this.data.isPopCard ? this.setData({
            isPopCard: !1
        }) : this.setData({
            isPopCard: !0
        });
    },
    from_send: function(a) {},
    getMoreProduct: function() {},
    send_form: function(a) {},
    change_footer_name: function(a) {
        var t = a.currentTarget.dataset.name;
        this.data.nav_footer_active;
        this.setData({
            nav_footer_active: t
        }), this.report(657, this.data.card_detail.id, t), wx.setNavigationBarTitle({
            title: P.green.footernav.product.footer_nav[t]
        });
    },
    optionsCard: function(a) {
        var t = a.currentTarget.dataset.ishide;
        a.currentTarget.dataset.index;
        this.setData({
            openOptions: t ? 0 : 1
        });
    },
    gochatDetailAndGetPhoneNumber: function(a) {
        var t = this;
        a.detail.iv ? app.util.request({
            url: "entry/wxapp/getphonenum",
            data: {
                m: "dbs_masclwlcard",
                uniacid: app.siteInfo.uniacid,
                encryptedData: a.detail.encryptedData,
                iv: a.detail.iv,
                card_id: t.data.card_detail.id
            },
            success: function(a) {
              // debugger
                t.setData({
                    GetCustomMobile: 1
                }), wx.navigateTo({
                    url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + t.data.card_detail.id
                });
            },
            fail: function(a) {
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
    bindgetuserinfoHandler: function(t) {
        var e = this;


      // app.util.request({
      //   url: "entry/wxapp/oauth",
      //   data: {
      //     code: e.data.loginData.code,
      //     encryptedData: t.detail.encryptedData,
      //     iv: t.detail.iv
      //   },
      //   success: function (a) {

      //     console.log("授权")
      //     console.log(a)
      //    }
      // })


        t = this;
        app.util.getUserInfo(function(a) {
            a && a.wxInfo.nickName && (e.setData({
                isAuthorize: !1
            }), 1 == t.data.card_detail.card_membr.isPopCard ? t.setData({
                isPopCard: !0
            }) : t.setData({
                isPopCard: !1
            }), app.util.request({
                url: "entry/wxapp/addcard_id",
                data: {
                    m: "dbs_masclwlcard",
                    uniacid: app.siteInfo.uniacid,
                    card_id: e.data.card_detail.id
                },
                success: function(a) {
                  debugger
                }
            }));
        });
    },
    card_options: function(a) {
        var t, e, i, d, s, r = this, n = a.currentTarget.dataset.target;
        switch (a.currentTarget.dataset.option) {
          case "call":
            wx.makePhoneCall({
                phoneNumber: n
            });
            break;

          case "copy":
            s = a.currentTarget.dataset.copy, r.report(655, r.data.card_detail.id, s), wx.setClipboardData({
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
    go_tab: function(a) {
        var t = a.currentTarget.dataset.card_id;
        wx.reLaunch({
            url: "/dbs_masclwlcard/pages/tab/tab?card_id=" + t
        });
    },
    forbidmove: function(a) {},
    open: function(a) {
        var t = a.currentTarget.dataset.index, e = this.data.dynamic_list.open;
        e[t] = !e[t], this.setData({
            "dynamic_list.open": e,
            "dynamic_list.open_input": !1
        });
    },
    addPhoneContact: function() {
        var a = this, t = a.data.card_detail;
        wx.addPhoneContact({
            firstName: t.card_name,
            mobilePhoneNumber: t.card_tel || "",
            weChatNumber: t.weixinid || "",
            organization: t.company_profile || t.card.company_name || "",
            title: t.role_name,
            workAddressStreet: "" + t.address + t.detailed_address || "",
            email: t.email || "",
            success: function() {
                a.setData({
                    isPopCard: !0,
                    "card_detail.card_membr.isPopCard": 1
                }), a.report(654, a.data.card_detail.id, 0);
            }
        });
    },
    report: function(a, t, e) {
        app.util.request({
            url: "entry/wxapp/report",
            data: {
                m: "dbs_masclwlcard",
                uniacid: app.siteInfo.uniacid,
                card_id: t,
                act_id: a,
                copytype: e
            },
            success: function(a) {},
            fail: function(a) {
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
            url: "/dbs_masclwlcard/pages/poster/index?card_id=" + this.data.card_detail.id
        });
    },
    onShareAppMessage: function() {
        return {
            title: "你好,我是" + this.data.card_detail.card.company_name + "的" + this.data.card_detail.card_name + "这是我的名片请惠存",
            imageUrl: this.data.card_detail.card_logo,
            path: "/dbs_masclwlcard/pages/tab/tab?card_id=" + this.data.card_detail.id
        };
    },
    open_sm_box: function(a) {},
    call_phone: function(a) {
        var t = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    open_map: function(a) {
        var t = 1 * a.currentTarget.dataset.lat, e = 1 * a.currentTarget.dataset.lng, i = a.currentTarget.dataset.addr;
        wx.openLocation({
            latitude: t,
            longitude: e,
            scale: 28,
            name: i
        });
    },
    play_video: function(a) {
        var t = a.currentTarget.dataset.video_url;
        wx.navigateTo({
            url: "/dbs_masclwlcard/pages/video/video?src=" + t
        });
    },
    go_dynamic: function(a) {
        var t = a.currentTarget.dataset.dynamic_id, e = a.currentTarget.dataset.img, i = a.currentTarget.dataset.title, d = a.currentTarget.dataset.time;
        wx.navigateTo({
            url: "/dbs_masclwlcard/pages/web_view/web_view?img=" + e + "&title=" + i + "&time=" + d + "&dyId=" + t
        });
    },
    get_moreshop: function() {
        var i, d = this, s = d.data.shops.list, r = d.data.shops.left_list, n = d.data.shops.right_list;
        app.util.request({
            url: "entry/wxapp/get_moreshops",
            data: {
                m: "dbs_masclwlcard",
                uniacid: app.siteInfo.uniacid,
                card_id: d.data.card_detail.id,
                pindex: pindex
            },
            success: function(a) {
                var t = a.data.data.shops, e = a.data.data.total;
                0 < t.length && pindex <= Math.ceil(e / psize) ? (i = s.concat(a.data.data.shops), 
                r = [], n = [], i.forEach(function(a, t) {
                    t % 2 == 0 ? r.push(a) : n.push(a);
                }), d.setData({
                    "shops.list": i,
                    "shops.left_list": r,
                    "shops.right_list": n
                }), pindex++) : d.setData({
                    "shops.pro_no_more": !0
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    _quitcall: function() {
        this.setData({
            androidCallNum: "",
            android: !1
        });
    },
    go_user: function(a) {
        wx.navigateTo({
            url: "/dbs_masclwlcard/pages/home/home?card_id=" + this.data.card_detail.id
        });
    },
    onUnload: function() {
        clearInterval(this.data.i_time);
    },
    previewImg: function(a) {
        var t = a.currentTarget.dataset, e = t.url, i = t.urls;
        wx.previewImage({
            current: e,
            urls: i
        });
    },
    onHide: function() {
        clearInterval(this.data.i_time);
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        if (a.data.dataLoaded) {
            var t = setInterval(function() {
                // a.record(a.data.card_detail.id);
            }, 3e3);
            a.setData({
                i_time: t
            });
        }
        console.log("onShow");
    }
});