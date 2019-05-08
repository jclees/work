var util = require("we7/resource/js/util.js");

App({
    onLaunch: function(o) {},
    onShow: function(o) {},
    onHide: function() {},
    onError: function(o) {
        console.log(o);
    },
    util: util,
    userInfo: {
        sessionid: null
    },
    globalData: {
        userInfo: null,
        addres: [],
        order_complete: []
    },
    siteInfo: require("siteinfo.js")
});