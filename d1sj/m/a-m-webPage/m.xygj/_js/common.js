$(function() {
    $('#accordion').height($(document).height());
    $('.menu_btn').on('click',function(){
        $('.accordion').toggle();   
        if($('#accordion').is(":hidden")){
            $(this).removeClass('menu_btn_02');
        }else{
            $(this).addClass('menu_btn_02');
        }

    });

    
    

/*    $('#accordion>li').each(function(index, el) {
        var flag = $(this).hasClass('open');
        if(flag == true){
            $(this).siblings().removeClass('border_t').addClass('border_t');
            $(this).find('.icon').css({
                'background-image':'url('+imgUrlCur[index]+')'
            }); 
        }
        if(flag == false){
            $(this).siblings().removeClass('border_b').addClass('border_b');
            $(this).find('.icon').css({
                'background-image':'url('+imgUrl[index]+')'
            }); 
        }
    });*/



    $('#accordion>li').each(function(index, el) {
        var imgUrl = ['/_images/tit_icon_01.png','/_images/tit_icon_02.png'];
        var imgUrlCur = ['/_images/tit_icon_cur_01.png','/_images/tit_icon_cur_02.png'];

        if($(this).attr('class') == 'open'){
            $(this).find('.link').addClass('border_b');
            $(this).find('.icon').css('background-image','url('+imgUrlCur[index]+')');
        }else{
            $(this).find('.link').addClass('border_t');
            $(this).find('.icon').css('background-image','url('+imgUrl[index]+')');
        }

        $(this).on('click',function(){
            if($(this).attr('class') == 'open'){
                $(this).find('.link').addClass('border_b');
                $(this).siblings().find('.link').addClass('border_b border_t');
                $(this).siblings().find('.link').removeClass('border_b');
                if(index == 0){
                    $(this).siblings().find('.icon').css('background-image','url('+imgUrl[1]+')');
                }else if(index == 1){
                    $(this).siblings().find('.icon').css('background-image','url('+imgUrl[0]+')');
                }
                $(this).find('.icon').css('background-image','url('+imgUrlCur[index]+')');
            }else{
                $(this).find('.link').removeClass('border_t');
                $(this).siblings().find('.link').removeClass('border_t');

                $(this).find('.link').addClass('border_b');
                $(this).siblings().find('.link').addClass('border_b');

                $(this).find('.icon').css('background-image','url('+imgUrl[index]+')');
            }
        })
    });
    
    

    var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        // Variables privadas
        var links = this.el.find('.link');
        // Evento
        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
    }

    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el;
            $this = $(this),
            $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');

        if (!e.data.multiple) {
            $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        };
    }   
    var accordion = new Accordion($('#accordion'), false);
    });