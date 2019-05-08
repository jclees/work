window.onload = function () {
    
};
function slideMenu() {
    var slideout = new Slideout({
        'panel': document.getElementById('panel'),
        'menu': document.getElementById('menu'),
        'padding': 256,
        'tolerance': 70
    });
    document.querySelector('.menu_btn').addEventListener('click', function () {
        slideout.toggle();
    });
    slideout.disableTouch();
}
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