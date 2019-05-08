var app = getApp();

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
    onLoad: function(a) {
        var t = app.siteInfo.uniacid, s = this;
        app.util.request({
            url: "entry/wxapp/shops_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t,
                shops_id: a.shops_id,
                card_id: a.card_id
            },
            success: function(a) {
                a.data.data.isAuthorize ? s.setData({
                    isAuthorize: !1
                }) : s.setData({
                    isAuthorize: !0
                }), a.data.data.showUser ? s.setData({
                    showUser: !0,
                    card: a.data.data.card
                }) : s.setData({
                    showUser: !1,
                    card: a.data.data.card
                }), s.setData({
                    shops: a.data.data.shops,
                    M_price: a.data.data.shops.price,
                    dataLoaded: !0
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    to_pay: function(a) {
        this.setData({
            toPay: !0
        });
    },
    to_detail_pay: function(a) {
        this.setData({
            toPay: !1
        }), wx.navigateTo({
            url: "/dbs_masclwlcard/pages/order_topay/order_topay?price=" + this.data.M_price + "&shops_num=" + this.data.selected_num + "&shop_name=" + this.data.shops.shop_name + "&o_price=" + this.data.shops.price + "&new_spec=" + this.data.new_spec + "&card_id=" + this.data.card.id + "&shops_id=" + this.data.shops.id
        });
    },
    close_pay: function() {
        this.setData({
            toPay: !1
        });
    },
    reduce: function() {
        var a = this.data.selected_num, t = a <= 1 ? 1 : a - 1, s = this.data.shops.price * t;
        this.setData({
            M_price: s,
            selected_num: t
        });
    },
    plus: function(a) {
        var t = this.data.selected_num, s = this.data.shops.shops_num, e = 0 < s && s <= t ? s : t + 1, i = this.data.shops.price * e;
        this.setData({
            M_price: i,
            selected_num: e
        });
    },
    spec: function(a) {
        var t = a.currentTarget.dataset.index, s = this.data.shops.spec.new_spec;
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
            urls: [ t ]
        });
    },
    from_send: function(a) {},
    goChat: function(a) {
        console.log(this.data.card), wx.navigateTo({
            url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + this.data.card.id
        });
    },
    to_car: function(a) {
        console.log(this.data.card), wx.navigateTo({
            url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + this.data.card.id
        });
    },
    bindgetuserinfoHandler: function(a) {
        var t = this;
        app.util.getUserInfo(function(a) {
            a && a.wxInfo.nickName && t.setData({
                isAuthorize: !1
            });
        });
    }
});