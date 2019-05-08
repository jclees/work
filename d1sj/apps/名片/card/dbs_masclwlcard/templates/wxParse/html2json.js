function e(e) {
    for (var t = {}, r = e.split(","), s = 0; s < r.length; s++) t[r[s]] = !0;
    return t;
}

function t(e) {
    return e.replace(/<\?xml.*\?>\n/, "").replace(/<.*!doctype.*\>\n/, "").replace(/<.*!DOCTYPE.*\>\n/, "");
}

function r(e) {
    var t = [];
    if (0 == a.length || !n) return (d = {}).node = "text", d.text = e, [ d ];
    e = e.replace(/\[([^\[\]]+)\]/g, ":$1:");
    for (var r = new RegExp("[:]"), s = e.split(r), i = 0; i < s.length; i++) {
        var l = s[i], d = {};
        n[l] ? (d.node = "element", d.tag = "emoji", d.text = n[l], d.baseSrc = o) : (d.node = "text", 
        d.text = l), t.push(d);
    }
    return t;
}

var s = "https", a = "", o = "", n = {}, i = require("./wxDiscode.js"), l = require("./htmlparser.js"), d = (e("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"), 
e("br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video")), c = e("abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"), u = e("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

e("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), 
e("wxxxcode-style,script,style,view,scroll-view,block"), module.exports = {
    html2json: function(e, h) {
        e = t(e), e = i.strDiscode(e);
        var g = [], v = {
            node: h,
            nodes: [],
            images: [],
            imageUrls: []
        };
        return l(e, {
            start: function(e, t, r) {
                var a = {
                    node: "element",
                    tag: e
                };
                if (d[e] ? a.tagType = "block" : c[e] ? a.tagType = "inline" : u[e] && (a.tagType = "closeSelf"), 
                0 !== t.length && (a.attr = t.reduce(function(e, t) {
                    var r = t.name, s = t.value;
                    return "class" == r && (a.classStr = s), "style" == r && (a.styleStr = s), s.match(/ /) && (s = s.split(" ")), 
                    e[r] ? Array.isArray(e[r]) ? e[r].push(s) : e[r] = [ e[r], s ] : e[r] = s, e;
                }, {})), "img" === a.tag) {
                    a.imgIndex = v.images.length;
                    var o = a.attr.src;
                    o = i.urlToHttpUrl(o, s), a.attr.src = o, a.from = h, v.images.push(a), v.imageUrls.push(o);
                }
                if ("font" === a.tag) {
                    var n = [ "x-small", "small", "medium", "large", "x-large", "xx-large", "-webkit-xxx-large" ], l = {
                        color: "color",
                        face: "font-family",
                        size: "font-size"
                    };
                    for (var p in a.attr.style || (a.attr.style = []), a.styleStr || (a.styleStr = ""), 
                    l) if (a.attr[p]) {
                        var m = "size" === p ? n[a.attr[p] - 1] : a.attr[p];
                        a.attr.style.push(l[p]), a.attr.style.push(m), a.styleStr += l[p] + ": " + m + ";";
                    }
                }
                if ("source" === a.tag && (v.source = a.attr.src), r) {
                    var f = g[0] || v;
                    void 0 === f.nodes && (f.nodes = []), f.nodes.push(a);
                } else g.unshift(a);
            },
            end: function(e) {
                var t = g.shift();
                if (t.tag !== e && console.error("invalid state: mismatch end tag"), "video" === t.tag && v.source && (t.attr.src = v.source, 
                delete result.source), 0 === g.length) v.nodes.push(t); else {
                    var r = g[0];
                    void 0 === r.nodes && (r.nodes = []), r.nodes.push(t);
                }
            },
            chars: function(e) {
                var t = {
                    node: "text",
                    text: e,
                    textArray: r(e)
                };
                if (0 === g.length) v.nodes.push(t); else {
                    var s = g[0];
                    void 0 === s.nodes && (s.nodes = []), s.nodes.push(t);
                }
            },
            comment: function(e) {}
        }), v;
    },
    emojisInit: function() {
        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "", t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", r = arguments[2];
        a = e, o = t, n = r;
    }
};