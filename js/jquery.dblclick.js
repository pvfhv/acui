(function($){
	$.fn.dblclick=function(fn){
		return this.each(function(e){
			var lastClickTime=null;
			$(this).on('touchstart',function(){
				var delta=Date.now()-(lastClickTime||Date.now());
				
				if(delta>0&&delta<300){
					fn.call(this,e);
				}
			}).on('touchend',function(){
				lastClickTime=Date.now();
			});
		});
	};
})(jQuery);
