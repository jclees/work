$(function () {
    $('.menu_btn').on('click', function () {
        $('.accordion').toggle();
        var aClass = $(this).hasClass('menu_btn_02')
        if (aClass) {
            $(this).removeClass('menu_btn_02')
        } else {
            $(this).addClass('menu_btn_02')
        }
    })
})
function scrollTop(imgUrl) {
    $('.scroll_top').remove()
    $(window).scroll(function () {
        var scroll = $(window).scrollTop()
        if (scroll > 200) {
            $('.scroll_top').remove()
            var newHtml = '<section class="scroll_top"><img src="' + imgUrl + '" /></section>'
            $('body').append(newHtml)
        } else {
            $('.scroll_top').remove()
        }
        $('.scroll_top').on('touchend', function () {
            $('body,html').animate({ scrollTop: 0 }, 500);
        })
    })
}