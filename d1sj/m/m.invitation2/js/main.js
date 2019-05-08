window.onload = function () {
	var imgurl = ['images/page_bg_02.png', 'images/page_bg_03.png', 'images/page_bg_04.png', 'images/page_bg_05.png', 'images/page_bg_06.png', 'images/page_bg_07.png']
	$("img").each(function (i, t) {
		imgurl.push($("img").eq(i).attr("src"))
	})
	console.log(imgurl)
	var callbacks = [];
	imgLoader(imgurl, function (percentage) {
		var i = callbacks.length;
		callbacks.push(function () {
			setTimeout(function () {
				var percentT = percentage * 100;
				if (percentage == 1) {
					setTimeout(function () {
						$('.page1').hide().next().show();
						openmusic();
					}, 100);
					$(".page0").hide()
				}
				$('.loading_box .txt').html((parseInt(percentT)) + ' %');
				callbacks[i + 1] && callbacks[i + 1]();
			}, 100);
		});
		if (percentage == 1) {
			callbacks[0]();
		}
	});
	var audio = document.getElementById('bg-music');
	audio.play();

	document.addEventListener("WeixinJSBridgeReady", function () {
		audio.play();
	}, false);
	audio.pause();
}
//input 输入后解决页面不下来问题
$("input").on('blur', function () {
	window.scroll(0, 0);
});
// 跳转到邀请页
$(".jumpShare").on("click", function () {
	$(".page").hide();
	$(".page6").addClass("animated fadeIn").show();
})
// 显示隐藏打开分享
$(".openShare").on("click", function () {
	$(".share").show()
})
$(".cover").on("click", function () {
	$(".share").hide()
})
//保存邀请函
$(".openDown").on("click", function () {
	alert("长按图片保存 邀请函")
})
//按钮放大缩小动画
$(".anm_pulse").addClass("animated pulse infinite");

//滑动跳转到下一个页面
var startX, startY;
function GetSlideDirection(startX, startY, endX, endY) {
	var dy = startY - endY;
	//var dx = endX - startX;
	var result = 0;
	if (dy > 0) {//向上滑动
		result = 1;
	} else if (dy < 0) {//向下滑动
		result = 2;
	}
	else {
		result = 0;
	}
	return result;
}
document.addEventListener('touchstart', function (ev) {
	startX = ev.touches[0].pageX;
	startY = ev.touches[0].pageY;
}, false);
document.addEventListener('touchend', function (ev) {
	var endX, endY;
	endX = ev.changedTouches[0].pageX;
	endY = ev.changedTouches[0].pageY;
	var direction = GetSlideDirection(startX, startY, endX, endY);
	switch (direction) {
		case 0:
			// alert("无操作");
			break;
		case 1:


			$("div[data-show]").each(function (i, v) {
				console.log(this)
				if ($(this).css("display") == "block") {

					$(".page").hide()
					$(".page" + $(this).attr("data-show")).next().addClass("animated fadeIn").show(); 
					$(".page" + $(this).attr("data-show")).removeAttr("data-show");
					console.log(111111111111111111)
					return false;
				} else {
					console.log(2222222222222222)
				}
			})



			// 向上
			// alert("up");
			// if ($('.page3').css('display') == 'none') {
			// 	console.log(111111111111)
			// 	$(".page").hide()
			// 	$(".page5").addClass("animated fadeIn").show();
			// 	return;
			// }
			// if ($('.page4').css('display') == 'none') {
			// 	console.log(222222222222)
			// 	$(".page").hide()
			// 	$(".page4").addClass("animated fadeIn").show();
			// 	return;
			// }
			break;
		case 2:
			// 向下
			// alert("down");
			break;

		default:
	}
	return

}, false);
// document.addEventListener('touchend', function (ev) {
// 	if ($('.page4').css('display') == 'none' && $('.page3').css('display') == 'none') {
// 		return
// 	}
// 	var endX, endY;
// 	endX = ev.changedTouches[0].pageX;
// 	endY = ev.changedTouches[0].pageY;
// 	var direction = GetSlideDirection(startX, startY, endX, endY);
// 	switch (direction) {
// 		case 0:
// 			// alert("无操作");
// 			break;
// 		case 1:
// 			// 向上
// 			// alert("up");
// 			if ($('.page3').css('display') == 'none') {
// 				console.log(111111111111)
// 				$(".page").hide()
// 				$(".page5").addClass("animated fadeIn").show();
// 				return;
// 			}
// 			if ($('.page4').css('display') == 'none') {
// 				console.log(222222222222)
// 				$(".page").hide()
// 				$(".page4").addClass("animated fadeIn").show();
// 				return;
// 			}
// 			break;
// 		case 2:
// 			// 向下
// 			// alert("down");
// 			break;

// 		default:
// 	}
// }, false);
function openmusic() {
	autoPlayMusic();
	audioAutoPlay();
	$(".close_music_div").css({ "display": "block" });
	$(".open_music_div").css({ "display": "none" });
}

function pauseAuto() {
	var audio = document.getElementById('bg-music');
	audio.pause();
	$(".close_music_div").css({ "display": "none" });
	$(".open_music_div").css({ "display": "block" });
}

function audioAutoPlay() {
	var audio = document.getElementById('bg-music');
	audio.play();
	document.addEventListener("WeixinJSBridgeReady", function () {
		audio.play();
	}, false);
}
// 音乐播放
function autoPlayMusic() {
	// 自动播放音乐效果，解决浏览器或者APP自动播放问题
	function musicInBrowserHandler() {
		musicPlay(true);
		document.body.removeEventListener('touchstart', musicInBrowserHandler);
	}
	document.body.addEventListener('touchstart', musicInBrowserHandler);
	// 自动播放音乐效果，解决微信自动播放问题
	function musicInWeixinHandler() {
		musicPlay(true);
		document.addEventListener("WeixinJSBridgeReady", function () {
			musicPlay(true);
		}, false);
		document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
	}
	document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
}
function musicPlay(isPlay) {
	var media = document.getElementById('bg-music');
	if (isPlay && media.paused) {
		media.play();
	}
	if (!isPlay && !media.paused) {
		media.pause();
	}
}