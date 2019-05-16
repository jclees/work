function e(e) {
	return e && e.__esModule ? e : {
	default:
		e
	}
}
function t() {
	var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "wxParseData",
	t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "html",
	o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '<div class="color:red;">数据不能为空</div>',
	n = arguments[3],
	r = arguments[4],
	s = n,
	d = {};
	if ("html" == t)
		d = h.default.html2json(o, e)//, console.log(JSON.stringify(d, " ", " "));
			else if ("md" == t || "markdown" == t) {
				var l = new g.default.Converter, m = l.makeHtml(o);
					d = h.default.html2json(m, e)//, console.log(JSON.stringify(d, " ", " "))
			}
			d.view = {}, d.view.imagePadding = 0, void 0 !== r && (d.view.imagePadding = r);
			var v = {};
			v[e] = d, s.setData(v), s.wxParseImgLoad = i, s.wxParseImgTap = a
}
function a(e) {
	var t = this,
	a = e.target.dataset.src,
	i = e.target.dataset.from;
	void 0 !== i && i.length > 0 && wx.previewImage({
		current : a,
		urls : t.data[i].imageUrls
	})
}
function i(e) {
	var t = this,
	a = e.target.dataset.from,
	i = e.target.dataset.idx;
	void 0 !== a && a.length > 0 && o(e, i, t, a)
}
function o(e, t, a, i) {
	var o = a.data[i];
	if (o && 0 != o.images.length) {
		var r = o.images,
		s = n(e.detail.width, e.detail.height, a, i);
		r[t].width = s.imageWidth,
		r[t].height = s.imageheight,
		o.images = r;
		var d = {};
		d[i] = o,
		a.setData(d)
	}
}
function n(e, t, a, i) {
	var o = 0,
	n = 0,
	r = 0,
	s = 0,
	d = {};
	return wx.getSystemInfo({
		success : function (g) {
			var l = a.data[i].view.imagePadding;
			o = g.windowWidth - 2 * l,
			n = g.windowHeight,
			console.log("windowWidth" + o),
			e > o ? (r = o, console.log("autoWidth" + r), s = r * t / e, console.log("autoHeight" + s), d.imageWidth = r, d.imageheight = s) : (d.imageWidth = e, d.imageheight = t)
		}
	}),
	d
}
function r(e, t, a, i) {
	for (var o = [], n = i.data, r = null, s = 0; s < a; s++) {
		var d = n[t + s].nodes;
		o.push(d)
	}
	e = e || "wxParseTemArray",
	r = JSON.parse('{"' + e + '":""}'),
	r[e] = o,
	i.setData(r)
}
function s() {
	var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
	t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/",
	a = arguments[2];
	h.default.emojisInit(e, t, a)
}
var d = require("./showdown.js"), g = e(d), l = require("./html2json.js"), h = e(l);
module.exports = {
	wxParse : t,
	wxParseTemArray : r,
	emojisInit : s
}
