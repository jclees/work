var app = getApp();

Page({
    data: {
        region: [],
        userName: "",
        telNumber: "",
        detailInfo: "",
        loading: !1
    },
    onLoad: function(e) {},
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value
        });
    },
    add_address: function(e) {
        var t = app.siteInfo.uniacid, a = e.detail.value, n = a.detailInfo, o = a.userName, i = a.telNumber, s = e.detail.value.region, d = s[0], c = s[1], l = s[2];
        "" !== o ? "" !== i ? 0 !== s.length ? "" !== n ? 100 < n.length ? wx.showToast({
            title: "不能大于100个字符",
            icon: "none"
        }) : app.util.request({
            url: "entry/wxapp/add_address",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t,
                userName: o,
                telNumber: i,
                provinceName: d,
                cityName: c,
                countyName: l,
                detailInfo: n
            },
            success: function(e) {
                wx.showToast({
                    title: "成功",
                    icon: "success",
                    duration: 2e3,
                    success: function() {
                        wx.redirectTo({
                            url: "/dbs_masclwlcard/pages/myAddr/my_address/index"
                        });
                    }
                });
            },
            fail: function(e) {
                wx.showToast({
                    title: "请求服务器失败，请检查你的网络是否正常",
                    icon: "none",
                    mask: !0
                });
            }
        }) : wx.showToast({
            title: "请输入详细地址",
            icon: "none"
        }) : wx.showToast({
            title: "请选择地区",
            icon: "none"
        }) : wx.showToast({
            title: "请输入手机号码",
            icon: "none"
        }) : wx.showToast({
            title: "请输入联系人",
            icon: "none"
        });
    }
});