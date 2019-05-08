var app = getApp(), WxParse = require("../../templates/wxParse.js");

Page({
    data: {
        src: ""
    },
    onLoad: function(a) {
        var t = app.siteInfo.uniacid, e = this;
        wx.setNavigationBarTitle({
            title: "公司动态详情"
        }), app.util.request({
            url: "entry/wxapp/news_detail",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t,
                news_id: a.dyId
            },
            success: function(a) {
                e.setData({
                    news: a.data.data
                }), WxParse.wxParse("content", "html", a.data.data.content, e, 0);
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    }
});