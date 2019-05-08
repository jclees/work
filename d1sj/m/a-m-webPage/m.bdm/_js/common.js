$(".conact_tabs > a").on('click', function () {
    var _index = $(this).index()
    $(this).addClass('cur').siblings().removeClass('cur')
    $('.tabs_content > section').eq(_index).show().siblings().hide()
    if (_index == 0) {
      $(".msg_wrap p").hide()
    } else {
        $(".msg_wrap p").show()
    }
})
$(".close_btn").on('click', function () {
    $(".mask_box").hide()
})
$(".open_btn").on('click', function () {
    $(".mask_box").show()
})