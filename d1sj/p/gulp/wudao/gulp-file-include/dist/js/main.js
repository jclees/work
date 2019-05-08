
var openStatus = true,
    initIntro = '环球舞蹈大赛本着"公平、公正、公开"的原则，面向全国舞蹈工作室的广大舞蹈爱好者，为我们的明日之星搭建自我展示的平台。通过参与环球舞蹈大赛，展示仙女和王子们的舞蹈成果....';
function openIntro(t) {
    if (openStatus) {
        openStatus = false
        $(t).siblings("p").text('环球舞蹈大赛本着"公平、公正、公开"的原则，面向全国舞蹈工作室的广大舞蹈爱好者，为我们的明日之星搭建自我展示的平台。通过参与环球舞蹈大赛，展示仙女和王子们的舞蹈成果，提高每一位参赛者的自信心及团队凝聚力，丰富家庭精神生活，并且提高广大舞蹈工作室的国际知名度。')
        $(t).children(".txt").text("收起")
        $(t).children(".glyphicon").attr("class", "glyphicon glyphicon-menu-up")
    } else {
        openStatus = true
        $(t).siblings("p").text(initIntro)
        $(t).children(".txt").text("展开")
        $(t).children(".glyphicon").attr("class", "glyphicon glyphicon-menu-down")
    }
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


$(".tabs > li").on("click", function () {
    var idx = $(this).index()
    $(this).addClass("cur").siblings().removeClass("cur")
    $(".tab_con > .conts").eq(idx).show().siblings().hide()
})
$(window).scroll(function () {
    let bannerH = $(".banner").height(),
        headerH = $(".header_1 .navbar").height(),
        windowTop = $(window).scrollTop();
    // console.log(headerH)
    // console.log(bannerH)
    // console.log(windowTop)
    if (windowTop <= (bannerH - headerH)) {
        $(".header_1").removeClass("side_ing")
    } else {
        $(".header_1").addClass("side_ing")
    }
});
$(".navbar-toggle").click(function () {
    $(this).toggleClass("rotate")
})
