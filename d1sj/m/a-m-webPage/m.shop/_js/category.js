window.onload = function(){
    leftSwipe();
    rightSwipe();
}
/*左菜单*/
function leftSwipe(){
     /*通过封装的swipe插件来实现*/
     itcast.iScroll({
         swipeDom:document.querySelector('.dh_list_left'),/*父容器对象*/
         swipeType:'y',/*滑动的方向*/
         swipeDistance:100/*缓冲的距离*/
     });
}
/*右侧内容*/
function rightSwipe(){
    /*通过封装的swipe插件来实现*/
    itcast.iScroll({
        swipeDom:document.querySelector('.dh_list_right'),/*父容器对象*/
        swipeType:'y',/*滑动的方向*/
        swipeDistance:100/*缓冲的距离*/
    });
}