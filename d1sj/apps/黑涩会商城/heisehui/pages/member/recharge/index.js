var e = getApp(), t = e.requirejs("core"), a = e.requirejs("jquery");
Page({
	data : {
		disabled : !0,
		coupon : {
			count : 0
		}
	},
	onLoad : function (t) {
		e.url(t),
		this.get_list()
	},
	onShow : function () {
		var t = e.getCache("coupon");
		this.setData({
			"coupon.id" : t.id,
			"coupon.name" : t.name || ""
		})
	},
	get_list : function () {
		var e = this;
		t.get("member/recharge", {}, function (t) {
			t.show = !0,
			e.setData(t)
		})
	},
  toggle: function (e) {
    console.log(e);
		var a = t.pdata(e),
		i = a.id,
		o = a.type,
		n = {};
		n[o] = 0 == i || void 0 === i ? 1 : 0,
		this.setData(n)
	},
	money : function (e) {
		var i = !0,
		o = a.trim(e.detail.value),
		n = this;
		o >= this.data.minimumcharge && (i = !1),
		t.get("sale/coupon/query", {
			type : 1,
			money : o
		}, function (e) {
			n.setData({
				money : o,
				disabled : i,
				coupon : {
					id : 0,
					name : "",
					count : e.count
				}
			})
		})
	},
	submit : function () {
		var e = a.toFixed(this.data.money, 2),
		i = {};
		if (!this.data.disabled) {
			if (void 0 === e || isNaN(e))
				return void t.alert("请填写正确的充值金额!");
			if (e <= 0 || this.data.disabled)
				return void t.alert("最低充值金额为" + this.data.minimumcharge + "元!");
			i.money = e,
			i.type = "wechat",
			i.couponid = this.data.coupon.id,
			t.post("member/recharge/submit", i, function (e) {
				0 == e.error ? e.wechat.success ? t.pay(e.wechat.payinfo, function (a) {
					"requestPayment:ok" == a.errMsg && t.post("member/recharge/wechat_complete", {
						logid : e.logid
					}, function (e) {
						0 == e.error ? wx.navigateBack() : t.alert(e.message)
					}, !0)
				}) : t.alert(list.wechat.payinfo.message + "\n不能使用微信支付!") : t.alert(e.message)
			}, !0)
		}
	},
  swift: function () {//cc_zhong 增加全付通
    var e = a.toFixed(this.data.money, 2),
      i = {};
    if (!this.data.disabled) {
      if (void 0 === e || isNaN(e))
        return void t.alert("请填写正确的充值金额!");
      if (e <= 0 || this.data.disabled)
        return void t.alert("最低充值金额为" + this.data.minimumcharge + "元!");
      i.money = e,
        i.type = "swift",
        i.couponid = this.data.coupon.id,
        t.post("member/recharge/submit", i, function (a) {
          if (!a.token) {
            return void t.alert(a.message);
          } else {
            var result = JSON.parse(a.pay_info);
            wx.requestPayment({
              'timeStamp': result.timeStamp,
              'nonceStr': result.nonceStr,
              'package': result.package,
              'signType': 'MD5',
              'paySign': result.paySign,
              'success': function (res) {
                //t.complete('swift');
                wx.showModal({
                  title: '支付成功',
                  content: '如账户余额未变更，可耐心等待片刻！',
                  showCancel: false,
                  confirmText: '确定',
                  success: function (res) {
                    return void wx.navigateBack();
                  }
                })
              },
              'fail': function (res) {
                e.alert('支付失败！');
              }
            })
          }
        }, !0)
    }
  }
})
