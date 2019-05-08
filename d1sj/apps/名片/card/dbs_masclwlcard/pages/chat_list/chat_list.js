function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
        return e;
    }
    return Array.from(t);
}

getApp();

var a = require("../../utils/mbase"), e = require("../../data_file/data_dispose"), i = void require("../../utils/changetime"), r = void 0;

Page({
    data: {},
    onLoad: function(t) {
        r = t.card_id, this.setData({
            card_id: r
        });
    },
    onShow: function() {
        var t = this;
        t.getCardList(), a.setNewMsgLister(function(c) {
            i.forEach(function(t, i) {
                if (c.fromAccount == t.identify) {
                    var r = c.elems[0].content.text, n = a.chageChatData(r);
                    t.chat_count += 1, t.msg = n.msg.context, t.time = e.nowdate(1e3 * c.time, 1);
                }
            }), t.updateListSort(i);
        });
    },
    getCardList: function() {
        var e = this;
        a.initCardHolder(function(t) {
            i = t.data, e.updateListSort(i);
        }, function(t) {
            a.cardHolder(function(t) {
                t.length > i.length && (i = t, e.updateListSort(i));
            });
        });
    },
    go_chat: function(t) {
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.card_id, i = this.data.card_list, r = t.currentTarget.dataset.head_img.split("?")[0], n = t.currentTarget.dataset.identify;
        i[a].chat_count = 0, this.setData({
            card_list: i
        }), wx.navigateTo({
            url: "/pages/chat_detail/chat_detail?card_id=" + e + "&head_img=" + r + "&identify=" + n
        });
    },
    updateListSort: function(a, i) {
        var n = a.filter(function(t) {
            return t.time;
        }), c = a.filter(function(t) {
            return !t.time;
        });
        n.forEach(function(t) {
            var a, i = t.time;
            i.length < 8 && (i = e.nowdate(new Date()) + " " + i), 3 == (a = i.split(":")).length ? t.time = a[0] + ":" + a[1] + ":" + a[2] : t.time = a[0] + ":" + a[1] + ":00";
        });
        var o = n.sort(function(t, a) {
            return new Date("" + t.time.replace(/-/gi, "/")).getTime() > new Date("" + a.time.replace(/-/gi, "/")).getTime() ? -1 : 1;
        }), d = [].concat(t(o), t(c));
        d.forEach(function(t, a) {
            if (0 < t.chat_count) {
                var e = t;
                d.splice(a, 1), d.unshift(e);
            }
        }), d.forEach(function(t, a) {
            t.card_logo = e.imgAddTime(t.card_logo, 80);
            var i = t.time;
            if (i && (/-/gi.test(i) && (i = i.replace(/-/gi, "/")), t.time = e.changeChatTime(new Date(i).getTime() / 1e3)), 
            t.card_id == r) {
                var n = t;
                d.splice(a, 1), d.unshift(n);
            }
            t.card_logo = -1 < t.card_logo.indexOf("?") ? t.card_logo.split("?")[0] : t.card_logo;
        });
        var s = [];
        d.forEach(function(t) {
            0 == t.ishide && s.push(t);
        }), this.setData({
            card_list: s
        });
    },
    noHeadimg: function(t) {
        var e = t.target.dataset.index, i = this.data.card_list;
        i[e].card_logo = a.getNoHeadImage(), this.setData({
            card_list: i
        });
    }
});