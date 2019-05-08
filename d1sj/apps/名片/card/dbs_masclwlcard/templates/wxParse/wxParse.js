function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function t(e) {
    var t = e.target.dataset.src, a = e.target.dataset.from;
    void 0 !== a && 0 < a.length && wx.previewImage({
        current: t,
        urls: this.data[a].imageUrls
    });
}

function a(e) {
    var t = e.target.dataset.from, a = e.target.dataset.idx;
    void 0 !== t && 0 < t.length && i(e, a, this, t);
}

function i(e, t, a, i) {
    var n = a.data[i];
    if (0 != n.images.length) {
        var d = n.images, o = r(e.detail.width, e.detail.height, a, i);
        d[t].width = o.imageWidth, d[t].height = o.imageheight, n.images = d;
        var s = {};
        s[i] = n, a.setData(s);
    }
}

function r(a, i, r, n) {
    var d = 0, o = 0, s = 0, g = {};
    return wx.getSystemInfo({
        success: function(e) {
            var t = r.data[n].view.imagePadding;
            d = e.windowWidth - 2 * t, e.windowHeight, d < a ? (o = d, console.log("autoWidth" + o), 
            s = o * i / a, console.log("autoHeight" + s), g.imageWidth = o, g.imageheight = s) : (g.imageWidth = a, 
            g.imageheight = i);
        }
    }), g;
}

var d = e(require("./showdown.js")), n = e(require("./html2json.js"));

module.exports = {
    wxParse: function() {
        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "wxParseData", i = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "html", r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : '<div class="color:red;">数据不能为空</div>', o = arguments[3], s = arguments[4], g = o, h = {};
        if ("html" == i) h = n.default.html2json(r, e); else if ("md" == i || "markdown" == i) {
            var l = new d.default.Converter().makeHtml(r);
            h = n.default.html2json(l, e);
        }
        h.view = {}, void (h.view.imagePadding = 0) !== s && (h.view.imagePadding = s);
        var m = {};
        m[e] = h, g.setData(m), g.wxParseImgLoad = a, g.wxParseImgTap = t;
    },
    wxParseTemArray: function(e, t, a, i) {
        for (var r = [], n = i.data, d = null, o = 0; o < a; o++) {
            var s = n[t + o].nodes;
            r.push(s);
        }
        e = e || "wxParseTemArray", (d = JSON.parse('{"' + e + '":""}'))[e] = r, i.setData(d);
    },
    emojisInit: function() {
        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "", t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", a = arguments[2];
        n.default.emojisInit(e, t, a);
    }
};