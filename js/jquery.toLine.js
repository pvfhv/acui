(function($) {
	var old = $.fn.toLine;

	function ToLine(element, options) {
		this.ver = '1.0';
		this.$element = $(element);
		this.options = $.extend({}, $.fn.toLine.defaults, options);
		this.init();
	}

	ToLine.prototype = {
		constructor: ToLine,
		init: function() {
			var options = this.options;

			this.$element.on('touchstart.toLine.founder mousedown.toLine.founder', function(e) {
				var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
					that = this,
					startX=ev.pageX,
					startY=ev.pageY;

				var $line=$('<div />', {
					"class": "ac-line"
				}).appendTo(document.body).css({
					left: startX + 'px',
					top: startY + 'px'
				});

				if (options.before && $.isFunction(options.before)) {
					options.before.call(that, ev);
				}

				$(document).on('touchmove.toLine.founder mousemove.toLine.founder', function(e) {
					var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;

					var l = ev.pageX,
						t = ev.pageY,
						disX = l - startX,
						disY = t - startY,
						x = Math.abs(disX),
						y = Math.abs(disY);

					var dis = Math.round(Math.sqrt(x * x + y * y)),
						deg = Math.round(180 * Math.atan2(disY, disX) / Math.PI);

					$line.width(dis + 'px').css('transform', 'rotate(' + deg + 'deg)');

					if (options.process && $.isFunction(options.process)) {
						options.process.call(that, ev);
					}

					e.preventDefault();
				});

				$(document).on('touchend.toLine.founder mouseup.toLine.founder', function(e) {
					var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;

					if (options.end && $.isFunction(options.end)) {
						options.end.call(that, ev);
					}

					$(document).off('.toLine.founder');
				});

				e.preventDefault();
			});
		}
	};

	//jQ插件模式
	$.fn.toLine = function(options) {
		return this.each(function() {
			var $this = $(this),
				instance = $this.data('toLine');

			if (!instance) {
				instance = new ToLine(this, options);
				$this.data('toLine', instance);
			} else {
				instance.init();
			}

			if (typeof options === 'string') {
				//instance.options[options].call(this);
			}

		});
	};

	$.fn.toLine.defaults = {
		before: $.noop,
		process: $.noop,
		end: $.noop
	};

	$.fn.toLine.noConflict = function() {
		$.fn.toLine = old;
		return this;
	};
})(jQuery);