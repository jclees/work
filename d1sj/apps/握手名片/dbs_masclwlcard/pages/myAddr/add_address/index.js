var app = getApp(),
member_id=0;

Page({
    data: {
        region: [],
        userName: "",
        telNumber: "",
        detailInfo: "",
        loading: !1
    },
    onLoad: function(e) {
      member_id = wx.getStorageSync("member_id")
    },
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value
        });
    },
    add_address: function(e) {
        var  a = e.detail.value, n = a.detailInfo, o = a.userName, i = a.telNumber, s = e.detail.value.region, d = s[0], c = s[1], l = s[2];
        "" !== o ? "" !== i ? 0 !== s.length ? "" !== n ? 100 < n.length ? wx.showToast({
            title: "不能大于100个字符",
            icon: "none"
        }) : app.util.request({
            url: "/address/addaddress",
            data: {
              member_id: member_id,
              contact_name: o,
              contact_phone: i,
              province: d,
              city: c,
              district: l,
              address: n,
              zip:""
            },
            method: "POST",
            success: function(e) {
              console.log("添加地址")
              console.log(e)
              if(e.data.code == 200){
                wx.showToast({
                  title: "成功",
                  icon: "success",
                  duration: 2e3,
                  success: function () {
                    wx.navigateBack({
                      delta:1
                    })
                  }
                });
              }
                
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