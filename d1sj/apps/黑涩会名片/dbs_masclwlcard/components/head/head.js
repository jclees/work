Component({
    properties: {
        statusBcg: {
            type: String,
            value: "#fff"
        },
        navTitle: {
            type: String,
            value: "标题"
        },
        navBcg: {
            type: String,
            value: "#fff"
        },
        navcolor: {
            type: String,
            value: "#000"
        },
        newwechat: {
            type: Number,
            value: 1
        },
        hasgoback: {
            type: Boolean,
            value: !1
        },
        optionsnav: {
            type: Boolean,
            value: !0
        }
    },
    data: {
        statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    },
    methods: {
        _goback: function() {
            this.triggerEvent("goback");
        },
        goback: function() {
            wx.navigateBack();
        }
    }
});