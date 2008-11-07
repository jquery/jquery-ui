/* Persian (Farsi) Translation for the jQuery UI date picker plugin. */
/* Javad Mowlanezhad -- jmowla@gmail.com */
/* Jalali calendar should supported soon! (Its implemented but I have to test it) */
jQuery(function($) {
	$.datepicker.regional['fa'] = {
		clearText: 'حذف تاريخ', clearStatus: 'پاک کردن تاريخ جاري',
		closeText: 'بستن', closeStatus: 'بستن بدون اعمال تغييرات',
		prevText: '&#x3c;قبلي', prevStatus: 'نمايش ماه قبل',
		prevBigText: '&#x3c;&#x3c;', prevBigStatus: '',
		nextText: 'بعدي&#x3e;', nextStatus: 'نمايش ماه بعد',
		nextBigText: '&#x3e;&#x3e;', nextBigStatus: '',
		currentText: 'امروز', currentStatus: 'نمايش ماه جاري',
		monthNames: ['فروردين','ارديبهشت','خرداد','تير','مرداد','شهريور',
		'مهر','آبان','آذر','دي','بهمن','اسفند'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthStatus: 'نمايش ماه متفاوت', yearStatus: 'نمايش سال متفاوت',
		weekHeader: 'هف', weekStatus: 'هفتهِ سال',
		dayNames: ['يکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'],
		dayNamesShort: ['ي','د','س','چ','پ','ج', 'ش'],
		dayNamesMin: ['ي','د','س','چ','پ','ج', 'ش'],
		dayStatus: 'قبول DD بعنوان اولين روز هفته', dateStatus: 'انتخاب D, M d',
		dateFormat: 'yy/mm/dd', firstDay: 6,
		initStatus: 'انتخاب تاريخ', isRTL: true};
	$.datepicker.setDefaults($.datepicker.regional['fa']);
});