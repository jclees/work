var a = getApp();

Page({
    data: {
        orderNo: "",
        price: 0,
        userName: "",
        address: "",
        telNumber: "",
        cardId: ""
    },
    onLoad: function(r) {
        var e = a.globalData.order_complete, d = e.orderNo, t = e.price, o = e.userName, s = e.address, c = e.telNumber;
        this.setData({
            orderNo: d,
            price: t,
            userName: o,
            address: s,
            card_id: e.card_id,
            telNumber: c
        });
    },
    goToOrderDetail: function() {
        wx.redirectTo({
            url: "/dbs_masclwlcard/pages/order_list/order_list"
        });
    },
    goToTab: function() {
        wx.redirectTo({
            url: "/dbs_masclwlcard/pages/tab/tab?card_id=" + this.data.card_id + "&nav_footer_active=1"
        });
    }
});