/*提示框*/
function tip(t){
    var tip = '<div class="tip_box"><div class="con"><p></p><a href="javascript:;" class="btn">确定</a></div></div>';
    $('body').find('.tip_box').remove();
    $('body').append(tip);
    $('.tip_box').show();
    $('.tip_box,.tip_box .btn').on('touchend',function(){
        $('.tip_box').hide();
    })
    $('.tip_box .con p').text(t);
}