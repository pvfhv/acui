(function($){
	var old=$.fn.marquee;
	
	function Marquee(ele,options){
		this.ver='1.0';
		this.element=$(ele);
		this.options=$.extend({},$.fn.marquee.defaults, options);
		this.init();
	}
	
	Marquee.prototype={
		constructor:Marquee,
		init:function(){
			var options=this.options,
				$ele=this.element;
			
			$ele.text(options.text);
			
			setInterval(function(){
				if(options.direction=="left"){
					var firstChar=$ele.text().charAt(0);
					$ele.text($ele.text().substring(1)+firstChar);
				}else{
					var text=$ele.text(),
						l=text.length,
						lastChar=text.charAt(l-1);
					$ele.text(lastChar+text.substring(0,l-1));
				}
				
			},options.timer);
		}
	};
	
	//jQuery插件
	$.fn.marquee=function(options){
		return this.each(function(){
			var $this=$(this),
				instance=$this.data('marquee');
				
			if(!instance){
				instance=new Marquee(this,options);
				$this.data('marquee',instance);
			}else{
				instance.init();
			}
		});
	};
	
	$.fn.marquee.defaults={
		text:"",
		timer:100,
		direction:"left"
	};
	
	$.fn.marquee.noConflict=function(){
		$.fn.marquee=old;
		return this;
	};
	
})(jQuery);