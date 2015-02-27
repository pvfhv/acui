

var  $parseJSON = function( data ) {
    var // JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/
        , rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g
        , rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g
        , rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g
        ;
    if ( window.JSON && window.JSON.parse ) {
        return window.JSON.parse( data );
    }
    if ( data === null ) {
        return data;
    }
    if ( typeof data === "string" ) {
        data = data.replace(/^\s+|\s+$/g, '');
        if ( data && rvalidchars.test( data.replace( rvalidescape, "@" )
            .replace( rvalidtokens, "]" )
            .replace( rvalidbraces, "")) ) {
            return ( new Function( "return " + data ) )();
        }
    }
    return '';
}

/**
 * 获取URL参数
 * //example getUrlParam('id') or getUrlParam('id','#')
 */
var getUrlParam = function(url){
    
    var u, params, StrBack = '';
    if (arguments[arguments.length - 1] == "#") 
        u = url.split("#");
    else 
        u = url.split("?");
    if (u.length == 1) 
        params = '';
    else 
        params = u[1];
    
    if (params != '') {
        gg = params.split("&");
        var MaxI = gg.length;
        str = arguments[1] + "=";
        for (i = 0; i < MaxI; i++) {
            if (gg[i].indexOf(str) == 0) {
                StrBack = gg[i].replace(str, "");
                break;
            }
        }
    }
    return StrBack;
};



var TimeCalculate = {
    GetDateDiff : function(startTime, endTime){
          startTime = startTime.replace(/\-/g, "/");

          endTime = endTime.replace(/\-/g, "/");



          var sTime = new Date(startTime);      //开始时间

          var eTime = new Date(endTime);  //结束时间

          var date_ms = eTime-sTime;

            //计算出相差天数
            var days=Math.floor(date_ms/(24*3600*1000));
            days = days.toString().length > 1 ? days :  '0'+ days;
            //计算出小时数
            var leave1=date_ms%(24*3600*1000) //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000));
            hours = hours.toString().length > 1 ? hours :  '0'+ hours;
            //计算相差分钟数
            var leave2=leave1%(3600*1000) //计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000));
            minutes = minutes.toString().length > 1 ? minutes :  '0'+ minutes;
            //计算相差秒数
            var leave3=leave2%(60*1000) //计算分钟数后剩余的毫秒数
            var seconds=Math.round(leave3/1000);

            seconds = seconds.toString().length > 1 ? seconds :  '0'+ seconds;


            daysReturnStr1 = days.toString() == '00' ? '':"<span class='days'>" + days + "</span> " + decodeURIComponent('%E5%A4%A9');
            daysReturnStr2 = days.toString() == '00' ? '':days+":";

            // if(days.toString() == '00' && hours.toString() == '00' && minutes.toString()=='00' && seconds.toString()=='00'){
            //     days == '00';
            //     hours = '00';
            //     minutes = '00';
            //     seconds = '00';

            // }

            return [daysReturnStr1+"<span class='hours'>" + hours + "</span>" + ":" + "<span class='min'>"  +  minutes + "</span>" + ":"+ "<span class='sec'>" + seconds + "</span>",daysReturnStr2+hours+":"+minutes+":"+seconds]

    },
    getLocalTime : function(nS){
           return this.dateFormat(new Date(parseInt(nS) * 1000),"yyyy-MM-dd HH:mm:ss");      
    },

    dateFormat : function(date,fmt) {
            var o = {
            "M+" : date.getMonth() + 1, 
            "d+" : date.getDate(), 
            "h+" : date.getHours() % 12 == 0 ? 12 : date.getHours()%12, 
            "H+" : date.getHours(), 
            "m+" : date.getMinutes(), 
            "s+" : date.getSeconds(), 
            "q+" : Math.floor((date.getMonth()+3)/3), 
            "S" : date.getMilliseconds() 
            };
            var week = {
            "0" : "\u65e5",
            "1" : "\u4e00",
            "2" : "\u4e8c",
            "3" : "\u4e09",
            "4" : "\u56db",
            "5" : "\u4e94",
            "6" : "\u516d"
            };
            if(/(y+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            if(/(E+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[date.getDay()+""]);
            }
            for(var k in o){
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        }
};




/**
 * jQuery 鼠标跟随视差插件
 * author: reeqiwu
 * email: reeqi.wu@qq.com / wuliqi#jd.com
 * version: 1.0
 * update : 2014.05.19
 * use_step1 : $('#element').mParallax(options) |  #element为需要视差
 * use_step2 : 在需要视差移动的元素的html结构上添加 data-mparallax-index="1" ，1代表此为前景元素，递增代表由近及远
 * use_step3 : 可对单个视差元素设置移动方向：data-mparallax-direction="h" ，h:只进行水平移动，v:只进行垂直移动
 */


(function ($) {


    function MParallax(element, options) {
        this.ver = 1.0;
        this.$element = $(element);
        this.options = $.extend({}, $.fn.mParallax.defaults,options);
        this.init();
    }

    MParallax.prototype = {
        offset : null,
        elemInfo : null,
        itemsArray : [],

        /**
         * 获取外部元素的宽高，存于 elemInfo 对象
         */        
        _setElemInfo : function(){
            var elemWidth = this.$element.width();
            var halfWidth = elemWidth * 0.5;
            var elemHeight = this.$element.height();
            var halfHeight = elemHeight * 0.5;
            this.elementInfo = {
                width  : elemWidth,
                height : elemHeight,
                halfWidth : halfWidth,
                halfHeight : halfHeight
            };
        },

        /**
         * 获取需要进行视差的元素，存于 itemsArray 数组
         */         
        _setItemsArr : function(){
            var $element = this.$element;
            var $pItems = $element.find('[data-mparallax-index]');
            var indexArray = [];
            $pItems.each(function(index, el) {
                var mIndex = $(el).data('mparallax-index');
                indexArray.push(mIndex);
            });
            indexArray = indexArray.sort();

            for(var i = 0; i < indexArray.length; i++){
                var $pItem =  $element.find('[data-mparallax-index='+ indexArray[i] +']');
                var pos = $pItem.position();
                this.itemsArray.push($pItem);               
            }
        },


        /**
         * 设置偏移量
         */         
        offsetFunc : function(e){
            if(e.pageX < this.elementInfo.width){
                var pX = (this.options.moveScopeX * e.pageX) / this.elementInfo.halfWidth;
                var offsetX =  - ( this.options.moveScopeX  -  pX);
            }else{
                var pX = (this.options.moveScopeX * (e.pageX - this.elementInfo.halfWidth)) / this.elementInfo.halfWidth;
                var offsetX = pX;
            }

            if(e.pageY < this.elementInfo.halfHeight){
                var pY = (this.options.moveScopeY * e.pageY) / this.elementInfo.halfHeight;
                var offsetY =  - ( this.options.moveScopeY  -  pY);
            }else{
                var pY = (this.options.moveScopeY * (e.pageY - this.elementInfo.halfHeight)) / this.elementInfo.halfHeight;
                var offsetY = pY;
            }

            // 相反方向
            var offsetX = - offsetX;
            var offsetY = - offsetY;

            this.offset = {x:offsetX,y:offsetY}
        },


        /**
         * 鼠标进入响应区域触发函数
         */ 
        enterFunc : function(e){
            var that = this;
            this.offsetFunc(e);

            var a = this.offset.x;
            var b = this.offset.y;


            $(this.itemsArray).each(function(index, el) {

                if(index > 0){
                    that.offset.x = a * 0.5;
                    a = that.offset.x;

                    that.offset.y = b * 0.5;
                    b = that.offset.y;
                }

                var direction = that.options.direction;
                if($(el).data('mparallax-direction') !== undefined){
                    direction = $(el).data('mparallax-direction');
                }

                if(direction == 'h'){

                    $(el).animate({
                            marginLeft : that.offset.x + 'px'
                    },100,function(){

                        if(index == that.itemsArray.length - 1){

                            $(that.options.response).mousemove(function(e) {
                                that.moveFunc(e);
                            })
                            
                        }
                    });

                }else if(direction == 'v'){
                    $(el).animate({
                            marginTop : that.offset.y + 'px'
                    },100,function(){

                        if(index == that.itemsArray.length - 1){

                            $(that.options.response).mousemove(function(e) {
                                that.moveFunc(e);
                            })
                            
                        }
                    });

                }else{

                    $(el).animate({
                            marginLeft : that.offset.x + 'px',
                            marginTop : that.offset.y + 'px'
                    },100,function(){

                        if(index == that.itemsArray.length - 1){

                            $(that.options.response).mousemove(function(e) {
                                that.moveFunc(e);
                            })
                            
                        }
                    });

                }



            });

        },


        /**
         * 鼠标在响应区域内移动时触发函数
         */ 
        moveFunc : function(e){
            var that = this;
            this.offsetFunc(e);

            var a = this.offset.x;
            var b = this.offset.y;


            $(this.itemsArray).each(function(index, el) {

                if(index > 0){
                    that.offset.x = a * 0.5;
                    a = that.offset.x;

                    that.offset.y = b * 0.5;
                    b = that.offset.y;
                }

                var direction = that.options.direction;
                if($(el).data('mparallax-direction') !== undefined){
                    direction = $(el).data('mparallax-direction');
                }


                if(direction == 'h'){
                    $(el).css('margin-left', that.offset.x);

                }else if(direction == 'v'){
                    $(el).css('margin-top', that.offset.y);

                }else{
                    $(el).css('margin-left', that.offset.x);
                    $(el).css('margin-top', that.offset.y);

                }


            })



        },

        /**
         * 鼠标进入响应区域事件
         */ 
        _mouseenterEvent : function(){
            var that = this;
            $(this.options.response).mouseenter(function(e) {
                that.enterFunc(e);
            })
        },

        /**
         * 鼠标离开响应区域事件
         */ 
       _mouseleaveEvent : function(){
            
            $(this.options.response).mouseleave(function(e) {

                $(this).unbind('mousemove');

            })
        },


        /**
         * 插件初始化
         */ 
        init : function(){
            this._setElemInfo();
            this._setItemsArr();
            this._mouseenterEvent();
            this._mouseleaveEvent();

        }
    };

    // JQ插件模式
    $.fn.mParallax = function (options) {
        return this.each(function () {
            var $me = $(this),
                instance = $me.data('mParallax');
            if(!instance){
                instance = new MParallax(this, options);
                $me.data('mParallax',instance );
            }else{
                instance.init();
            }
            if ($.type(options) === 'string') instance[options]();

        });
    };



    /**
     * 插件的默认值
     */
    $.fn.mParallax.defaults = {
        response : 'body', //鼠标响应的区域，默认为body，也可以是元素
        moveScopeX : 30, //前景元素（data-mparallax-index="1"）水平移动的范围，后面元素移动幅度依次递减50%
        moveScopeY : 16, //前景元素（data-mparallax-index="1"）垂直移动的范围，后面元素移动幅度依次递减50%
        direction : 'all' //移动方向，all:水平垂直方向启动；v:垂直移动；h水平移动
    };

})(jQuery);




(function ($) {
    function LoadPI(element, options) {
        this.ver = 1.0;
        this.$element = $(element);
        this.options = $.extend({}, $.fn.loadPI.defaults,options);
        this.init();
    }
    
    LoadPI.prototype = {
        piOptions : null,
        piData : null,
        piHtml : '',

        /*
         * 获取元素data-loadpi的相关配置
         */        
        _setOptions : function(){

            var piSource = this.$element.attr('data-loadpi-url');
            var piId = piSource.substring(piSource.lastIndexOf('/') + 1,piSource.indexOf('.js'));
            var tpl = this.$element.data('loadpi-tpl').replace(/<i>\?<\/i>/gi,"<i>&yen;</i>");
            var ptag = this.$element.data('ptag') || '';
            this.piOptions = {
                piSource : piSource,
                piId : piId,
                template : tpl,
                ptag : ptag
            }
        },

        /*
         * 重置扩展推荐位中的拍拍商品图片尺寸
         */
        resetData: function(i){
            this.piData[i].image = this.piData[i].image.replace('/00000000/','/'+this.randomTimestamp(10000000,20000000).toString()+'/');
            this.piData[i].img60x60 = this.piData[i].image.replace('200x200','60x60');
            this.piData[i].img80x80 = this.piData[i].image.replace('200x200','80x80');
            this.piData[i].img120x120 = this.piData[i].image.replace('200x200','120x120');
            this.piData[i].img160x160 = this.piData[i].image.replace('200x200','160x160');
            this.piData[i].img200x200 = this.piData[i].image;
            this.piData[i].img300x300 = this.piData[i].image.replace('200x200','300x300');


            

            // 如果没有促销价就把拍拍价填到促销价字段
            if(this.piData[i].activePrice == ''){
                this.piData[i].activePrice = this.piData[i].price;
            }
            this.piData[i].activePrice = parseFloat(this.piData[i].activePrice).toFixed(2);

            this.piData[i].discountTxt = (this.piData[i].activePrice / this.piData[i].price * 10).toFixed(1);
        },
        randomTimestamp: function(n,m){
            var c = m-n+1;  
            return Math.floor(Math.random() * c + n);
        },
        /*
         * 把推荐位的数据渲染到模板上
         */
        renderTpl : function (tpl, data) {
            tpl = tpl.replace(/{#([\w\-]+)\#}/g, function(match, key){
                return typeof data[key] !== undefined ? data[key] : '';
            });
            return tpl;
        },

        /*
         * 叠加渲染后的HTML结构
         */
        replaceTpl : function(i){
            var template = this.piOptions.template;
            this.piHtml  += this.renderTpl(this.piOptions.template,this.piData[i]);

        },

        /*
         * 把循环渲染后的html结构填充到元素中
         */
        fill : function(){
            //console.log(this.options.fillMode);
            if(this.options.fillMode == 'append'){

                this.$element.append(this.piHtml);
            }else if(this.options.fillMode == 'fill'){
                
                this.$element.html(this.piHtml);
                 
            }
            if(this.options.renderedCallback !== null  &&  typeof this.options.renderedCallback === 'function'){
                this.options.renderedCallback(this.$element,this.piData);
            }
        },

        addPtag : function(){
            var that = this;
            if(that.piOptions.ptag !== ''){
                this.$element.find('a').each(function(index, el) {
                    var oHref = $(this).attr('href');
                    $(this).attr('href', oHref  +  (oHref.indexOf('?') > -1 ?  '&PTAG=' + that.piOptions.ptag :  '?PTAG=' + that.piOptions.ptag ) );
                });
            }
        },


        /*
         * 对推荐位数据进行循环
         */
        loopData : function(){
            for(var i in this.piData){
                if(this.piData[i] !== ''){
                    this.resetData(i);
                    this.replaceTpl(i);
                }else{
                    this.piData.splice(i,1);
                    continue;                    
                }
            }
            //console.log(this.piData);
            this.fill(this.piData);
            this.addPtag();
        },

        /*
         * 拉取实时数据
         */
        getRealTimeData : function(){
            var that = this;
            var idArr = [];
            for(var i = 0 ; i < that.piData.length; i++){
                idArr.push(that.piData[i].id);
            }
            $.ajax({  
                type : "GET", 
                url : 'http://uploading.paipai.com/fecth.do?itemId=' + idArr.toString() + '&t=' + Date.parse(new Date()),  
                dataType : "jsonp",
                success : function(data){
                    data = $parseJSON(data);
                    for(var i = 0 ; i < data.length; i++){
                        that.piData[i].recmdRegName = data[i].title;
                        if(data[i].activityPrice !== '0'){
                            that.piData[i].activePrice = (data[i].activityPrice / 100 ).toFixed(2);
                        }else{
                            that.piData[i].activePrice = (data[i].price / 100 ).toFixed(2);
                        }
                        that.piData[i].stockNum = data[i].num;
                        that.piData[i].soldNum = that.piData[i].soldNum;
                    }
                    that.loopData();
                },
                error : function(){
                    that.loopData();
                }  
            });            
        },


        /*
         * 拉取推荐位数据
         */
        getPiData : function(){
            var that = this;
            $.ajax({  
                type : "GET", 
                url : that.piOptions.piSource + '?t=' + Date.parse(new Date()),  
                dataType : "jsonp",
                contentType: "application/x-javascript; charset=gbk",
                jsonpCallback: that.piOptions.piId, 
                success : function(data){

                    that.piData = data.itemData;
                    that.loopData();
                    //that.getRealTimeData();
                    that.piHtml="";
                }  
            }); 
        },


        init : function(){
            this.piOptions = null;
            this.piData = null;
            this.piHtml = '';
            this._setOptions();
            this.getPiData();
           
        }
    };

    // JQ插件模式
    $.fn.loadPI = function (options) {
        return this.each(function () {
            var $me = $(this),
                instance = $me.data('loadpi');
            if(!instance){
                instance = new LoadPI(this, options);
                $me.data('loadpi',instance );
            }else{
                instance.init();
            }
            if ($.type(options) === 'string') instance[options]();

        });
    };



    /**
     * 插件的默认值
     */
    $.fn.loadPI.defaults = {
        fillMode : 'fill',
        renderedCallback : null
    };
})(jQuery);





(function ($) {
    function MarketCpc(element, options) {
        this.ver = 1.0;
        this.$element = $(element);
        this.options = $.extend({}, $.fn.marketCpc.defaults,options);
        this.init();
    }
    
    MarketCpc.prototype = {

        /*
         * 获取元素data-marketcpc的相关配置
         */        
        _setOptions : function(){
            this.actId = this.$element.data('marketcpc-actid');
            var pcArr = [];
            $('[data-marketcpc-pc]').each(function(index, el) {
                var pc =  $(el).attr('data-marketcpc-pc');
                pc = pc > 128 ? 128 : pc;
                pcArr.push(pc);
            });
            var maxPc = Math.max.apply(null, pcArr);
            //this.actPc = this.$element.data('marketcpc-pc') || '';
            this.actPc = maxPc || '';
            this.actUrl =  this.$element.data('marketcpc-url') || window.location.href.split('?')[0];
            
            
        },

        /*
         * 重置扩展字段
         */
        resetData: function(data){
            data.id = data.strCommodityId;
            data.clickUrl = data.strClickUrl;
            data.img60x60 = data.strPic.replace('120x120','60x60').replace('160x120','60x60').replace('200x200','60x60');
            data.img80x80 = data.strPic.replace('120x120','80x80').replace('160x120','80x80').replace('200x200','80x80');
            data.img120x120 = data.strPic.replace('120x120','120x120').replace('160x160','120x120').replace('200x200','120x120');
            data.img160x160 = data.strPic.replace('120x120','160x160').replace('160x160','160x160').replace('200x200','160x160');
            data.img200x200 = data.strPic.replace('120x120','200x200').replace('160x160','200x200').replace('200x200','200x200');
            data.img300x300 = data.strPic.replace('120x120','300x300').replace('160x160','300x300').replace('200x200','300x300');

            var activePrice = parseInt(data.dwActivePrice);
            var marketPrice = parseInt(data.dwMarketPrice);
            var price = parseInt(data.dwPrice);

            data.activePrice = (activePrice/100).toFixed(2);
            data.marketPrice = (marketPrice/100).toFixed(2);
            data.price = (price/100).toFixed(2);
            data.qq = data.ddwSellerUin;
            data.shopName = data.strShopName;
            data.commFullName = data.strTitle;
            data.discountTxt = (activePrice / marketPrice * 10).toFixed(1) ;
            data.stockNum = data.dwStock;
            data.uploadPicUrl1 = data.mapCustomData.uploadPicUrl1;
            data.uploadPicUrl2 = data.mapCustomData.uploadPicUrl2;
            data.uploadPicUrl3 = data.mapCustomData.uploadPicUrl3;
            data.adSentence = data.mapExt.adSentence;
            data.ext3_auditTime = data.mapExt.ext3_auditTime;
            data.ext3_colormark = data.mapExt.ext3_colormark;
            data.ext3_mainLogoName = data.mapExt.ext3_mainLogoName;
            data.recmdRegName = data.mapExt.recmdRegName;
            //data.discountTxt = Math.floor(data.discount / 1000 );
            // var discountMid = (data.discount / 1000 );
            // if(discountMid.length > 1 && discountMid == '10'){
            //     data.discountTxt = discountMid.toFixed(1)
            // }else{
            //     data.discountTxt = discountMid;
            // }

        },

        /*
         * 把推荐位的数据渲染到模板上
         */
        renderTpl : function (reg,tpl, data) {
            tpl = tpl.replace(reg, function(match, key){
                return typeof data[key] !== undefined ? data[key] : '';
            });
            return tpl;
        },
        arrSortByField : function(arr, field,order,primer){
            var order = (order == undefined) ? 1 : ((order == 'asc') ? 1 : -1) ;
            var primer = primer || parseInt;

            var sortFunc = function(field,reverse,primer){

                return function (a, b) {
                    
                    var a = a[field];
                    var b = b[field];

                    if (typeof (primer) != 'undefined') {
                        a = primer(a);
                        b = primer(b);
                    }
                    if (a < b) return reverse * -1;
                    if (a > b) return reverse * 1;
                    //console.log(a,b);
                    return 0;
                }

            }

            return arr.sort(sortFunc(field,order,primer))
        },

        /*
         * 把循环渲染后的html结构填充到元素中
         */
        fill : function($areaElem,areaHtml){
            var areaFillMode = $areaElem.attr('data-marketcpc-fill-mode');
            if(this.options.fillMode == 'append'){
                if(areaFillMode == undefined){
                    $areaElem.append(areaHtml);
                }else if(areaFillMode == 'append'){
                    $areaElem.append(areaHtml);
                }else if(areaFillMode == 'fill'){
                    $areaElem.html(areaHtml);
                }
                
            }else if(this.options.fillMode == 'fill'){
                if(areaFillMode == undefined){
                    $areaElem.html(areaHtml);
                }else if(areaFillMode == 'append'){
                    $areaElem.append(areaHtml);
                }else if(areaFillMode == 'fill'){
                    $areaElem.html(areaHtml);
                }
            }


        },


        loopTabs : function(loopTpl,data){
            var reg = new RegExp(/\[#([\w\-]+)\#\]/g);
            return this.renderTpl(reg,loopTpl,data);
        },

        addPtag : function($areaElem,ptag){
            var that = this;
            if(ptag !== ''){
                $areaElem.find('a').each(function(index, el) {
                    var oHref = $(this).attr('href');
                    $(this).attr('href', oHref  + (oHref.indexOf('PTAG') > -1 || oHref.indexOf('ptag') > -1 ? '' : (oHref.indexOf('?') > -1 ?  '&PTAG=' + ptag :  '?PTAG=' + ptag ) ) );
                });
            }
        },
        loopAreaData : function(data,areaIndex){
            data.areaName = data.strAreaName;
            data.areaId = data.dwAreaId;
            if(!this.options.allFill){
                var $areaElem = $('[data-marketcpc-areaid ~= "'+ data.dwAreaId +'"]');
            }else{
                var $areaElem = this.$element;
            }

            if(this.options.loopAreaBeginCallback !== null  &&  typeof this.options.loopAreaBeginCallback === 'function'){
                this.options.loopAreaBeginCallback(data,$areaElem,areaIndex);
            }            
            var that = this;
                $areaElem.each(function(index, el) {

                    var $areaElem = $(el);
                    var areaTpl = $areaElem.attr('data-marketcpc-tpl').replace(/<i>\?<\/i>/gi,"<i>&yen;</i>");
                    var areaPc = $areaElem.attr('data-marketcpc-pc') || data.vecTabs.length;

                    var reg = new RegExp(/{#([\w\-]+)\#}/g);
                    var ptag = $areaElem.attr('data-ptag') || '';

                    areaTpl =  that.renderTpl(reg,areaTpl,data);

                    var reg2 = new RegExp(/\{loop\}(.*?)\{\/loop\}/);  
                    
                    reg2Arr = areaTpl.match(reg2);
                    loopTpl = reg2Arr[1];

                    var tabsHtml = '';

                    if(data.vecTabs !== null){

                        for(var j = 0 ; j < data.vecTabs.length; j++){
                            if(data.vecTabs[j].dwOrderNum !==0 ){
                                data.vecTabs = that.arrSortByField(data.vecTabs,'dwOrderNum');
                            }
                        }
                    }else{

                        return true;
                    }


                    for(var i = 0 ; i < areaPc; i++ ){

                        if(data.vecTabs[i] !== undefined){
                            that.resetData(data.vecTabs[i]);
                            if(that.options.loopTabsCallback !== null  &&  typeof that.options.loopTabsCallback === 'function'){
                                that.options.loopTabsCallback(data.vecTabs[i],i);
                                
                            }
                            tabsHtml += that.loopTabs(loopTpl,data.vecTabs[i]);
                        }

                    }
                    if(areaIndex > 0 && (that.options.allFill || that.options.fillMode == 'append') ){
                        var areaHtml = tabsHtml;
                       
                        if($('[data-marketcpc-areaid]').length == 0 || $(el).attr('data-marketcpc-areaid').indexOf(data.dwAreaId.toString())){
                            var areaHtml = tabsHtml;
                        }else{
                            var areaHtml = areaTpl.replace(/\{loop\}.*?\{\/loop\}/,tabsHtml);
                        }
                        
                    }else{
                        var areaHtml = areaTpl.replace(/\{loop\}.*?\{\/loop\}/,tabsHtml);
                    }
 
                    that.fill($areaElem,areaHtml);
                    that.addPtag($areaElem,ptag);
                    if(that.options.loopAreaEndCallback !== null  &&  typeof that.options.loopAreaEndCallback === 'function'){
                        that.options.loopAreaEndCallback(data,$areaElem,areaIndex);
                    }  
                });








        },

        /*
         * 拉取推荐位数据
         */
        getMarketCpcData : function(){
            var that = this;
            $.ajax({  
                type : 'GET', 
                url : 'http://static.paipaiimg.com/oprcdn/mart/act_'+ that.actId +'.js?t=' + Date.parse(new Date()),
                //url : 'http://opr.paipai.com/mart/activeshow?ids=' + that.actId + '&sort=1&url=' + encodeURIComponent(that.actUrl) + '&pcs=' + that.actPc  + '&t=' + Date.parse(new Date()),  
                //url : 'http://express.paipai.com/tws/martcpc/martcpcshow?actid=' + that.actId + '&url=' + encodeURIComponent(that.actUrl) + '&pc=' + that.actPc  + '&t=' + Date.parse(new Date()),  
                dataType : "jsonp",
                jsonpCallback : 'activeshow_'+ that.actId +'_cb',
                success : function(data){  
                    //if(data.errCode == 0){}
                    //var data = data.data[0];
                    var data = data.data;
                    var areaData = data.vecAreas;
                    for(var i in areaData){
                        that.loopAreaData(areaData[i],i);
                    }
                    if(that.options.renderedCallback !== null  &&  typeof that.options.renderedCallback === 'function'){
                        that.options.renderedCallback();
                    }                        
                    
                }  
            }); 
        },


        init : function(){

            this._setOptions();
            this.getMarketCpcData();
           
        }
    };

    // JQ插件模式
    $.fn.marketCpc = function (options) {
        return this.each(function () {
            var $me = $(this),
                instance = $me.data('marketcpc');
            if(!instance){
                instance = new MarketCpc(this, options);
                $me.data('marketcpc',instance );
            }else{
                instance.init();
            }
            if ($.type(options) === 'string') instance[options]();

        });
    };



    /**
     * 插件的默认值
     */
    $.fn.marketCpc.defaults = {
        fillMode : 'fill',
        renderedCallback : null,
        loopAreaBeginCallback : null,
        loopAreaEndCallback : null,
        loopTabsCallback : null,
        allFill : false
    };
})(jQuery);







(function ($) {
    function Auc(element, options) {
        this.ver = 1.0;
        this.$element = $(element);
        this.options = $.extend({}, $.fn.auc.defaults,options);
        this.init();
    }
    
    Auc.prototype = {

        /*
         * 获取元素data-marketcpc的相关配置
         */        
        _setOptions : function(){
            var allPoolIdArr = [];
            $('[data-auc-poolid]').each(function(index, el) {
                allPoolIdArr.push($(el).attr('data-auc-poolid'));
            });
            this.allPoolId = allPoolIdArr;
            
        },
        randomTimestamp: function(n,m){
            var c = m-n+1;  
            return Math.floor(Math.random() * c + n);
        },
        resetData : function(itemData,data){
            ////console.log(itemData);
            itemData.name = data.TITLE;
            itemData.clickUrl = data.URL;
            itemData.poolId = data.POOLID;
            if(itemData.aucType == '1'){
                itemData.itemImg = data.IMG;
            }else {
                itemData.itemImg = itemData.itemPic;
            }
            
            itemData.id = data.COMMODITYID;
            itemData.lastUpdate = $parseJSON(data.AREA_STOCK_INFO).lastUpdate_ut;
            itemData.price = (itemData.price/100).toFixed(2);
            if(itemData.aucType == '1'){
                itemData.begPrice = (itemData.begprice/100).toFixed(2);
            }else {
                itemData.begPrice = (itemData.begPrice/100).toFixed(2);
            }            
            
            if(itemData.itemImg.indexOf('http') > -1){
                ////console.log('a');
                itemData.itemImg = itemData.itemImg.replace('/00000000/','/'+this.imgTimeStamp +'/');
                var imgHead = itemData.itemImg.split('.jpg')[0];
            }else{
                ////console.log('b');
                var imgIndex = itemData.itemImg.split('.jpg')[0];
                var imgHead = 'http://img2.paipaiimg.com/'+ this.imgTimeStamp +'/' + imgIndex;
            }
            var now = new Date().getTime()/1000;



            if(itemData.remainStock == '0' || ( now - itemData.startTime >= 0 && now - itemData.endTime >= 0)){
                itemData.stateText = 'end';
                itemData.timeout = 0;
            }else if(now - itemData.startTime >= 0 && now - itemData.endTime <= 0 ){
                itemData.stateText = 'selling';
                timeoutFormat = this.GetDateDiff(this.getLocalTime(now),this.getLocalTime(itemData.startTime));
                itemData.timeout = now - itemData.endTime;
                itemData.timeoutFormat1 =  timeoutFormat[0]; 
                itemData.timeoutFormat2 =  timeoutFormat[1];
            }else if(now - itemData.startTime <= 0 &&  now - itemData.endTime <= 0){
                itemData.stateText = 'will';
                timeoutFormat = this.GetDateDiff(this.getLocalTime(now),this.getLocalTime(itemData.endTime));
                itemData.timeout = now - itemData.startTime;
                itemData.timeoutFormat1 =  timeoutFormat[0];
                itemData.timeoutFormat2 =  timeoutFormat[1];
            }
            itemData.startTimeFormart1 = this.dateFormat(new Date(parseInt(itemData.startTime) * 1000),"yyyy-MM-dd HH:mm");


            itemData.image = imgHead + '.200x200.jpg'; 
            itemData.img60x60 = imgHead + '.60x60.jpg'; 
            itemData.img80x80 = imgHead + '.80x80.jpg'; 
            itemData.img120x120 = imgHead + '.120x120.jpg'; 
            itemData.img160x160 = imgHead + '.160x160.jpg'; 
            itemData.img200x200 = imgHead + '.200x200.jpg'; 
            itemData.img300x300 = imgHead + '.300x300.jpg'; 

            return itemData;
        },
        resetJiangData : function(data){
            
            var id = data.itemid;
            data.id = id;
            data.name = data.title;
            var imgHead = 'http://img2.paipaiimg.com/'+ this.imgTimeStamp +'/item-' + this.imgTimeStamp + '-';
            data.image = imgHead + id + '.0.200x200.jpg'; 
            data.img60x60 = imgHead + id + '.0.60x60.jpg'; 
            data.img80x80 = imgHead + id + '.0.80x80.jpg'; 
            data.img120x120 = imgHead + id + '.0.120x120.jpg'; 
            data.img160x160 = imgHead + id + '.0.160x160.jpg'; 
            data.img200x200 = imgHead + id + '.0.200x200.jpg'; 
            data.img300x300 = imgHead + id + '.0.300x300.jpg';
            for(var i in data.aucData){
                data[i] = data.aucData[i];
            }
            data.begPrice = (data.begPrice/100).toFixed(2);
            data.price = (data.price/100).toFixed(2);
            data.clickUrl = 'http://p.paipai.com/d/'+ id +'.html?groupid=' + data.groupid;
            var now = new Date().getTime()/1000;



            if(data.remainStock == '0' || ( now - data.startTime >= 0 && now - data.endTime >= 0)){
                data.stateText = 'end';
                data.timeout = 0;
            }else if(now - data.startTime >= 0 && now - data.endTime <= 0 ){
                data.stateText = 'selling';
                timeoutFormat = this.GetDateDiff(this.getLocalTime(now),this.getLocalTime(data.startTime));
                data.timeout = now - data.endTime;
                data.timeoutFormat1 =  timeoutFormat[0]; 
                data.timeoutFormat2 =  timeoutFormat[1];
            }else if(now - data.startTime <= 0 &&  now - data.endTime <= 0){
                data.stateText = 'will';
                timeoutFormat = this.GetDateDiff(this.getLocalTime(now),this.getLocalTime(data.endTime));
                data.timeout = now - data.startTime;
                data.timeoutFormat1 =  timeoutFormat[0];
                data.timeoutFormat2 =  timeoutFormat[1];
            }
            data.startTimeFormart1 = this.dateFormat(new Date(parseInt(data.startTime) * 1000),"yyyy-MM-dd HH:mm");

        },
        loopFloorData : function(data){
            var newFloorData = [];
            for(var i in data){
                if(data[i].CUSTOMDATA == '[]'){
                    var extDataStr = data[i].EXTDATA;
                    exDataStr = extDataStr.substr(1);
                    var itemData = $parseJSON(exDataStr.substring(0,extDataStr.length - 2));
                }else{
                    var itemData = $parseJSON(data[i].CUSTOMDATA);
                }
                
                newFloorData.push(this.resetData(itemData,data[i]));
            }
            return newFloorData;


        },
        GetDateDiff : function(startTime, endTime) {
          startTime = startTime.replace(/\-/g, "/");

          endTime = endTime.replace(/\-/g, "/");



          var sTime = new Date(startTime);      //开始时间

          var eTime = new Date(endTime);  //结束时间

          var date_ms = eTime-sTime;

            //计算出相差天数
            var days=Math.floor(date_ms/(24*3600*1000));
            days = days.toString().length > 1 ? days :  '0'+ days;
            //计算出小时数
            var leave1=date_ms%(24*3600*1000) //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000));
            hours = hours.toString().length > 1 ? hours :  '0'+ hours;
            //计算相差分钟数
            var leave2=leave1%(3600*1000) //计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000));
            minutes = minutes.toString().length > 1 ? minutes :  '0'+ minutes;
            //计算相差秒数
            var leave3=leave2%(60*1000) //计算分钟数后剩余的毫秒数
            var seconds=Math.round(leave3/1000);

            seconds = seconds.toString().length > 1 ? seconds :  '0'+ seconds;

            daysReturnStr1 = days.toString() == '00' ? '':"<span class='days'>" + days + "</span> +  " + decodeURIComponent('%E5%A4%A9');//天
            daysReturnStr2 = days.toString() == '00' ? '':days+":";


            return [daysReturnStr1+"<span class='hours'>" + hours + "</span>" + ":" + "<span class='min'>"  +  minutes + "</span>" + ":"+ "<span class='sec'>" + seconds + "</span>",daysReturnStr2+hours+":"+minutes+":"+seconds]

        },


        getLocalTime : function(nS) {     
           return this.dateFormat(new Date(parseInt(nS) * 1000),"yyyy-MM-dd HH:mm:ss");      
        },  
        dateFormat : function(date,fmt) {
            var o = {
            "M+" : date.getMonth() + 1, 
            "d+" : date.getDate(), 
            "h+" : date.getHours() % 12 == 0 ? 12 : date.getHours()%12, 
            "H+" : date.getHours(), 
            "m+" : date.getMinutes(), 
            "s+" : date.getSeconds(), 
            "q+" : Math.floor((date.getMonth()+3)/3), 
            "S" : date.getMilliseconds() 
            };
            var week = {
            "0" : "\u65e5",
            "1" : "\u4e00",
            "2" : "\u4e8c",
            "3" : "\u4e09",
            "4" : "\u56db",
            "5" : "\u4e94",
            "6" : "\u516d"
            };
            if(/(y+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            if(/(E+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[date.getDay()+""]);
            }
            for(var k in o){
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        },        
        renderTpl : function (reg,tpl, data) {
            tpl = tpl.replace(reg, function(match, key){
                return typeof data[key] !== undefined ? data[key] : '';
            });
            return tpl;
        },
        addPtag : function($areaElem,ptag){
            var that = this;
            if(ptag !== ''){
                $areaElem.find('a').each(function(index, el) {
                    var oHref = $(this).attr('href');
                    $(this).attr('href', oHref  + (oHref.indexOf('PTAG') > -1 || oHref.indexOf('ptag') > -1 ? '' : (oHref.indexOf('?') > -1 ?  '&PTAG=' + ptag :  '?PTAG=' + ptag ) ) );
                });
            }
        },        
        loopNewFloorData : function(){
            var data = this.floorData;
            for(var i in data){
                var floorHtml = '';
                var $targetNode = $('[data-auc-poolid="'+ data[i][0].poolId +'"]');
                var ptag = $targetNode.attr('data-ptag') || '';
                if($targetNode.html() == '' || $targetNode.html() == ' '){
                    for(var j in data[i]){
                             
                        var itemTpl = $targetNode.attr('data-auc-tpl').replace(/\?/gi,"&yen;");;
                        var reg = new RegExp(/{#([\w\-]+)\#}/g);
                        $itemTpl =  $(this.renderTpl(reg,itemTpl,data[i][j]));
                        if(this.options.loopItemCallback !== null  &&  typeof this.options.loopItemCallback === 'function'){
                            this.options.loopItemCallback(data[i][j],$itemTpl);
                        }

                        floorHtml += $itemTpl[0].outerHTML;
                    }
                    $targetNode.html(floorHtml);
                    this.addPtag($targetNode,ptag);
                    if(this.options.loopFloorCallback !== null  &&  typeof this.options.loopFloorCallback === 'function'){
                        this.options.loopFloorCallback(data[i],$targetNode);
                    }                     
                }else{
                    ////console.log('bbbbbbbbbb');
                    var index = 0;
                    for(var j in data[i]){
                             
                        var itemTpl = $targetNode.attr('data-auc-tpl');
                        var reg = new RegExp(/{#([\w\-]+)\#}/g);
                        
                        $itemDom = $targetNode.children().eq(index);
                        
                        if(this.options.intervalCallback !== null  &&  typeof this.options.intervalCallback === 'function'){
                            //console.log('sdfsdfsdfsfds');
                            this.options.intervalCallback(data[i][j],$itemDom);
                        }
                        index++;


                    }
                  
                }




            }
            if(this.options.renderedCallback !== null  &&  typeof this.options.renderedCallback === 'function'){
                this.options.renderedCallback(data,$('[data-auc-poolid]'));
            } 

        },


        /*
         * 拉取推荐位数据
         */
        getAucData : function(){
            var that = this;
            var allPoolId = this.allPoolId;
            
            var urlArr = [];
            var poolArr = [];
            var totoalArr = [];

            var index = 0;
            var dataArr = [];


            for(var i = 0; i < allPoolId.length; i++){
                if(allPoolId[i].indexOf('http') > -1){
                    urlArr.push(allPoolId[i]);
                }else{
                    poolArr.push(allPoolId[i]);
                }
                
            };



            var urlLoop = function(){

                if(index < urlArr.length){
                    urlReq();
                }else{
                    that.floorData = totoalArr;

                    that.loopNewFloorData();

                }
            }


            var urlReq = function(){

                    var piId = urlArr[index].substring(urlArr[index].lastIndexOf('/') + 1,urlArr[index].indexOf('.js'));
                    $.ajax({  
                        type : "GET", 
                        url : urlArr[index] + '?t=' + Date.parse(new Date()),  
                        dataType : "jsonp",
                        contentType: "application/x-javascript; charset=gbk",
                        jsonpCallback: piId, 
                        success : function(data){


                            var idArr = [];
                            for(var i = 0 ; i < data.itemData.length; i++){
                                idArr.push(data.itemData[i].id);
                            }
                            $.ajax({  
                                type : "GET", 
                                url : 'http://act.paipai.com/ershou/getproductinfo?itemid=' + idArr.toString() + '&t=' + Date.parse(new Date()),  
                                dataType : "jsonp",
                                success : function(data){
                                    
                                    var data = data.data;

                                    for(var j = 0; j < data.length; j++){

                                        data[j].poolId = urlArr[index];
                                        that.resetJiangData(data[j]);
                                    }
                                    totoalArr.push(data);
                                    index++;
                                    urlLoop();                                    


                                }  
                            }); 





                        }  
                    });   


            }

            if(poolArr.length > 0){
                var poolparam = poolArr.toString().replace(/,/gi,':0:0:::,') + ':0:0:::';
                $.ajax({  
                    type : 'GET', 
                    url : 'http://s0.smart.yixun.com/w/tf/gettfxbypid?type=jsonp&poolparam=' + poolparam + '&t=' + Date.parse(new Date()),  
                    dataType : "jsonp", 
                    jsonpCallback : 'ahaha',
                    success : function(data){  
                        var newData = [];
                        for(var i in data.data){
                            //console.log('=====');
                            totoalArr.push(that.loopFloorData(data.data[i]));
                        }
                        urlLoop();
                    }  
                }); 

            }else{
                urlLoop();
            }



        },


        init : function(){
            this.imgTimeStamp = this.randomTimestamp(10000000,20000000).toString();
            this._setOptions();
            this.getAucData();
           
        }
    };

    // JQ插件模式
    $.fn.auc = function (options) {
        return this.each(function () {
            var $me = $(this),
                instance = $me.data('auc');
            if(!instance){
                instance = new Auc(this, options);
                $me.data('auc',instance );
            }else{
                instance.init();
            }
            if ($.type(options) === 'string') instance[options]();

        });
    };



    /**
     * 插件的默认值
     */
    $.fn.auc.defaults = {
        fillMode : 'append',
        renderedCallback : null,
        loopItemCallback : null,
        loopFloorCallback : null,
        intervalCallback : null
    };
})(jQuery);
















$( document ).ready(function() {


    // 如果URL参数有APP，表示是在APP里打开这个活动，就需要修改商品链接
    if(getUrlParam(window.location.href,'app') == 1){
        $('a[href ^="http://auction1.paipai.com/"]').each(function(index, el) {
            var goodsLink = $(el).attr('href');
            var id = goodsLink.split('auction1.paipai.com/')[1];
            $(el).attr('href','qqbuyjump:/ppitem?itemId=' + id);
        });
    }


    function reciprocal(){
        window.daoshuInterval = window.setInterval(function(){
            var now = new Date().getTime()/1000;
            $('[data-auction-time-out]').each(function(index, el) {
                TimeReciprocal = TimeCalculate.GetDateDiff(TimeCalculate.getLocalTime(now),TimeCalculate.getLocalTime(parseInt($(this).attr('data-auction-time-out'))));
                //console.log(TimeReciprocal);
                if(TimeReciprocal[0].indexOf('-') > -1){
                    TimeReciprocal = TimeReciprocal.replace(/(\d+)/gi,'00').replace(/-/gi,'');
                }
                $(this).html(TimeReciprocal[0]);
            });    
        },1000);    

    }




    function aucInterval(){

        $('[data-auc-list]').auc({
            loopItemCallback: function(itemData,$itemDom){
                //console.log(itemData);
                // aucType:1 增价拍
                // aucType:2 降价拍
                if(itemData.aucType == 2){
                    //console.log($itemDom.find('.bid_num'));
                    $itemDom.find('.js_bid_num_row').hide();
                }else if(itemData.aucType == 1){
                    $itemDom.find('.js_opinterval_row').hide();
                }

                if(itemData.stateText == 'will'){
                    $itemDom.find('.js_end_info_row').hide();
                    $itemDom.find('.js_bid_num_row').hide();

                    $itemDom.find('.js_will_opt_row').show();
                    $itemDom.find('.js_selling_opt_row,.js_end_opt_row').hide();

                    $itemDom.find('.js_time_out_txt').html(decodeURIComponent('%E5%BC%80%E5%A7%8B'));//开始

                    $itemDom.find('.js_time_out_time').attr('data-auction-time-out',itemData.startTime);
                }else if(itemData.stateText == 'selling'){
                    $itemDom.find('.js_end_info_row').hide();


                    $itemDom.find('.js_end_opt_row,.js_will_opt_row').hide();
                    $itemDom.find('.js_selling_opt_row').show();

                    $itemDom.find('.js_time_out_txt').html(decodeURIComponent('%E7%BB%93%E6%9D%9F'));//结束
                    $itemDom.find('.js_time_out_time').attr('data-auction-time-out',itemData.endTime);
                }else if(itemData.stateText == 'end'){
                    $itemDom.find('.js_end_info_row').show();
                    $itemDom.find('.js_bid_num_row,.js_time_out_row,.js_opinterval_row').hide();

                    $itemDom.find('.js_selling_opt_row,.js_will_opt_row').hide();
                    $itemDom.find('.js_end_opt_row').show();

                    $itemDom.find('.js_time_out_row').remove();
                    $itemDom.addClass('end');
                }
                


            },loopFloorCallback : function(floorData,$floorDom){

            },renderedCallback : function(data,$allFloorDom){
                reciprocal();

            },intervalCallback : function(itemData,$itemDom){
                //console.log(itemData,$itemDom);
                $itemDom.find('.js_time_out_time').html(itemData.timeoutFomart1);
                $itemDom.find('.js_auction_price_inner').html(itemData.price);
                
                if(itemData.stateText == 'will'){
                    $itemDom.find('.js_end_info_row').hide();
                    $itemDom.find('.js_bid_num_row').hide();

                    $itemDom.find('.js_will_opt_row').show();
                    $itemDom.find('.js_selling_opt_row,.js_end_opt_row').hide();

                    $itemDom.find('.js_time_out_txt').html(decodeURIComponent('%E5%BC%80%E5%A7%8B'));//开始

                    $itemDom.find('.js_time_out_time').attr('data-auction-time-out',itemData.startTime);
                }else if(itemData.stateText == 'selling'){
                    $itemDom.find('.js_end_info_row').hide();


                    $itemDom.find('.js_end_opt_row,.js_will_opt_row').hide();
                    $itemDom.find('.js_selling_opt_row').show();

                    $itemDom.find('.js_time_out_txt').html(decodeURIComponent('%E7%BB%93%E6%9D%9F'));//结束
                    $itemDom.find('.js_time_out_time').attr('data-auction-time-out',itemData.endTime);
                }else if(itemData.stateText == 'end'){
                    $itemDom.find('.js_end_info_row').show();
                    $itemDom.find('.js_bid_num_row,.js_time_out_row,.js_opinterval_row').hide();

                    $itemDom.find('.js_selling_opt_row,.js_will_opt_row').hide();
                    $itemDom.find('.js_end_opt_row').show();

                    $itemDom.find('.js_time_out_row').remove();
                    $itemDom.addClass('end');
                }
                
                //daoshu();


            }
        });


    }


            var $window = $(window),
                    isIE6 = !-[1,]&&!window.XMLHttpRequest
            // 浮动菜单
            $.fn.floatBar = function(options){
                //console.log("floatBar load");
                var $obj = $(this),
                    o = $.extend($.fn.floatBar.defaults, $obj.data(),options),
                    wHeight = $window.height(),
                    fHeight = $obj.height(),
                    top = wHeight/2 - 300;      //中间偏上

                //重新设置样式
                $obj.css({
                    position:'fixed',
                    top:top,
                    left:'50%',
                    'margin-left':'498px'
                });
                //添加事件命名空间，方便区分事件来源
                $window.bind("scroll.floatBar resize.floatBar", function() {
                    var _availWidth = $window.width(),
                            _winHeight = $window.height();

                    //debugger;
                    //宽度大于1250 并且处于第二屏 则显示
                    if (_availWidth > o.minAvailWidth && $window.scrollTop() > _winHeight) {
                        $obj.show();
                        //IE6 浏览器判断
                        if (isIE6) {
                            var topValue = 10 + $window.scrollTop();
                            $obj.css({"top" : topValue ,'position':'absolute'});
                        }
                    } else {
                        $obj.hide();
                    }
                }).trigger('scroll');   //页面在非第一屏初始化时无法触发事件，需要手动触发
            };
            // /暴露插件的默认设置。这对于让插件的使用者更容易用较少的代码覆盖和修改插件。
            $.fn.floatBar.defaults = {
                minAvailWidth:1250
            };

            var $float = $("[data-toggle='floatbar']").parent();

            $float.floatBar();

    if(typeof(Pui) !== 'undefined'){
        $(document).lazyloader({
             srcLazyAttr: 'data-lazy-img'
        });        
    }



    if($("[data-loadpi-list]").length > 0){
        $("[data-loadpi-list]").loadPI({
            renderedCallback : function($dom,data){
                if(typeof(Pui) !== 'undefined'){
                    $(document).lazyloader('load');       
                }

                // 如果URL参数有APP，表示是在APP里打开这个活动，就需要修改商品链接
                if(getUrlParam(window.location.href,'app') == 1){
                    $dom.find('a[href ^="http://auction1.paipai.com/"]').each(function(index, el) {
                        var goodsLink = $(el).attr('href');
                        var id = goodsLink.split('auction1.paipai.com/')[1];
                        $(el).attr('href','qqbuyjump:/ppitem?itemId=' + id);
                    });
                }  

 
            }
        });
    }

    if($("[data-marketcpc-list]").length > 0){
        $('[data-marketcpc-list]').marketCpc({
            renderedCallback : function($dom){
                if(typeof(Pui) !== 'undefined'){
                    $(document).lazyloader('load');       
                }

            },
            loopAreaEndCallback : function(data,$dom,index){
                if(getUrlParam(window.location.href,'app') == 1){
                    $dom.find('a[href ^="http://express.paipai.com/"],a[href ^="http://auction.paipai.com/"]').each(function(index, el) {
                        var goodsLink = getUrlParam($(el).attr('href'),'url');
                        var id = goodsLink.split('auction1.paipai.com%2F')[1];
                        $(el).attr('href','qqbuyjump:/ppitem?itemId=' + id);
                    });
                }

                //var pp12WhiteList = pp12WhiteList || undefined;
                //var isUrlInS12 = isUrlInS12 || undefined;
                //console.log(pp12WhiteList,isUrlInS12);
                // 双十二商品列表按钮文字变加购物车
                if(pp12WhiteList && isUrlInS12  && isUrlInS12 == true){
                    var s12Time = (new Date("2014/12/10 22:00:00")).getTime();
                    var now = (new Date()).getTime();
                    if(now < s12Time){
                        $dom.find('.g_btn a').each(function(index, el) {
                            $(el).html('\u52a0\u8d2d\u7269\u8f66');
                        });
                    }

                }

            },
            loopTabsCallback : function(data){
                //console.log(data.discountTxt);
            } 
        });

    }

    if($('[data-auc-list]').length > 0){
      aucInterval();
      window.setInterval(aucInterval,20000);
    }



    // 背景lazyload
    var $willBgItems= $("[data-lazy-bg]");
    if ($willBgItems.length>0){
        var topArray=[];
        var $willDistance = $(window).height()*1.8;
        $willBgItems.each(function(i,element){
            topArray[i]=$(element).offset().top
        });
        function updateImage(){
            $willBgItems.each(function(i,element){
                if ($(element).data("lazy-bg").length>0 && $(element).data("lazy-bg")!=element.style.backgroundImage.replace(/"|'/g,"").replace(/url\(|\)$/ig, "")){
                    if (topArray[i]<$(window).scrollTop()+$willDistance){
                        $(element).css({
                            "background-image":'url('+$(element).data("lazy-bg")+')'
                        })
                    }
                }
            });
        }
        updateImage();
        $(window).bind("scroll", function (event) {
            updateImage();
        })
    }




});