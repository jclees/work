var app = getApp();

Page({
    data: {
        src: "",
        product: [],
        top: -300
    },
    onLoad: function(a) {
        var t = app.siteInfo.uniacid, d = this;
        wx.setNavigationBarTitle({
            title: "产品详情"
        }), app.util.request({
            url: "entry/wxapp/product_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t,
                product_id: a.product_id,
                card_id: a.card_id
            },
            success: function(a) {
                d.setData({
                    product: a.data.data
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
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
        wx.navigateTo({
            url: "/dbs_masclwlcard/pages/chat_detail/chat_detail?card_id=" + this.data.product.card_id
        });
    },
    onShareAppMessage: function() {
        var a = this;
        return {
            title: a.data.product.cp_bs_name,
            imageUrl: a.data.product.cp_bs_img[0],
            path: "/dbs_masclwlcard/pages/product_detail2/product_detail2?card_id=" + a.data.product.card_id + "&product_id=" + a.data.product.id
        };
    }
});