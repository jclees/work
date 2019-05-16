var e, //user_flag
  o, //parent_id
  n, //member_id
  app = getApp(),
  i = require("../../config/card.config.js"), //tab配置
  r = !1, //授权状态
  c = !1, //注册状态
  custom_page = 1; //浏览头像page
let page = 2;

Page({
  data: {
    netWorkData: {},
    cates: [],
    faxianData: [],
    is_like: 0,
    currentTab: 0,
    index: 0,
    dataLoaded: !0,
    currentIndex: "",
    M: 0,
    isPopCard: !0,
    cardStatus: !1,
    card_allmembr: [],
    loadFlag: false,
    wzOptions: {
      txt: '加载中...',
      status: true,
      param: {
        page: 1
      }
    },


    containerHeight: 0,
    userInfo: [],
    card_detail: [],

    nav_footer_active: 0,
    nav_footer: i.green.footernav.product.nav_footer,
    footer_nav: i.green.footernav.product.footer_nav,
  },
  onLoad: function(t) {
    // debugger
    this.setContainerHeight();
    if (console.log(t), t.scene) {
      var a = decodeURIComponent(t.scene).split("&")[0];
      t.parent_id = a.split("=")[1];
    }
    var w = void 0,
      c = this;
    //一屏高度
    wx.getSystemInfo({
      success: function(t) {
        w = t.windowHeight, c.setData({
          M: w
        });
      }
    })
    //其他页面跳转回来对应的页面
    t.nav_footer_active && (c.setData({
      nav_footer_active: t.nav_footer_active
    }), wx.setNavigationBarTitle({
      title: i.green.footernav.product.footer_nav[t.nav_footer_active]
    }))

    //缓存里取member_id
    n = wx.getStorageSync("member_id")
    if (n) {
      r = !0
      if (t.parent_id && n != t.parent_id) { //判断分享id 和member_id相同
        // e = 1,好友的名片
        wx.setStorageSync("user_flag", 1)
        e = 1
        o = t.parent_id
        wx.setStorageSync("parent_id", t.parent_id)
        c.setData({
          isPopCard: !1,
          user_flag: e
        })
      } else {
        // e = 0,自己的名片
        wx.setStorageSync("user_flag", 0)
        e = 0
        c.setData({
          isPopCard: !1,
          user_flag: e
        })
      }
    } else {

      if (t.parent_id) {
        // user_flag = 1,好友的名片
        wx.setStorageSync("user_flag", 1)
        e = 1
        o = t.parent_id
        wx.setStorageSync("parent_id", t.parent_id)
        c.setData({
          isPopCard: !1,
          user_flag: e
        })
        //访问好友名片做记录
        app.savaRecord({
          type: 4,
          member_id: n,
          be_member_id: o
        })
        // r = !0
      } else {
        wx.reLaunch({
          url: "/dbs_masclwlcard/pages/create_card2/create_card"
        });
      }
    }
    //访问好友名片做记录
    app.savaRecord({
      type: 4,
      member_id: n,
      be_member_id: o
    })
  },
  onShow: function() {
    this.setData({
      tempInpVal: '搜索发现更多'
    })
    if (o || r) {
      var t = this;
      custom_page = 1
      n = wx.getStorageSync("member_id")
      t.getData();
      t.setData({
        currentTab: 0,
        card_allmembr: [],
        user: wx.getStorageSync("userInfo").wxInfo
      });
      if (n) {
        t.getNoReadMsg();
        t.getCard2();
        var a = setInterval(function() {
          t.getNoReadMsg();
        }, 3e3);
        t.setData({
          msgTime: a,
        });
      }
    } else {
      debugger
    }
  },
  onHide: function() {
    this.setData({
      "wzOptions.param.page":1
    })
    clearInterval(this.data.i_time), clearInterval(this.data.msgTime);
  },
  onUnload: function() {
    this.setData({
      "wzOptions.param.page": 1
    })
    clearInterval(this.data.i_time), clearInterval(this.data.msgTime);
  },
  openSetting(t) { //打开授权设置
    let _this = t;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '若不打开授权，则无法将图片保存在相册中！',
      success: function(res) {
        wx.getSetting({
          success(data) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  console.log(res)
                  if (!res.authSetting["scope.writePhotosAlbum"]) {
                    _this.openSetting(_this)
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  previewImage(e) { //图片预览
    let that = this
    var curIndex = e.target.dataset.curindex;
    var subIndex = e.target.dataset.subidx;
    
    var imgUrls = that.data.wenzData[curIndex].imgs
    wx.previewImage({
      current: imgUrls[subIndex], // 当前显示图片的http链接  
      urls: imgUrls // 需要预览的图片http链接列表  
    })
  },
  // 下载图片
  downloadImgs(e) {
    var _this = this;
    if (_this.data.wenzData[e.currentTarget.dataset.curindex].imgs.length <= 0) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.txt,
        success: function(res) {
          wx.hideLoading()
          wx.showToast({
            title: '图文复制成功',
            icon: 'none'
          })
        }
      });
      return
    }
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() { //这里是用户同意授权后的回调
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        // 调用保存图片promise队列
        _this.queue(_this.data.wenzData[e.currentTarget.dataset.curindex].imgs)
          .then(res => {
            wx.setClipboardData({
              data: e.currentTarget.dataset.txt,
              success: function(res) {
                wx.hideLoading()
                wx.showToast({
                  title: '图文复制成功',
                  icon: 'none'
                })
              }
            });

          })
          .catch(err => {
            wx.hideLoading()
            console.log(err)
          })
      },
      fail() { //这里是用户拒绝授权后的回调
        _this.openSetting(_this)
      }
    })
  },
  // 队列
  queue(urls) {
    let promise = Promise.resolve()
    urls.forEach((url, index) => {
      promise = promise.then(() => {
        return this.download(url)
      })
    })
    return promise
  },
  // 下载
  download(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: function(res) {

          var temp = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function(res) {
              resolve(res)
            },
            fail: function(err) {
              reject(res)
            }
          })
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  },
  refresh() {
    let that = this;
    let options = that.data.wzOptions;
    options.txt = " 刷新中..."
    options.param.page = 1
    that.data.keyword && (options.param.cont = that.data.keyword)
    options.param.type_id = that.data.faxianData[that.data.currentTab].id


    that.setData({
      wzOptions: options
    })
    that.getwenzhang()
  },
  emptyInp() {
    let that = this
    let options = that.data.wzOptions;

    that.setData({
      searchSucc: false,
      keyword:'',
      inputValue: "搜索发现更多",
      wzOptions:{
        txt:'加载中...',
        status:true,
        param:{
          page:1,
          type_id: that.data.faxianData[that.data.currentTab].id
        }
      }
    })
    setTimeout(()=>{
      that.getwenzhang()
    },500)
  },
  bindInpChange(e) {
    let that = this
    that.setData({
      inputValue: e.detail.value,
    })
    if (that.data.inputValue == '') {
      that.setData({
        searchSucc: false
      })
    } else {
      that.setData({
        searchSucc: true
      })
    }

  },
  cateSearch(e) {
    let that = this;
    let options = that.data.wzOptions;
    options.txt = " 加载中..."
    options.param.page = 1
    that.data.keyword && (options.param.cont = that.data.keyword)
    options.param.type_id = that.data.faxianData[e.currentTarget.dataset.idx].id

    that.setData({
      currentTab: e.currentTarget.dataset.idx,
      wzOptions: options
    })
    that.getwenzhang()
  },
  bindInpconfirm(e) { //搜索
    let that = this
    let keyword = that.data.inputValue
    let key = e.currentTarget.dataset.key
    if (key) {
      keyword = key
      that.setData({
        inputValue: keyword
      })
    }
    that.setData({
      searchSucc: true,
      keyword: keyword,
      "wzOptions.txt": '搜索中...',
      "wzOptions.param": {
        page: 1,
        type_id: that.data.faxianData[that.data.currentTab].id,
        cont: keyword
      }
    })
    that.getwenzhang()
  },
  loadMore() {
    let that = this;
    let options = that.data.wzOptions;
    if (!options.status) {
      return
    }
    that.setData({
      "wzOptions.status": false,
    })
    that.getwenzhang()
  },
  getFaXianType() {
    let that = this;
    app.util.request({
      url: "/news/types",
      data: {},
      success: function(res) {
        console.log("发现分类")
        console.log(res)
        if (res.data.errno == 0) {
          that.setData({
            faxianData: res.data.data
          });
          let obj = {
            id: 0,
            name: "全部"
          };
          that.data.faxianData.unshift(obj)
          that.setData({
            faxianData: that.data.faxianData
          });
        }
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  getwenzhang() { //列表

    let that = this;
    let options = that.data.wzOptions;

    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: options.txt,
    })

    let param = options.param;

    app.util.request({
      url: "/news/index",
      data: param,
      success: function(res) {


        console.log("商城列表")
        console.log(res)
        if (res.data.errno == 0) {
          that.setData({
            "wzOptions.status": true
          })
          wx.hideNavigationBarLoading()
          wx.setNavigationBarTitle({
            title: '发现',
          })
          let wenzData = res.data.data.lists


          if (param.page == 1) {
            that.setData({
              wenzData,
            })
          } else {

            if (wenzData.length <= 0) {
              wx.showToast({
                title: "没有更多数据啦~~",
                icon: "none"
              })
              return
            }
            let d = that.data.wenzData
            for (var i = 0; i < wenzData.length; i++) {
              d.push(wenzData[i]);
            }
            that.setData({
              wenzData: d
            })
          }

          param.page++

        }
      },
      fail: function(t) {
        that.setData({
          "wzOptions.status": true
        })
        console.log("数据错误"), console.log(t);
      }
    });
  },
  //名片详情
  getCard: function() {
    var t = this;
    app.util.request({
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
        ) : wx.reLaunch({
          url: "/dbs_masclwlcard/pages/create_card2/create_card"
        });
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t);
      }
    });
  },
  //自己的名片
  getCard2: function() {
    var t = this;
    t.getGrade(), app.util.request({
      url: "/index/cardInfo",
      data: {
        member_id: n
      },
      success: function(a) {
        console.log("自己的名片"), console.log(a), null != a.data.data.card_name && (t.setData({
          card_detail2: a.data.data
        }), wx.setStorageSync("memberInfo", a.data.data));
      },
      fail: function(t) {
        console.log("数据错误"), console.log(t), wx.showToast({
          title: t.data.message,
          icon: "none"
        });
      }
    });
  },
  //续费vip的月数 取vipid
  radioChange: function(t) {
    this.setData({
      vipid: t.detail.value
    });
  },
  //弹框
  popLock: function(t) {
    app.popLock(t.currentTarget.dataset.id), this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4
    });
  },
  //阻止弹窗滚动
  myCatchTouch: function() {
    return
  },
  //跳转页面
  jump_url: function(t) {
    var url = t.currentTarget.dataset.url,
      typ = t.currentTarget.dataset.typ;
    typ == 1 ? wx.reLaunch({
      url: url,
    }) : (typ == 2 ? wx.redirectTo({
      url: url,
    }) : wx.navigateTo({
      url: url
    }))
  },
  //初始方法
  getData: function() {
    wx.showLoading({
      title: "加载中..."
    });
    var t = this;
    t.getFaXianType();
    t.getwenzhang();
    t.updateGoods();
    t.data.nav_footer_active;
    t.getCard();
    t.getCollectStatus();
    t.getCustomlists();
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
  //购买vip支付
  payment: function(t) {
    wx.showLoading({
      title: "加载中..."
    });
    var a = this;
    app.util.request({
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
              1 == e && app.savaRecord({
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
  //查询有没有新的对话消息
  getNoReadMsg: function() {
    // debugger
    var t = this;
    app.util.request({
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
  //商城头部信息
  getShops: function() {
    var t = this;
    app.util.request({
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
  //收益余额
  getEarning: function() {
    var t = this;
    app.util.request({
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
  //打开提现弹框
  tXianPop: function() {
    this.getEarning(),
      this.setData({
        pop2: !0
      });
  },
  //打开充值vip弹框
  buyVipPop: function() {
    this.getVips(),
      this.setData({
        pop1: !0
      });
  },
  //提现
  tXian: function(t) {
    wx.showLoading({
      title: "加载中..."
    });
    var a = this;
    app.util.request({
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
  //会员套餐列表
  getVips: function() {
    var t = this;
    app.util.request({
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
  //等级
  getGrade: function() {
    var t = this;
    app.util.request({
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
  //官网三条动态
  getDynamic: function() {
    var t = this;
    app.util.request({
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
  //官网详情
  getNetwork: function() {
    var t = this;
    app.util.request({
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
  //查看浏览弹框里的名片
  jump_parentcard(a) {
    app.util.getFormId(wx.getStorageSync("member_id"), a);
    wx.reLaunch({
      url: "/dbs_masclwlcard/pages/tab/tab?parent_id=" + o
    });
  },
  //打开名片浏览弹框
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
  //关闭名片浏览弹框
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
  //上拉加载浏览弹框里的数据
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
  //加载浏览弹框里的数据
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
    app.util.request({
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
  //获取点赞状态
  getLikeStatus: function() {
    var t = this;
    app.util.request({
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
  //点赞
  like: function() {
    var t = this;
    console.log(r, c)
    // if (!r && !c) return t.setData({
    //   isAuthorize: !0
    // }), !1;
    if (!r) { //授权状态
      t.setData({
        isAuthorize: !0
      })
      return
    }
    if (!c) { //授权状态
      wx.showModal({
        title: '提示',
        content: '您还未创建名片，现在去创建自己的名片吧？',
        success: function(res) {
          res.confirm && wx.navigateTo({
            url: "/dbs_masclwlcard/pages/create_card2/create_card"
          })
        }
      })
      return
    }
    app.util.request({
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
  //商城分类
  getCate: function(t) {
    var a = this;
    app.util.request({
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
  //
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
  updateGoods() {
    // debugger
    let that = this
    app.util.request({
      url: "/product/updateGoods",
      data: {
        member_id: 0 == e ? n : o
      },
      success: function(d) {
        wx.hideLoading()
        // debugger
        console.log("updateGoods")
        console.log(d)
        that.getProducts({
          cate_id: 0,
          member_id: 0 == e ? n : o
        });
      },
      fail: function(res) {

      }
    });
  },
  //商城 产品列表
  getProducts: function(t) {
    var a = this;
    app.util.request({
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
  //收藏名片的状态
  getCollectStatus: function() {
    var t = this;
    app.util.request({
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
  //收藏名片
  collectCard: function(e, s = !1) {
    console.log(r, c)
    // debugger
    var i = this;
    if (!r) { //授权状态
      i.setData({
        isAuthorize: !0
      })
      return
    }
    if (!c) { //注册状态
      wx.showModal({
        title: '提示',
        content: '您还未创建名片，现在去创建自己的名片吧？',
        success: function(res) {
          res.confirm && wx.navigateTo({
            url: "/dbs_masclwlcard/pages/create_card2/create_card"
          })
        }
      })
      return
    }
    if (s) {
      app.util.request({
        url: "/index/collectCard",
        data: {
          member_id: n,
          card_id: o
        },
        method: "POST",
        success: function(t) {
          console.log("收藏成功")
          console.log(t)
          if (t.data.errno == 0) {
            i.parentCollectCard();
            i.setData({
              is_collect: 1
            });
            1 == e && app.savaRecord({
              type: 8,
              member_id: n,
              be_member_id: o
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

    } else {
      wx.navigateTo({
        url: "/dbs_masclwlcard/pages/load/load"
      })
    }

  },
  //让对方默认收藏
  parentCollectCard() {
    console.log(o, n)
    var i = this;
    app.util.request({
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
  //确定上下级
  getShare: function() {
    // debugger
    app.util.request({
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
  //授权弹框
  bindgetuserinfoHandler: function(t) {
    var a = this;
    app.util.getUserInfo(function(t) {
      r = !0;
      t && t.data.data.member_id && (
        n = t.data.data.member_id,
        e == 1 && (
          app.savaRecord({
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
  //判断是否注册
  is_create_card: function(t) {
    var a = this;
    app.util.request({
      url: "/index/is_create_card",
      data: {
        member_id: t
      },
      success: function(t) {
        console.log("判断是否注册");
        console.log(t);
        0 == t.data.errno && (
          1 == t.data.data.status ? (
            a.setData({
              is_nullmember_id: !1
            }),
            c = !0,
            1 == e && a.collectCard('1111', !0)
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
  //聊天
  goChat: function(t) {
    debugger
    var a = this,
      e = t.currentTarget.dataset.pid;
    if (!r) { //授权状态
      a.setData({
        isAuthorize: !0
      })
      return
    }

    // if (!c) { //授权状态
    //   wx.showModal({
    //     title: '提示',
    //     content: '您还未创建名片，现在去创建自己的名片吧？',
    //     success: function(res) {
    //       res.confirm && wx.navigateTo({
    //         url: "/dbs_masclwlcard/pages/create_card2/create_card"
    //       })
    //     }
    //   })
    //   return
    // }
    this.setData({
      pop4: !1,
      pop5: !1
    })
    app.util.getFormId(wx.getStorageSync("member_id"), t);
    void 0 == e && (e = o),
      wx.navigateTo({
        url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?parent_id=" + e
      })

    //  app.util.request({
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
  //展开全部名片信息
  _changeCardStatus: function() {
    this.data.cardStatus ? this.setData({
      cardStatus: !1
    }) : this.setData({
      cardStatus: !0
    });
  },
  //看看再说
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
    n && app.util.getFormId(wx.getStorageSync("member_id"), t);
  },
  //切换tab
  change_footer_name: function(t) {
    var a = this,
      d = t.currentTarget.dataset.name;
    wx.getUserInfo({
      success: function(t) {
        a.setData({
          user: wx.getStorageSync("userInfo").wxInfo
        });
      },
      fail: function() {}
    })
    if (d == 0) {
      1 == e && app.savaRecord({
        type: 4,
        member_id: n,
        be_member_id: o
      });
    } else if (d == 1) {
      1 == e && app.savaRecord({
        type: 16,
        member_id: n,
        be_member_id: o
      });
    } else if (d == 2) {
      1 == e && app.savaRecord({
        type: 2,
        member_id: n,
        be_member_id: o
      });
    } else if (d == 3) {
      if (!r) { //授权状态
        a.setData({
          isAuthorize: !0
        })
        return
      }
      if (!c) { //授权状态
        wx.showModal({
          title: '提示',
          content: '您还未创建名片，现在去创建自己的名片吧？',
          success: function(res) {
            res.confirm && wx.navigateTo({
              url: "/dbs_masclwlcard/pages/create_card2/create_card"
            });
            // res.cancel && wx.reLaunch({
            //   url: "/dbs_masclwlcard/pages/tab/tab?parent_id=" + o +"&nav_footer_active="+0
            // });
          }
        })
        return
      }
    }
    this.setData({
      nav_footer_active: d,
      currentTab: 0
    })
    wx.setNavigationBarTitle({
      title: i.green.footernav.product.footer_nav[d]
    })
  },
  //复制 打电话
  card_options: function(t) {
    var a, i, r, c, d, l = this,
      u = t.currentTarget.dataset.target;
    switch (t.currentTarget.dataset.option) {
      case "call":
        wx.makePhoneCall({
          phoneNumber: u
        }), 1 == e && app.savaRecord({
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
        }), 1 == e && "wxid" == d && app.savaRecord({
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
  //截取四个字的名字
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
  //保存到通讯录
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
        }), 1 == e && app.savaRecord({
          type: 5,
          member_id: n,
          be_member_id: o
        });
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
  //转发
  onShareAppMessage: function(t) {
    var a = this;
    1 == e && app.savaRecord({
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
  //打电话
  call_phone: function(t) {
    var a = t.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: a
    });
  },
  //去web view页
  go_dynamic: function(t) {
    var a = t.currentTarget.dataset.dynamic_id,
      e = t.currentTarget.dataset.img,
      o = t.currentTarget.dataset.title,
      n = t.currentTarget.dataset.time;
    wx.navigateTo({
      url: "/dbs_masclwlcard/pages/web_view/web_view?img=" + e + "&title=" + o + "&time=" + n + "&dyId=" + a
    });
  },
  _quitcall: function() {
    this.setData({
      androidCallNum: "",
      android: !1
    });
  },
  previewImg: function(t) {
    var a = t.currentTarget.dataset,
      e = a.url,
      o = a.urls;
    wx.previewImage({
      current: e,
      urls: o
    });
  }
})