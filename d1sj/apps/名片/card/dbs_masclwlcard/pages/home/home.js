var app = getApp();

Page({
    data: {
        src: "",
        dataLoaded: !1,
        detail: []
    },
    onLoad: function(a) {
        var t = app.siteInfo.uniacid, d = this;
        app.util.request({
            url: "entry/wxapp/home",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t
            },
            success: function(a) {
                d.setData({
                    detail: a.data.data,
                    dataLoaded: !0
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    jump_url: function(a) {
        var t = a.currentTarget.dataset.url;
        wx.navigateTo({
            url: t
        });
    },
    addaddress: function(a) {
        console.log(a);
        this.setData({
            detail: a,
            dataLoaded: !0
        });
    }
});