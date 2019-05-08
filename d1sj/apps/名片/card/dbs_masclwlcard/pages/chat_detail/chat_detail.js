var app = getApp(), P = require("../../config/card.config.js"), v = -1, y = !0, h = 0, M = 0;

Page({
    data: {
        inputValue: "",
        returnValue: "",
        addImg: !1,
        card_detail: [],
        fromid: "",
        toView: "",
        allContentList: [],
        i_time: "",
        num: 0
    },
    onLoad: function(t) {
        var e = this;
      debugger
        app.util.request({
            url: "entry/wxapp/chat_detail_h",
            data: {
                m: "dbs_masclwlcard",
                uniacid: app.siteInfo.uniacid,
                card_id: t.card_id
            },
            success: function(t) {
              console.log(t)
                if (e.setData({
                    card_detail: t.data.data
                }), e.data.card_detail.msg) {
                    for (var a in e.data.card_detail.msg) {
                        1 <= e.data.card_detail.msg[a].is_send ? e.data.allContentList.push({
                            is_ai: !0,
                            text: e.data.card_detail.msg[a].msg,
                            id: e.data.card_detail.msg[a].id
                        }) : e.data.allContentList.push({
                            id: e.data.card_detail.msg[a].id,
                            is_my: {
                                text: e.data.card_detail.msg[a].msg
                            }
                        }), e.setData({
                            allContentList: e.data.allContentList
                        });
                    }
                    var i = e.data.card_detail.msg[e.data.card_detail.msg.length - 1];
                    setTimeout(function() {
                        e.setData({
                            toView: "uid_" + i.id
                        });
                    }, 100);
                }
              debugger
                var d = setInterval(function() {
                    e.record(e.data.card_detail.card.id);
                }, 1e3);
                e.setData({
                    i_time: d
                });
            },
            fail: function(t) {
                console.log("this is a test2");
            }
        }), e.report(701, t.card_id, 0);
    },
    report: function(t, a, i, d) {
        app.util.request({
            url: "entry/wxapp/report",
            data: {
                m: "dbs_masclwlcard",
                uniacid: app.siteInfo.uniacid,
                card_id: a,
                act_id: t,
                copytype: i,
                formId: d
            },
            success: function(t) {},
            fail: function(t) {
                console.log("this is a test2");
            }
        });
    },
    record: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/chat_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: app.siteInfo.uniacid,
                card_id: t,
                fromid: a.data.fromid
            },
            success: function(t) {
                t.data.data.msg && (a.data.allContentList.push({
                    is_ai: !0,
                    text: t.data.data.msg,
                    id: t.data.data.id
                }), a.setData({
                    allContentList: a.data.allContentList
                }), setTimeout(function() {
                    a.setData({
                        toView: "uid_" + t.data.data.id
                    });
                }, 100));
            },
            fail: function(t) {
                console.log("this is a test2");
            }
        });
    },
    _callPhone: function(t) {
        var a = t.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    onShow: function(t) {},
    onReady: function() {},
    from_send: function(t) {
        var a = this, i = a.data.inputValue;
        a.report(708, a.data.card_detail.card.id, i, t.detail.formId), this.data.allContentList.push({
            id: M,
            is_my: {
                text: this.data.inputValue
            }
        }), setTimeout(function() {
            a.setData({
                toView: "uid_" + M
            }), M -= 1;
        }, 100), this.setData({
            allContentList: this.data.allContentList,
            inputValue: ""
        }), a.bottom();
    },
    bindKeyInput: function(t) {
        this.setData({
            inputValue: t.detail.value
        });
    },
    onUnload: function() {
        clearInterval(this.data.i_time);
    },
    onHide: function() {
        clearInterval(this.data.i_time);
    },
    bottom: function() {
        this.setData({});
    }
});