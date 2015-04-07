var zIndex = 2,
	iToLeft = 0,
	nCount=7;

$('#ico_list li').on('click', function() {
	var $this = $(this),
		index = $(this).index();
	$('#pic_list li').eq(index).animate({
		'opacity': 1,
		'z-index': zIndex++
	}, 'slow').siblings().animate({
		'opacity': 0
	}, 'slow');

	$('#text_list li').eq(index).children().addClass('show').parent().siblings().children().removeClass('show');
	$(this).addClass('active').siblings().removeClass('active');
});

//上一个
$('#btn_prev').on('click', function() {
	var w = $('#ico_list li').width();
	iToLeft--;

	if (iToLeft >= 0) {
		$('#btn_next').addClass('showBtn');
		$('#ico_list ul').css('left', '+=' + w);
		
		if(iToLeft==0){
			$(this).removeClass('showBtn');
		}
	} else {
		iToLeft = 0;
		$(this).removeClass('showBtn');
	}
});

//下一个
$('#btn_next').on('click', function() {
	var w = $('#ico_list li').width();
	iToLeft++;

	if (iToLeft <= nCount) {
		$('#btn_prev').addClass('showBtn');
		$('#ico_list ul').css('left', '-=' + w);
		
		if(iToLeft==nCount){
			$(this).removeClass('showBtn');
		}
	} else {
		iToLeft = 0;
		$('#ico_list ul').css('left', 0);
		$('#btn_prev').removeClass('showBtn');
		$(this).removeClass('showBtn');
	}
});