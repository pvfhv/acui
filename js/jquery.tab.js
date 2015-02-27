(function($) {
        var $tabtitle = $('.tabtitle');
        
        //自动隐藏非active项
        $tabtitle.each(function(){
                var i=$(this).find('.active').index();
                $(this).next().find('li').eq(i).show().siblings().hide();
        });
        
        $tabtitle.on('click', 'li', function() {
                var i = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                $(this).closest('.tabtitle').next().find('li').eq(i).show().siblings().hide();
        });
})(jQuery);