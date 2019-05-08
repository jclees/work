var app = getApp();

Page({
    data: {
        src: "",
        dataLoaded: !1,
        NeddPay: !0,
        hasAddress: !1,
        isFirstLoad: !0,
        detail: [],
        userName: "",
        telNumber: "",
        address: ""
    },
    onLoad: function(a) {
        this.setData({
            detail: a
        });
    },
    addaddress: function() {
        wx.navigateTo({
            url: "/dbs_masclwlcard/pages/myAddr/my_address/index?settings=true"
        });
    },
    onShow: function() {
        var a = this.data.detail;
        if (this.data.isFirstLoad) this.data.isFirstLoad = !1, this.get_address(); else if (app.globalData.addres) {
            var e = (a = app.globalData.addres).telNumber, t = a.userName, d = a.address;
            this.data.hasAddress = "" != e && "" != t && "" != d, this.setData({
                telNumber: e,
                userName: t,
                address: d,
                hasAddress: this.data.hasAddress
            });
        }
        e = this;
    },
    get_address: function() {
        var a = app.siteInfo.uniacid, r = this;
        app.util.request({
            url: "entry/wxapp/default_address",
            data: {
                m: "dbs_masclwlcard",
                uniacid: a
            },
            success: function(a) {
                if (0 == a.data.error && a.data.data) {
                    var e = a.data.data, t = e.userName, d = e.telNumber, s = e.provinceName + e.cityName + e.countyName + e.detailInfo;
                    "" != t && "" != d && "" != s && (r.data.hasAddress = !0), r.setData({
                        userName: t,
                        telNumber: d,
                        address: s,
                        hasAddress: r.data.hasAddress,
                        dataLoaded: !0
                    });
                } else r.setData({
                    dataLoaded: !0
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    to_pay: function() {
        var a = app.siteInfo.uniacid, t = this, e = this;
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
        var e = this.data, t = e.detail.price, d = e.userName, s = e.address, r = e.telNumber;
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