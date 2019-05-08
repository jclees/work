var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, _base = require("base64"), _md = require("md5"), _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function _defineProperty(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

var util = {};

function getQuery(e) {
    var t = [];
    if (-1 != e.indexOf("?")) for (var n = e.split("?")[1].split("&"), a = 0; a < n.length; a++) n[a].split("=")[0] && unescape(n[a].split("=")[1]) && (t[a] = {
        name: n[a].split("=")[0],
        value: unescape(n[a].split("=")[1])
    });
    return t;
}

function getUrlParam(e, t) {
    var n = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"), a = e.split("?")[1].match(n);
    return null != a ? unescape(a[2]) : null;
}

function getSign(e, t, n) {
    var a = require("underscore.js"), r = require("md5.js"), o = "", i = getUrlParam(e, "sign");
    if (i || t && t.sign) return !1;
    if (e && (o = getQuery(e)), t) {
        var s = [];
        for (var u in t) u && t[u] && (s = s.concat({
            name: u,
            value: t[u]
        }));
        o = o.concat(s);
    }
    o = a.sortBy(o, "name"), o = a.uniq(o, !0, "name");
    for (var c = "", f = 0; f < o.length; f++) o[f] && o[f].name && o[f].value && (c += o[f].name + "=" + o[f].value, 
    f < o.length - 1 && (c += "&"));
    return i = r(c + (n = n || getApp().siteInfo.token));
}

util.base64_encode = function(e) {
    return (0, _base.base64_encode)(e);
}, util.base64_decode = function(e) {
    return (0, _base.base64_decode)(e);
}, util.md5 = function(e) {
    return (0, _md2.default)(e);
}, util.url = function(e, t) {
    var n = getApp(), a = n.siteInfo.siteroot + "?i=" + n.siteInfo.uniacid + "&t=" + n.siteInfo.multiid + "&v=" + n.siteInfo.version + "&from=wxapp&";
    if (e && ((e = e.split("/"))[0] && (a += "c=" + e[0] + "&"), e[1] && (a += "a=" + e[1] + "&"), 
    e[2] && (a += "do=" + e[2] + "&")), t && "object" === (void 0 === t ? "undefined" : _typeof(t))) for (var r in t) r && t.hasOwnProperty(params) && t[r] && (a += r + "=" + t[r] + "&");
    return a;
}, util.getSign = function(e, t, n) {
    return getSign(e, t, n);
}, util.request = function(a) {
    require("underscore.js");
    var e, t = require("md5.js"), r = getApp();
    (a = a || {}).cachetime = a.cachetime ? a.cachetime : 0, a.showLoading = void 0 === a.showLoading || a.showLoading;
    var n = wx.getStorageSync("userInfo").sessionid, o = a.url;
    if (-1 == o.indexOf("http://") && -1 == o.indexOf("https://") && (o = util.url(o)), 
    getUrlParam(o, "state") || a.data && a.data.state || !n || (o = o + "&state=we7sid-" + n), 
    !a.data || !a.data.m) {
        var i = getCurrentPages();
        i.length && (i = i[getCurrentPages().length - 1]) && i.__route__ && (o = o + "&m=" + i.__route__.split("/")[0]);
    }
    var s = getSign(o, a.data);
    if (s && (o = o + "&sign=" + s), !o) return !1;
    if (a.showLoading, a.cachetime) {
        var u = t(o), c = wx.getStorageSync(u), f = Date.parse(new Date());
        if (c && c.data) {
            if (c.expire > f) return a.complete && "function" == typeof a.complete && a.complete(c), 
            a.success && "function" == typeof a.success && a.success(c), console.log("cache:" + o), 
            !0;
            wx.removeStorageSync(u);
        }
    }
    wx.request((_defineProperty(e = {
      url: "https://icard.weixingzpt.com/api" + a.url,
        data: a.data ? a.data : {},
        header: a.header ? a.header : {},
        method: a.method ? a.method : "GET"
    }, "header", {
        "content-type": "application/x-www-form-urlencoded"
    }), _defineProperty(e, "success", function(e) {
      // if (wx.hideNavigationBarLoading(), wx.hideLoading(), e.data.errno) {
        if (wx.hideNavigationBarLoading(), e.data.errno) {
            if ("41009" == e.data.errno) return wx.setStorageSync("userInfo", ""), void util.getUserInfo(function() {
                util.request(a);
            });
            if (a.fail && "function" == typeof a.fail) a.fail(e); else if (e.data.message) {
                if (null != e.data.data && e.data.data.redirect) var t = e.data.data.redirect; else t = "";
                r.util.message(e.data.message, t, "error");
            }
        } else if (a.success && "function" == typeof a.success && a.success(e), a.cachetime) {
            var n = {
                data: e.data,
                expire: f + 1e3 * a.cachetime
            };
            wx.setStorageSync(u, n);
        }
    }), _defineProperty(e, "fail", function(e) {
        wx.hideNavigationBarLoading(), wx.hideLoading();
        var t = require("md5.js")(o), n = wx.getStorageSync(t);
        if (n && n.data) return a.success && "function" == typeof a.success && a.success(n), 
        console.log("failreadcache:" + o), !0;
        a.fail && "function" == typeof a.fail && a.fail(e);
    }), _defineProperty(e, "complete", function(e) {
        a.complete && "function" == typeof a.complete && a.complete(e);
    }), e));
  }, util.chooseImage = function(data){
    wx.chooseImage({
      count: data.count, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res)
        var imgsrc = res.tempFilePaths
        typeof data.success == "function" && data.success(imgsrc)
      },
      fail: function (res) {
        typeof data.success == "function" && data.fail(res)
      },
      complete: function () {
      }
    })
  }, util.delChooseImage = function (data) {
    picsUp.splice(Number(that.data.previewIndex), 1)
    that.setData({
      [pics]: picsUp,
      layer: false
    })
  },util.uploadFile = function (a) {
  var that = this,_this=a._this,
    i = a.i ? a.i : 0, //当前上传的哪张图片
    success = a.success ? a.success : 0, //上传成功的个数
    fail = a.fail ? a.fail : 0; //上传失败的个数
  // console.log("a.path[i]")
  // console.log(a.path[i])
  // if (a.formData.photo_id >= 0){
  //   a.formData.photo_id += 1
  //   console.log("id:" + a.formData.photo_id)
  // }
  // debugger
  _this.setData({ upLoadStatus:!1})
  wx.uploadFile({
    url: "https://icard.weixingzpt.com/api" + a.url,
    filePath: a.path[i],
    name: a.name, //这里根据自己的实际情况改
    formData: a.formData, //这里是上传图片时一起上传的数据
    success: (resp) => {
      success++; //图片上传成功，图片上传成功的变量+1
      // console.log("resp")
      // console.log(resp)
      // console.log(i);
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    },
    fail: (res) => {
      console.log("失败失败")
      console.log(res)
      // debugger
      fail++; //图片上传失败，图片上传失败的变量+1
      // console.log('fail:' + i + "fail:" + fail);
    },
    complete: (res) => {
      // console.log("111111111111")
      // console.log(res)
      // console.log(i);
      typeof a.picUpIng == 'function' && a.picUpIng(res);
      i++; //这个图片执行完上传后，开始上传下一张
      if (i == a.path.length) { //当图片传完时，停止调用 
        // console.log('执行完毕');
        // console.log('成功：' + success + " 失败：" + fail);
        typeof a.picUpSuccess == 'function' && a.picUpSuccess(res);
      } else { //若图片还没有传完，则继续调用函数
        // console.log(i);
        a.i = i;
        a.success = success;
        a.fail = fail;
        util.uploadFile(a);
      }
    }
  });

  }, util.getFormId=function(o, e) { //取FormId
  // console.log("取FormId")
  // debugger
  console.log(e.detail.formId)
  //  console.log(o)
  this.request({
    url: "/index/saveFormId",
    data: {
      member_id: o,
      form_id: e.detail.formId
    },
    method: "POST",
    success: function (res) {
      console.log("获取formid成功")
      console.log(res)
    },
    fail: function (res) {
      console.log("数据错误");
      console.log(res);
    }
  });
}, util.getUserInfo = function(n) {
    var e = function() {
        var t = {
            sessionid: "",
            wxInfo: "",
            memberInfo: ""
        };
        wx.login({
            success: function(e) {
              let _e = e
            wx.getUserInfo({
              success: function (e) {
                t.wxInfo = e.userInfo, wx.setStorageSync("userInfo", t), util.request({
                  url: "/index/oauth",
                  data: {
                    iv: e.iv,
                    encryptedData: e.encryptedData,
                    code: _e.code
                  },
                  method: "POST",
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  cachetime: 0,
                  success: function (e) {
                    // debugger
                    console.log(e)
                    
                    // e.data.errno || (t.memberInfo = e.data.data, wx.setStorageSync("userInfo", t)),
                    //   "function" == typeof n && n(t);
                    e.data.data.member_id && wx.setStorageSync("member_id", e.data.data.member_id),
                      "function" == typeof n && n(e);
                  }
                });
              },
              fail: function () {
                "function" == typeof n && n(t);
              },
              complete: function () { }
            })


                // util.request({
                //     url: "auth/session/openid",
                //     data: {
                //         code: e.code
                //     },
                //     cachetime: 0,
                //     success: function(e) {
                //         e.data.errno || (t.sessionid = e.data.data.sessionid, wx.setStorageSync("userInfo", t), 
                //         wx.getUserInfo({
                //             success: function(e) {
                //                 t.wxInfo = e.userInfo, wx.setStorageSync("userInfo", t), util.request({
                //                     url: "auth/session/userinfo",
                //                     data: {
                //                         signature: e.signature,
                //                         rawData: e.rawData,
                //                         iv: e.iv,
                //                         encryptedData: e.encryptedData
                //                     },
                //                     method: "POST",
                //                     header: {
                //                         "content-type": "application/x-www-form-urlencoded"
                //                     },
                //                     cachetime: 0,
                //                     success: function(e) {
                //                         e.data.errno || (t.memberInfo = e.data.data, wx.setStorageSync("userInfo", t)), 
                //                         "function" == typeof n && n(t);
                //                     }
                //                 });
                //             },
                //             fail: function() {
                //                 "function" == typeof n && n(t);
                //             },
                //             complete: function() {}
                //         }));
                //     }
                // });
            },
            fail: function() {
                console.log("start fail"), wx.showModal({
                    title: "获取信息失败",
                    content: "请允许授权以便为您提供给服务",
                    success: function(e) {
                        e.confirm && util.getUserInfo();
                    }
                });
            }
        });
    }, t = wx.getStorageSync("userInfo"), a = wx.getStorageSync("userInfo");
    t.sessionid ? wx.checkSession({
        success: function() {
            wx.getUserInfo({
                success: function(e) {
                    a.wxInfo = e.userInfo, wx.setStorageSync("userInfo", a), util.request({
                        url: "auth/session/userinfo",
                        data: {
                            signature: e.signature,
                            rawData: e.rawData,
                            iv: e.iv,
                            encryptedData: e.encryptedData
                        },
                        method: "POST",
                        header: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        cachetime: 0,
                        success: function(e) {
                            e.data.errno || (a.memberInfo = e.data.data, wx.setStorageSync("userInfo", a)), 
                            "function" == typeof n && n(a);
                        }
                    });
                },
                fail: function() {
                    console.log("用户拒绝"), "function" == typeof n && n(a);
                }
            });
        },
        fail: function() {
            t.sessionid = "", console.log("relogin"), wx.removeStorageSync("userInfo"), e();
        }
    }) : e();
}, util.navigateBack = function(t) {
    var e = t.delta ? t.delta : 1;
    if (t.data) {
        var n = getCurrentPages(), a = n[n.length - (e + 1)];
        a.pageForResult ? a.pageForResult(t.data) : a.setData(t.data);
    }
    wx.navigateBack({
        delta: e,
        success: function(e) {
            "function" == typeof t.success && t.success(e);
        },
        fail: function(e) {
            "function" == typeof t.fail && t.fail(e);
        },
        complete: function() {
            "function" == typeof t.complete && t.complete();
        }
    });
}, util.footer = function(e) {
    var t = e, n = getApp().tabBar;
    for (var a in n.list) n.list[a].pageUrl = n.list[a].pagePath.replace(/(\?|#)[^"]*/g, "");
    t.setData({
        tabBar: n,
        "tabBar.thisurl": t.__route__
    });
}, util.message = function(e, t, n) {
  debugger
    if (!e) return !0;
    if ("object" == (void 0 === e ? "undefined" : _typeof(e)) && (t = e.redirect, n = e.type, 
    e = e.title), t) {
        var a = t.substring(0, 9), r = "", o = "";
        "navigate:" == a ? (o = "navigateTo", r = t.substring(9)) : "redirect:" == a ? (o = "redirectTo", 
        r = t.substring(9)) : (r = t, o = "redirectTo");
    }
    console.log(r), n || (n = "success"), "success" == n ? wx.showToast({
        title: e,
        icon: "success",
        duration: 2e3,
        mask: !!r,
        complete: function() {
            r && setTimeout(function() {
                wx[o]({
                    url: r
                });
            }, 1800);
        }
    }) : "error" == n && wx.showModal({
        title: "系统信息",
        content: e,
        showCancel: !1,
        complete: function() {
            r && wx[o]({
                url: r
            });
        }
    });
}, util.user = util.getUserInfo, util.showLoading = function() {
    wx.getStorageSync("isShowLoading") && (wx.hideLoading(), wx.setStorageSync("isShowLoading", !1)), 
    wx.showLoading({
        title: "加载中",
        complete: function() {
            wx.setStorageSync("isShowLoading", !0);
        },
        fail: function() {
            wx.setStorageSync("isShowLoading", !1);
        }
    });
}, util.showImage = function(e) {
    var t = e ? e.currentTarget.dataset.preview : "";
    if (!t) return !1;
    wx.previewImage({
        urls: [ t ]
    });
}, util.parseContent = function(e) {
    if (!e) return e;
    var t = e.match(new RegExp([ "\ud83c[\udf00-\udfff]", "\ud83d[\udc00-\ude4f]", "\ud83d[\ude80-\udeff]" ].join("|"), "g"));
    if (t) for (var n in t) e = e.replace(t[n], "[U+" + t[n].codePointAt(0).toString(16).toUpperCase() + "]");
    return e;
}, util.date = function() {
    this.isLeapYear = function(e) {
        return 0 == e.getYear() % 4 && (e.getYear() % 100 != 0 || e.getYear() % 400 == 0);
    }, this.dateToStr = function(e, t) {
        e = e || "yyyy-MM-dd HH:mm:ss", t = t || new Date();
        var n = e;
        return n = (n = (n = (n = (n = (n = (n = (n = (n = (n = (n = (n = (n = n.replace(/yyyy|YYYY/, t.getFullYear())).replace(/yy|YY/, 9 < t.getYear() % 100 ? (t.getYear() % 100).toString() : "0" + t.getYear() % 100)).replace(/MM/, 9 < t.getMonth() ? t.getMonth() + 1 : "0" + (t.getMonth() + 1))).replace(/M/g, t.getMonth())).replace(/w|W/g, [ "日", "一", "二", "三", "四", "五", "六" ][t.getDay()])).replace(/dd|DD/, 9 < t.getDate() ? t.getDate().toString() : "0" + t.getDate())).replace(/d|D/g, t.getDate())).replace(/hh|HH/, 9 < t.getHours() ? t.getHours().toString() : "0" + t.getHours())).replace(/h|H/g, t.getHours())).replace(/mm/, 9 < t.getMinutes() ? t.getMinutes().toString() : "0" + t.getMinutes())).replace(/m/g, t.getMinutes())).replace(/ss|SS/, 9 < t.getSeconds() ? t.getSeconds().toString() : "0" + t.getSeconds())).replace(/s|S/g, t.getSeconds());
    }, this.dateAdd = function(e, t, n) {
        switch (n = n || new Date(), e) {
          case "s":
            return new Date(n.getTime() + 1e3 * t);

          case "n":
            return new Date(n.getTime() + 6e4 * t);

          case "h":
            return new Date(n.getTime() + 36e5 * t);

          case "d":
            return new Date(n.getTime() + 864e5 * t);

          case "w":
            return new Date(n.getTime() + 6048e5 * t);

          case "m":
            return new Date(n.getFullYear(), n.getMonth() + t, n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds());

          case "y":
            return new Date(n.getFullYear() + t, n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds());
        }
    }, this.dateDiff = function(e, t, n) {
        switch (e) {
          case "s":
            return parseInt((n - t) / 1e3);

          case "n":
            return parseInt((n - t) / 6e4);

          case "h":
            return parseInt((n - t) / 36e5);

          case "d":
            return parseInt((n - t) / 864e5);

          case "w":
            return parseInt((n - t) / 6048e5);

          case "m":
            return n.getMonth() + 1 + 12 * (n.getFullYear() - t.getFullYear()) - (t.getMonth() + 1);

          case "y":
            return n.getFullYear() - t.getFullYear();
        }
    }, this.strToDate = function(dateStr) {
        var data = dateStr, reCat = /(\d{1,4})/gm, t = data.match(reCat);
        return t[1] = t[1] - 1, eval("var d = new Date(" + t.join(",") + ");"), d;
    }, this.strFormatToDate = function(e, t) {
        var n = 0, a = -1, r = t.length;
        -1 < (a = e.indexOf("yyyy")) && a < r && (n = t.substr(a, 4));
        var o = 0;
        -1 < (a = e.indexOf("MM")) && a < r && (o = parseInt(t.substr(a, 2)) - 1);
        var i = 0;
        -1 < (a = e.indexOf("dd")) && a < r && (i = parseInt(t.substr(a, 2)));
        var s = 0;
        (-1 < (a = e.indexOf("HH")) || 1 < (a = e.indexOf("hh"))) && a < r && (s = parseInt(t.substr(a, 2)));
        var u = 0;
        -1 < (a = e.indexOf("mm")) && a < r && (u = t.substr(a, 2));
        var c = 0;
        return -1 < (a = e.indexOf("ss")) && a < r && (c = t.substr(a, 2)), new Date(n, o, i, s, u, c);
    }, this.dateToLong = function(e) {
        return e.getTime();
    }, this.longToDate = function(e) {
        return new Date(e);
    }, this.isDate = function(e, t) {
        null == t && (t = "yyyyMMdd");
        var n = t.indexOf("yyyy");
        if (-1 == n) return !1;
        var a = e.substring(n, n + 4), r = t.indexOf("MM");
        if (-1 == r) return !1;
        var o = e.substring(r, r + 2), i = t.indexOf("dd");
        if (-1 == i) return !1;
        var s = e.substring(i, i + 2);
        return !(!isNumber(a) || "2100" < a || a < "1900") && (!(!isNumber(o) || "12" < o || o < "01") && !(s > getMaxDay(a, o) || s < "01"));
    }, this.getMaxDay = function(e, t) {
        return 4 == t || 6 == t || 9 == t || 11 == t ? "30" : 2 == t ? e % 4 == 0 && e % 100 != 0 || e % 400 == 0 ? "29" : "28" : "31";
    }, this.isNumber = function(e) {
        return /^\d+$/g.test(e);
    }, this.toArray = function(e) {
        e = e || new Date();
        var t = Array();
        return t[0] = e.getFullYear(), t[1] = e.getMonth(), t[2] = e.getDate(), t[3] = e.getHours(), 
        t[4] = e.getMinutes(), t[5] = e.getSeconds(), t;
    }, this.datePart = function(e, t) {
        t = t || new Date();
        var n = "";
        switch (e) {
          case "y":
            n = t.getFullYear();
            break;

          case "M":
            n = t.getMonth() + 1;
            break;

          case "d":
            n = t.getDate();
            break;

          case "w":
            n = [ "日", "一", "二", "三", "四", "五", "六" ][t.getDay()];
            break;

          case "ww":
            n = t.WeekNumOfYear();
            break;

          case "h":
            n = t.getHours();
            break;

          case "m":
            n = t.getMinutes();
            break;

          case "s":
            n = t.getSeconds();
        }
        return n;
    }, this.maxDayOfDate = function(e) {
        (e = e || new Date()).setDate(1), e.setMonth(e.getMonth() + 1);
        var t = e.getTime() - 864e5;
        return new Date(t).getDate();
    };
}, module.exports = util;