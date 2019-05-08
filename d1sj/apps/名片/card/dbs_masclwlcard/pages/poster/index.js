var app = getApp(), P = require("../../config/card.config.js"), v = -1, y = !0, n = wx.createCanvasContext("myCanvas"), h = 0;

Page({
    data: {
        dataLoaded: !1,
        card_detail: [],
        logoOK: !1,
        company_logoOk: !1,
        codepngOk: !1,
        card_logo: ""
    },
    onLoad: function(a) {
        var e = this, n = this, t = app.siteInfo.uniacid;
        app.util.request({
            url: "entry/wxapp/card_poster",
            data: {
                m: "dbs_masclwlcard",
                uniacid: t,
                card_id: a.card_id
            },
            success: function(a) {
                e.setData({
                    card_detail: a.data.data
                }), wx.getImageInfo({
                    src: e.data.card_detail.card_logo,
                    success: function(a) {
                        e.setData({
                            card_logo: a.path,
                            logoOK: !0
                        });
                    },
                    fail: function() {
                        e.setData({
                            failPoster: !0
                        });
                    }
                }), wx.getImageInfo({
                    src: e.data.card_detail.base.company_logo,
                    success: function(a) {
                        e.setData({
                            company_logo: a.path,
                            company_logoOk: !0
                        });
                    },
                    fail: function() {
                        e.setData({
                            failPoster: !0
                        });
                    }
                }), wx.getImageInfo({
                    src: e.data.card_detail.codepng,
                    success: function(a) {
                        e.setData({
                            codepng: a.path,
                            codepngOk: !0
                        });
                    },
                    fail: function() {
                        e.setData({
                            failPoster: !0
                        });
                    }
                }), n.geTstatus();
            },
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    geTstatus: function() {
        var a = this;
        return h += 1, 1 == this.data.failPoster ? (wx.hideLoading(), void wx.showToast({
            title: "生成失败,请稍后再试",
            icon: "none",
            duration: 2e3
        })) : 0 == this.data.company_logoOk || 0 == this.data.card_logo || 0 == this.data.codepngOk ? 3 < h ? (wx.hideLoading(), 
        wx.showToast({
            title: "网络过慢,稍后再试",
            icon: "none",
            duration: 2e3
        }), !1) : void setTimeout(function() {
            a.geTstatus();
        }, 3e3) : void a.gEt();
    },
    gEt: function() {
        var a = this, e = this, t = e.data.card_detail.detailed_address;
        if (n.setFillStyle("#F6F6F6"), n.fillRect(a.changePx(0), a.changePx(0), a.changePx(375), a.changePx(850)), 
        n.setFillStyle("#ffffff"), n.fillRect(a.changePx(25), a.changePx(25), a.changePx(300), a.changePx(850)), 
        n.drawImage(e.data.card_logo, a.changePx(25), a.changePx(25), a.changePx(300), a.changePx(300)), 
        n.setFillStyle("#222222"), n.setTextAlign("left"), n.font = "normal normal 16rpx PingFangSC-Medium", 
        n.fillText(e.data.card_detail.card_name, a.changePx(40), a.changePx(350)), n.setFillStyle("#888888"), 
        n.font = "normal normal 11rpx PingFangSC-Regular", n.fillText(e.data.card_detail.role_name, a.changePx(40), a.changePx(369)), 
        n.drawImage(e.data.company_logo, a.changePx(265), a.changePx(336), a.changePx(35), a.changePx(35)), 
        n.setStrokeStyle("#F2F2F2"), n.setLineWidth(a.changePx(.5)), n.beginPath(), n.moveTo(a.changePx(25), a.changePx(393)), 
        n.lineTo(a.changePx(310), a.changePx(393)), n.closePath(), n.drawImage(e.data.codepng, a.changePx(245), a.changePx(405), a.changePx(64), a.changePx(64)), 
        n.drawImage("../../imagesv1/tel.png", a.changePx(40), a.changePx(421), a.changePx(15), a.changePx(15)), 
        n.setStrokeStyle("#888888"), n.font = "normal normal 11rpx PingFangSC-Regular", 
        n.fillText(e.data.card_detail.card_tel, a.changePx(66), a.changePx(436)), n.drawImage("../../imagesv1/email.png", a.changePx(40), a.changePx(434), a.changePx(15), a.changePx(15)), 
        n.setStrokeStyle("#888888"), n.font = "normal normal 11rpx PingFangSC-Regular", 
        n.fillText(e.data.card_detail.weixinid, a.changePx(66), a.changePx(449)), n.drawImage("../../imagesv1/addr.png", a.changePx(40), a.changePx(450), a.changePx(15), a.changePx(15)), 
        n.font = "normal normal 10rpx PingFangSC-Regular", t.length <= 15) n.fillText(t, a.changePx(66), a.changePx(465)); else if (15 < t.length && t.length <= 30) {
            var c = t.substring(0, 15), o = t.substring(15, t.length);
            n.fillText(c, a.changePx(66), a.changePx(461)), n.fillText(o, a.changePx(66), a.changePx(480));
        } else if (30 <= t.length) {
            var i = t.substring(0, 15), g = t.substring(15, 30) + "...";
            n.fillText(i, a.changePx(66), a.changePx(461)), n.fillText(g, a.changePx(66), a.changePx(480));
        }
        n.draw(), this.setData({
            dataLoaded: !0
        }), e.report(659, e.data.card_detail.id, 0);
    },
    changePx: function(a) {
        return a * wx.getSystemInfoSync().windowWidth / 375;
    },
    report: function(a, e, n) {
        app.util.request({
            url: "entry/wxapp/report",
            data: {
                m: "dbs_masclwlcard",
                uniacid: app.siteInfo.uniacid,
                card_id: e,
                act_id: a,
                copytype: n
            },
            success: function(a) {},
            fail: function(a) {
                console.log("this is a test2");
            }
        });
    },
    savePoster: function() {
        var t = this;
        wx.canvasToTempFilePath({
            canvasId: "myCanvas",
            success: function(e) {
                var n = e.tempFilePath;
                console.log(n), wx.getSetting({
                    success: function(a) {
                        console.log(a.authSetting), console.log(a.authSetting["scope.writePhotosAlbum"]), 
                        0 == a.authSetting["scope.writePhotosAlbum"] ? wx.openSetting({
                            success: function(a) {
                                wx.hideLoading();
                            }
                        }) : wx.saveImageToPhotosAlbum({
                            filePath: e.tempFilePath,
                            success: function(a) {
                                setTimeout(function() {
                                    wx.hideLoading();
                                }), wx.showModal({
                                    title: "保存海报成功",
                                    content: "名片海报已保存到手机相册",
                                    showCancel: !1,
                                    success: function() {
                                        wx.previewImage({
                                            urls: [ n ]
                                        });
                                    }
                                }), t.report(660, t.data.card_detail.id, 0);
                            },
                            fail: function(a) {
                                setTimeout(function() {
                                    wx.hideLoading(), wx.showToast({
                                        title: "失败,请稍后再试",
                                        icon: "none",
                                        duration: 2e3
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});