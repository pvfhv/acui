/*
 * 碰撞检测
 * $dragObj被拖动物体
 * $target要被碰撞的物体
 */
function isCollide($dragObj, $target) {
	var aRes = [];
	$target.each(function(index, ele) {
		//获得碰撞的对象
		var $ele = $(ele),
			$this = $dragObj,
			l1 = $ele.offset().left,
			r1 = l1 + $ele.width(),
			t1 = $ele.offset().top,
			d1 = t1 + $ele.height(),
			l2 = $this.offset().left,
			r2 = l2 + $this.width(),
			t2 = $this.offset().top,
			d2 = t2 + $this.height();


		if (!(r2 < l1 || l2 > r1 || d2 < t1 || t2 > d1)) {
			aRes.push($ele);
		}
	});

	return aRes;
}

/*
 * 从指定范围中随机返回一个元素
 * start:起始位置
 * end:终止位置
 */
function getRandomNum(start, end) {
	return Math.floor(Math.random() * (end - start + 1) + start);
}

/*
 * 从指定数组中获得指定数量的随机元素
 * arr:指定的数组
 * aOther:arr中元素不足n时，从此数组中补齐n个
 * n:要获得的数量
 *
 * return:{
 * 	display:未显示过的数字
 *  aRes:[长度为n的数组]
 * }
 */
function getNnumFromArr(arr, aOther, n) {
	var oRes = {
			display: null,
			aRes: []
		},
		l = arr.length;

	function _setRes(arrTemp) {
		var aTemp = [].concat(arrTemp);
		while (oRes.aRes.length != n) {

			var r = getRandomNum(0, aTemp.length - 1);
			oRes.aRes.push(aTemp.splice(r, 1)[0]);
		}
	}

	if (l >= n) {
		_setRes(arr);
		oRes.display = oRes.aRes[getRandomNum(0, oRes.aRes.length - 1)];
	} else if (l > 0 && l < n) {
		oRes.aRes = oRes.aRes.concat(arr);

		//此值必须在此赋，避免值在正确的数组中
		oRes.display = oRes.aRes[getRandomNum(0, oRes.aRes.length - 1)];
		_setRes(aOther);
	}

	return oRes;
}