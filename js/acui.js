var ac = (function(win) {
	return {
		mask : function(json) {
			var option = {
				el : document.body,
				cls : 'ac-mask-loading',
				html : '加载中...'
			};

			if ($.isPlainObject(json)) {
				option = $.extend({}, option, json);
			}

			var html = '<div class="ac-mask ac-fixed">' + '<div class="ac-mask-background" style="background:#000"></div>' + '<div class="ac-mask-msg ac-mask-loading"></div>' + '</div>', $this = $(html);

			$this.css({
				height : $(window).height(),
				width : $(window).width()
			}).find('.ac-mask-msg').html(option.html).end().appendTo($(option.el));

			setTimeout(function() {
				var $msg = $this.find('.ac-mask-msg');

				//设置load窗口的在可视窗口的居中位置
				$msg.css({
					marginLeft : -$msg.outerWidth() / 2,
					marginTop : -$msg.outerHeight() / 2
				});
			}, 30);

			$(window).resize(function() {
				$('.ac-mask').css({
					height : $(window).height(),
					width : $(window).width()
				});
			});
		},
		unmask : function() {
			$('.ac-mask').remove();
		}
	}
})(window);

/*
 * 分页组件pagination
 * */
$.extend($.fn, {
	pagination : function(maxentries, opts) {
		/* pagesize:每页显示的数据条数
		 * pageindex:当前选中的页码
		 * num_display_entries:显示的页码个数
		 * num_edge_entries:页码首尾固定显示的页码个数
		 * link_to:非选中页码默认的链接
		 * prev_text:“上一页”显示的文本
		 * next_text:“下一页”显示的文本
		 * ellipse_text:首尾显示固定页码时，首尾页码与中间页码的间隔符
		 * prev_show_always:起始位置页码是否始终显示
		 * next_show_always:结束位置页码是否始终显示
		 * callback:非选中页码的点击事件
		 * 			@param {int} page_id 页码 传入的数字比实际小1
		 * 				   jQuery对象  当前放置分页代码的jQuery对象
		 * */
		opts = $.extend({
			pagesize : 10, 
			pageindex : 0,
			num_display_entries : 10,
			num_edge_entries : 0,
			link_to : "javascript:;",
			prev_text : "上一页",
			next_text : "下一页",
			ellipse_text : "...",
			prev_show_always : true,
			next_show_always : true,
			callback : function() {
				return false;
			}
		}, opts || {});

		return this.each(function() {
			// 当前页面元素
			var $this = $(this);
			
			// 页码索引
			var pageindex = opts.pageindex;
			
			// 分页数据的总条数
			maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
			
			//每页显示条数
			opts.pagesize = (!opts.pagesize || opts.pagesize < 0) ? 1 : opts.pagesize;
			
			//计算出最大页码
			function numPages() {
				return Math.ceil(maxentries / opts.pagesize);
			}

			/**
			 * 根据当前页码“pageindex”和显示页码个数“num_display_entries”
			 * 计算出当前页码所在的数字范围
			 * @return {Array}
			 */
			function getInterval() {
//				var ne_half = Math.ceil(opts.num_display_entries / 2);
//				var np = numPages();
//				var upper_limit = np - opts.num_display_entries;
//				var start = pageindex > ne_half ? Math.max(Math.min(pageindex - ne_half, upper_limit), 0) : 0;
//				var end = pageindex > ne_half ? Math.min(pageindex + ne_half, np) : Math.min(opts.num_display_entries, np);
				
				//显示页码区间的始末,始终把当前页码放在区间的中间
				var start=0,
					end=0,
					maxPage=numPages(),
					displayCount=opts.num_display_entries; //显示个数
				
				//以Pageindex为中间数的数组中，左右跨度范围
				var displayCount_half=Math.floor(displayCount/2);
				start=pageindex-displayCount_half;
				
				if(start<=0){
					start=0;
					end=displayCount;
				}else{
					end=start+displayCount;
				}
				
				//end不要超过最大页码数且保持最后页码显示的个数
				if(end>maxPage){
					end=maxPage;
					
					//同时检查start的值,保证最后页码界面显示displayCount个页码
					var tStart=end-displayCount;
					
					if(tStart>0){
						start=tStart;
					}
				}
				
				return [start, end];
			}

			/**
			 * 页码链接点击事件函数.
			 * @param {int} page_id 页码 传入的数字比实际小1
			 */
			function pageSelected(page_id, e) {
				pageindex = page_id;
				drawLinks();
				e.stopPropagation();
				
				return opts.callback(page_id, $this);
			}

			//渲染页码
			function drawLinks() {
				//清空当前面板
				$this.empty();
				
				//得到间隔数组和最大页码
				var interval = getInterval(),np = numPages();
								
				// 创建单个页码元素
				var appendItem = function(page_id, appendopts) {
					page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1);
					
					// 页码
					appendopts = $.extend({
						text : page_id + 1,
						classes : ""
					}, appendopts || {});
					
					//是否为当前页
					if (page_id == pageindex) {
						var $lnk = $("<span class='current'>" + appendopts.text + "</span>");
					} else {
						var $lnk = $('<a href="'+opts.link_to+'">' + appendopts.text + '</a>').unbind('click').click(function(e){
							return pageSelected(page_id, e);
						});
					}
					
					if (appendopts.classes) {
						$lnk.addClass(appendopts.classes);
					}
					
					$this.append($lnk);
				}
				
				// 创建“上一页”链接
				if (opts.prev_text && (pageindex > 0 || opts.prev_show_always)) {
					appendItem(pageindex - 1, {
						text : opts.prev_text,
						classes : "prev"
					});
				}
				
				// 创建“起始”固定部分
				if (interval[0] > 0 && opts.num_edge_entries > 0) {
					var end = Math.min(opts.num_edge_entries, interval[0]);
					
					for (var i = 0; i < end; i++) {
						appendItem(i);
					}
					
					if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
						$("<span>" + opts.ellipse_text + "</span>").appendTo($this);
					}
				}
				
				// 创建“中间”变化部分
				for (var i = interval[0]; i < interval[1]; i++) {
					appendItem(i);
				}
				
				// 创建“结束”固定部分
				if (interval[1] < np && opts.num_edge_entries > 0) {
					if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
						$("<span>" + opts.ellipse_text + "</span>").appendTo($this);
					}
					
					var begin = Math.max(np - opts.num_edge_entries, interval[1]);
					
					for (var i = begin; i < np; i++) {
						appendItem(i);
					}

				}
				
				// 创建“下一页”链接
				if (opts.next_text && (pageindex < np - 1 || opts.next_show_always)) {
					appendItem(pageindex + 1, {
						text : opts.next_text,
						classes : "next"
					});
				}
			}
			
			//初始化界面
			drawLinks();
		});
	}
}); 