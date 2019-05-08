var app = getApp();

Page({
    data: {
        region: [],
        dataLoaded: !1,
        userName: "",
        telNumber: "",
        detailInfo: "",
        isSubmit: !1,
        address_id: ""
    },
    onLoad: function(t) {
        this.setData({
            address_id: t.address_id
        }), this.getInfo(t);
    },
    getInfo: function(t) {
        var e = [];
        e.push(t.provinceName), e.push(t.cityName), e.push(t.countyName), this.setData({
            dataLoaded: !0,
            region: e,
            userName: t.userName,
            telNumber: t.telNumber,
            detailInfo: t.detailInfo,
            isSubmit: !0
        });
    },
    bindRegionChange: function(t) {
        this.setData({
            region: t.detail.value
        }), this.checkIsSubmit();
    },
    userName: function(t) {
        this.setData({
            userName: t.detail.value
        }), this.checkIsSubmit();
    },
    telNumber: function(t) {
        this.setData({
            telNumber: t.detail.value
        }), this.checkIsSubmit();
    },
    detailInfo: function(t) {
        this.setData({
            detailInfo: t.detail.value
        }), this.checkIsSubmit();
    },
    checkIsSubmit: function() {
        0 == this.data.region.length || "" == this.userName.userName || "" == this.data.telNumber || "" == this.data.detailInfo ? this.setData({
            isSubmit: !1
        }) : this.setData({
            isSubmit: !0
        });
    },
    edit_ok: function() {
        var t = app.siteInfo.uniacid, e = this;
        "" != this.data.userName ? "" != this.data.telNumber ? 0 != this.data.region.length ? "" != this.data.detailInfo ? 11 == this.data.telNumber.length && 0 != /^[0-9]*$/.test(this.data.telNumber) ? app.util.request({
            url: "entry/wxapp/edit_address",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t,
                userName: e.data.userName,
                telNumber: e.data.telNumber,
                provinceName: e.data.region[0],
                cityName: e.data.region[1],
                countyName: e.data.region[2],
                detailInfo: e.data.detailInfo,
                address_id: e.data.address_id
            },
            success: function(t) {
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
            fail: function(t) {
                console.log("this is a test2");
            }
        }) : wx.showToast({
            title: "请输入11位数字的手机号",
            icon: "none",
            duration: 2e3
        }) : wx.showToast({
            title: "地址不能为空",
            icon: "none",
            duration: 2e3
        }) : wx.showToast({
            title: "省市区不能为空",
            icon: "none",
            duration: 2e3
        }) : wx.showToast({
            title: "手机号不能为空",
            icon: "none",
            duration: 2e3
        }) : wx.showToast({
            title: "用户名不能为空",
            icon: "none",
            duration: 2e3
        });
    }
});