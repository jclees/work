var app = getApp(),
member_id=0;

Page({
    data: {
        address_list: [],
        // dataLoaded: !1,
        settings: !1
    },
    onLoad: function(s) {
        s && this.setData({
            settings: "true" === s.settings
        });
      member_id = wx.getStorageSync("member_id")
    },
    onShow: function() {
        this.getAddressList();
    },
    chooseAddress: function(s) {
        if (this.data.settings) {
            var t = s.currentTarget.dataset.index, a = this.data.address_list[t];
          app.globalData.addres.address_id = a.id, app.globalData.addres.telNumber = a.contact_phone, 
            app.globalData.addres.userName = a.contact_name, app.globalData.addres.address = "" + a.province + a.city + a.district + a.address, 
            wx.navigateBack();
        }
    },
    getAddressList: function() {
        var t = this;
        app.util.request({
          url: "/address/getaddress",
            data: {
              member_id: member_id
            },
            success: function(s) {
              console.log("收货地址列表")
              console.log(s)
                t.setData({
                  address_list: s.data.data,
                });
            },
            fail: function(s) {
                console.log("this is a test2");
            }
        });
    },
    set_address: function(s) {
      var t = this, e = s.currentTarget.dataset.addressid, d = s.currentTarget.dataset.defaddress;
      d == 1 ? d = 0 : d=1
        app.util.request({
          url: "/address/defaultaddress",
            data: {
              member_id:member_id,
              default_address:d,
              address_id: e
            },
            success: function(s) {
              console.log("设置默认收货")
              console.log(s)
              if (s.data.code == 1001){
                wx.showToast({
                  title: "设置失败",
                  icon: "none"
                });
              }else{
                wx.showToast({
                  title: "设置成功",
                  icon: "none",
                  success: function () {
                    t.getAddressList();
                  }
                });
              }
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
                      url: "/address/deladdress",
                        data: {
                            address_id: t
                        },
                        success: function(s) {
                          console.log("删除")
                          console.log(s)
                          if(s.data.code == 200){
                            wx.hideLoading(), wx.showToast({
                              title: "删除成功",
                              icon: "none",
                              success: function () {
                                d.getAddressList();
                              }
                            });
                          }
                            
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
      var t = s.currentTarget.dataset.index, a = this.data.address_list[t], e = a.id, d = a.province, i = a.city, n = a.district, o = a.address, c = a.contact_phone, r = a.contact_name;
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
        var a = this;
        wx.chooseAddress({
            success: function(s) {
              console.log(s)
                var t = {
                  member_id: member_id,
                  contact_name: s.userName,
                  contact_phone: s.telNumber,
                  province: s.provinceName,
                  city: s.cityName,
                  district: s.countyName,
                  address: s.detailInfo,
                  zip: s.postalCode
                };
                a.add_address(t);
            }
        });
    },
    add_address: function(s) {
      debugger
        var t = this;
        app.util.request({
          url: "/address/addaddress",
            data: s,
          method: "POST",
            success: function(s) {
              console.log("添加地址")
              console.log(s)
              if(s.data.code == 200){
                wx.showToast({
                  title: "添加成功",
                  icon: "none",
                  success: function () {
                    t.getAddressList();
                  }
                });
              }
               
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