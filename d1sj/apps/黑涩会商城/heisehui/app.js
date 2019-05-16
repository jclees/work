var e = require("utils/core.js");
App({
	onLaunch : function () {
		// var e = this.getCache("userinfo");
		// ("" == e || e.needauth) && this.getUserInfo(function (e) {}, function (e, t) {
		// 	var t = t ? 1 : 0,
		// 	e = e || "";
		// 	t && wx.redirectTo({
		// 		url : "/pages/message/auth/index?close=" + t + "&text=" + e
		// 	})
		// })
	},
	requirejs : function (e) {
		return require("utils/" + e + ".js")
	},
	getCache : function (e, t) {
		var i = +new Date / 1e3,
		n = "";
		i = parseInt(i);
		try {
			n = wx.getStorageSync(e + this.globalData.appid),
			n.expire > i || 0 == n.expire ? n = n.value : (n = "", this.removeCache(e))
		} catch (e) {
			n = void 0 === t ? "" : t
		}
		return n = n || ""
	},
	setCache : function (e, t, i) {
		var n = +new Date / 1e3,
		a = !0,
		o = {
			expire : i ? n + parseInt(i) : 0,
			value : t
		};
		try {
			wx.setStorageSync(e + this.globalData.appid, o)
		} catch (e) {
			a = !1
		}
		return a
	},
	removeCache : function (e) {
		var t = !0;
		try {
			wx.removeStorageSync(e + this.globalData.appid)
		} catch (e) {
			t = !1
		}
		return t
	},
	getUserInfo : function (t, i) {
		var n = this,
		a = n.getCache("userinfo");
		if (a && !a.needauth)
			return void(t && "function" == typeof t && t(a));
		wx.login({
			success : function (o) {
				if (!o.code)
					return void e.alert("获取用户登录态失败:" + o.errMsg);
				e.post("wxapp/login", {
          code: o.code
				}, function (o) {
					return o.error ? void e.alert("获取用户登录态失败:" + o.message) : o.isclose && i && "function" == typeof i ? void i(o.closetext, !0) : void wx.getUserInfo({
						success : function (i) {
							a = i.userInfo,
							e.get("wxapp/auth", {
								data : i.encryptedData,
								iv : i.iv,
								sessionKey : o.session_key
							}, function (e) {


                i.userInfo.openid = e.openId,
								i.userInfo.id = e.id,
								i.userInfo.uniacid = e.uniacid,
								i.needauth = 0,
								n.setCache("userinfo", i.userInfo, 7200),
								t && "function" == typeof t && t(a)
							})
						},
						fail : function () {
							e.get("wxapp/check", {
								openid : o.openid
							}, function (e) {
								e.needauth = 1,
								n.setCache("userinfo", e, 7200),
								t && "function" == typeof t && t(a)
							})
						}
					})
				})
			},
			fail : function () {
				e.alert("获取用户信息失败!")
			}
		})
	},
	getSet : function () {
		var t = this;
		"" == t.getCache("sysset") && setTimeout(function () {
			var i = t.getCache("cacheset");
			e.get("cacheset", {
				version : i.version
			}, function (e) {
				e.update && t.setCache("cacheset", e.data),
				t.setCache("sysset", e.sysset, 7200)
			})
		}, 10)
	},
	url : function (e) {
		e = e || {};
		var t = {},
		i = "",
		n = "",
		a = this.getCache("usermid");
		if (e.scene){
      var scene = decodeURIComponent(e.scene);
      //console.log(scene);
      var qstring = [];
      var strs = scene.split("&");
      for (var ii = 0; ii < strs.length; ii++) {
        qstring[strs[ii].split("=")[0]] = unescape(strs[ii].split("=")[1]);
      }
      if (qstring.mid) e.mid = qstring.mid;
      //console.log(e.mid);
    }
		i = e.mid || "",
		n = e.merchid || "",
		"" != a ? ("" != a.mid && void 0 !== a.mid || (t.mid = i), "" != a.merchid && void 0 !== a.merchid || (t.merchid = n)) : (t.mid = i, t.merchid = n),
		this.setCache("usermid", t, 7200)
	},
  globalData: {
    appid: "wxd5b538612c27f1a4",
    api: "https://dongguan.weixingzpt.com/app/ewei_shopv2_api.php?i=2",
    approot: "https://dongguan.weixingzpt.com/addons/ewei_shopv2/",
    userInfo: null,
    ver: 333
	}
})
