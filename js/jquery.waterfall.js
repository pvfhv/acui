/*
 * @url:请求地址
 * @pageIndex: 请求页码
 * @pageSize: 请求个数
 * @autoLoad: 自动请求一次数据
 * @sendFlag: 是否可以发送请求
 * @callback: 回调函数，第1个参数：请求回的数组元素，第2个参数：请求数据的瀑布流容器
 */
(function($) {
	var old = $.fn.waterfall;

	$.fn.waterfall = function(option) {
		var opt = {
				url: '',
				pageIndex: 0,
				pageSize: 20,
				autoLoad: true,
				sendFlag: true,
				callback: $.noop
			},
			that = this;

		$.extend(opt, option);

		if (!that.data('option')) {
			setOpt(opt);
			$(window).on('scroll.waterfall.founder', onscrollfn);
		} else {
			setOpt(opt);
		}

		loadScroll(opt);

		//为每个元素设置独立的option属性，防止引用类型共用问题
		function setOpt(opt) {
			that.each(function() {
				var clone = $.extend({}, opt);
				$(this).data('option', clone);
			});
		}

		//调用事件
		function loadScroll(opt) {
			if (opt.autoLoad) {
				$(window).trigger('scroll.waterfall.founder');
			}
		}

		//滚动事件
		function onscrollfn() {
			that.each(function(i, v) {
				var $last = $(v).children().eq(-1),
					t = $(window).height() + $(window).scrollTop(),
					option = $(v).data('option'),
					wh = {
						w: 32,
						h: 32
					},
					$load = $('<div class="waterfallloading"></div>').css({
						left: $(v).offset().left + ($(v).width() - wh.w) / 2 + 'px',
						top: $(v).offset().top + $(v).height() - wh.h + 'px'
					});

				//无子元素，则其父元素替代
				$last = $last.length == 0 ? $(v) : $last;

				if ($last.offset().top < t && option.sendFlag) {
					//禁止重发,并追加Load效果
					$(v).data('option').sendFlag = false;
					$(v).append($load);

					$.post(option.url, {
						pageIndex: option.pageIndex,
						pageSize: option.pageSize,
						r: $.now()
					}, function(json) {
						//修改发送标识，增加页码
						$(v).data('option').sendFlag = json.success;
						$(v).data('option').pageIndex = ++option.pageIndex;

						if (option.callback && $.isFunction(option.callback)) {
							option.callback(json, $(v));
						}
					}, 'json').fail(function(jqXHR, textStatus, errorThrown) {
						throw new Error(errorThrown);
					}).always(function() {
						$(v).find('.waterfallloading').remove();
					});
				}
			});
		}

		return that;
	};

	$.fn.waterfall.noConflict = function() {
		$.fn.waterfall = old;
		return this;
	};
})(jQuery);