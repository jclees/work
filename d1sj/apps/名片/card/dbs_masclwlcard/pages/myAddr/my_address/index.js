var app = getApp();

Page({
    data: {
        address_list: [],
        dataLoaded: !1,
        settings: !1
    },
    onLoad: function(s) {
        s && this.setData({
            settings: "true" === s.settings
        });
    },
    onShow: function() {
        this.getAddressList();
    },
    chooseAddress: function(s) {
        if (this.data.settings) {
            var t = s.currentTarget.dataset.index, a = this.data.address_list[t];
            app.globalData.addres.address_id = a.id, app.globalData.addres.telNumber = a.telNumber, 
            app.globalData.addres.userName = a.userName, app.globalData.addres.address = "" + a.provinceName + a.cityName + a.countyName + a.detailInfo, 
            wx.navigateBack();
        }
    },
    getAddressList: function() {
        var s = app.siteInfo.uniacid, t = this;
        app.util.request({
            url: "entry/wxapp/address_list",
            data: {
                m: "dbs_masclwlcard",
                uniacid: s
            },
            success: function(s) {
                t.setData({
                    address_list: s.data.data,
                    dataLoaded: !0
                });
            },
            fail: function(s) {
                console.log("this is a test2");
            }
        });
    },
    set_address: function(s) {
        var t = this, a = app.siteInfo.uniacid, e = s.currentTarget.dataset.addressid;
        app.util.request({
            url: "entry/wxapp/set_address",
            data: {
                m: "dbs_masclwlcard",
                uniacid: a,
                address_id: e
            },
            success: function(s) {
                console.log(s), wx.showToast({
                    title: "设置成功",
                    icon: "none",
                    success: function() {
                        t.getAddressList();
                    }
                });
            },
            fail: function(s) {
                wx.showToast({
                    title: "请求服务器失败，请检查你的网络是否正常",
                    icon: "none",
                    mask: !0
                });
            }
        });
    },
    del_address: function(a) {
        var e = app.siteInfo.uniacid, d = this;
        wx.showModal({
            title: "提示",
            content: "是否删除该地址",
            success: function(s) {
                if (s.confirm) {
                    wx.showLoading({
                        title: "加载中"
                    });
                    var t = a.currentTarget.dataset.addressid;
                    app.util.request({
                        url: "entry/wxapp/del_address",
                        data: {
                            m: "dbs_masclwlcard",
                            uniacid: e,
                            address_id: t
                        },
                        success: function(s) {
                            wx.hideLoading(), wx.showToast({
                                title: "删除成功",
                                icon: "none",
                                success: function() {
                                    d.getAddressList();
                                }
                            });
                        },
                        fail: function(s) {
                            wx.hideLoading(), wx.showToast({
                                title: "请求服务器失败，请检查你的网络是否正常",
                                icon: "none",
                                mask: !0
                            });
                        }
                    });
                }
            }
        });
    },
    edit_address: function(s) {
        var t = s.currentTarget.dataset.index, a = this.data.address_list[t], e = a.id, d = a.provinceName, i = a.cityName, n = a.countyName, o = a.detailInfo, c = a.telNumber, r = a.userName;
        wx.navigateTo({
            url: "/dbs_masclwlcard/pages/myAddr/edit_address/index?address_id=" + e + "&detailInfo=" + o + "&telNumber=" + c + "&userName=" + r + "&provinceName=" + d + "&cityName=" + i + "&countyName=" + n
        });
    },
    wechatAddress: function() {
        var t = this;
        wx.showLoading({
            title: "加载中",
            mask: !0
        }), wx.getSetting({
            success: function(s) {
                wx.hideLoading(), s.authSetting["scope.address"] ? t.AddtoweChat() : wx.authorize({
                    scope: "scope.address",
                    success: function() {
                        t.AddtoweChat();
                    },
                    fail: function() {
                        wx.showModal({
                            title: "提示",
                            content: "您还没授权地址，点击确认去开启",
                            success: function(s) {
                                s.confirm && wx.openSetting();
                            }
                        });
                    },
                    complete: function() {}
                });
            }
        });
    },
    AddtoweChat: function() {
        var a = this, e = app.siteInfo.uniacid;
        wx.chooseAddress({
            success: function(s) {
                var t = {
                    m: "dbs_masclwlcard",
                    uniacid: e,
                    userName: s.userName,
                    telNumber: s.telNumber,
                    provinceName: s.provinceName,
                    cityName: s.cityName,
                    countyName: s.countyName,
                    detailInfo: s.detailInfo
                };
                a.add_address(t);
            }
        });
    },
    add_address: function(s) {
        app.siteInfo.uniacid;
        var t = this;
        app.util.request({
            url: "entry/wxapp/add_address",
            data: s,
            success: function(s) {
                wx.showToast({
                    title: "添加成功",
                    icon: "none",
                    success: function() {
                        t.getAddressList();
                    }
                });
            },
            fail: function(s) {
                wx.showToast({
                    title: "请求服务器失败，请检查你的网络是否正常",
                    icon: "none",
                    mask: !0
                });
            }
        });
    }
});