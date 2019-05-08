var wx_t = require("../../templates/wxParse.js"), app = getApp();

Page({
    data: {
        src: "",
        friend: [],
        top: -300
    },
    onLoad: function(a) {
        var t = app.siteInfo.uniacid, e = this;
        wx.setNavigationBarTitle({
            title: "动态"
        }), app.util.request({
            url: "entry/wxapp/friend_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t,
                friend_id: a.friend_id,
                card_id: a.card_id
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    friend: t
                }), t.content && wx_t.wxParse("article", "html", t.content, e, 0);
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
    onShareAppMessage: function() {
        var a = this;
        return {
            title: a.data.friend.title,
            imageUrl: a.data.friend.head_img,
            path: "/dbs_masclwlcard/pages/friend_detail/friend_detail?card_id=" + a.data.friend.card_id + "&friend_id=" + a.data.friend.id
        };
    }
});