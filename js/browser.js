var browser = {
	versions: function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return {
			trident: u.indexOf('Trident') > -1,
			presto: u.indexOf('Presto') > -1,
			webKit: u.indexOf('AppleWebKit') > -1,
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
			mobile: !!u.match(/AppleWebKit.*Mobile.*/),
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && u.indexOf('MiuiBrowser') == -1,
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('MiuiBrowser') > -1,
			iPhone: u.indexOf('iPhone') > -1 && u.indexOf('MiuiBrowser') == -1,
			iPad: u.indexOf('iPad') > -1,
			wp: u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
			Nokia: u.indexOf('Symbian') > -1,
			webApp: u.indexOf('Safari') == -1
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
};