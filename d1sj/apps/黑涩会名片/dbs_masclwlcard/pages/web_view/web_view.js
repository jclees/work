var app = getApp(), WxParse = require("../../templates/wxParse.js"),member_id = 0,
  user_flag,
  parent_id;;

Page({
    data: {
        src: ""
    },
    onLoad: function(a) {
      user_flag = wx.getStorageSync("user_flag")
      member_id = wx.getStorageSync("member_id")
      parent_id = wx.getStorageSync("parent_id")
        var t = app.siteInfo.uniacid, e = this;
        wx.setNavigationBarTitle({
            title: "公司动态详情"
        }), app.util.request({
          url: "/network/dynamic",
          data: {
            member_id: user_flag == 0 ? member_id : parent_id
          },
          success: function (d) {
            console.log("展示最新的三条动态")
            console.log(d)
            if (d.data.code == 200) {
              e.setData({
                news: d.data.data
              }), WxParse.wxParse("content", "html", d.data.data[0].intro, e, 0);
            }
          },
          fail: function (res) {
            console.log("数据错误");
            console.log(res);
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
          }
        });
    }
});