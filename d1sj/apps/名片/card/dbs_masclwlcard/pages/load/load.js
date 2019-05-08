var app = getApp();

Page({
    data: {
        openOptions: [],
        newSdk: [],
        dataLoaded: !1,
        friend_list: [],
        allCompanyDetail: {}
    },
    onLoad: function(a) {
        var t = app.siteInfo.uniacid, n = this;
        app.util.request({
            url: "entry/wxapp/card",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t
            },
            success: function(a) {
                a && a.data && a.data.data && n.setData({
                    friend_list: a.data.data
                }), n.setData({
                    dataLoaded: !0
                });
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    optionsCard: function(a) {},
    send_form: function(a) {
        a.detail.formId;
    },
    go_tab: function(a) {
        var t = a.currentTarget.dataset.card_id;
        wx.reLaunch({
            url: "/dbs_masclwlcard/pages/tab/tab?card_id=" + t
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});